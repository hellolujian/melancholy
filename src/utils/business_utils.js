import PostmanSDK from 'postman-collection'
import {UUID, getContentFromFilePath, getSingleSelectFilePath} from './global_utils'
import {getMelancholyDBVariables, postmanEventToDbScript, postmanListToMelancholyDbArr, 
    getUrlWithoutQueryString, getCopyMelancholyDBVariables
} from './common_utils'
import {deleteCollection, saveCollection, importCollection} from '@/utils/database_utils'
import {queryEnvironmentMeta, updateEnvironmentMeta, insertEnvironmentMeta} from '@/database/environment_meta'
import {publishCollectionSave, publishImportCollectionModalShow, publishRequestDelete} from '@/utils/event_utils'
import {getCurrentWorkspaceId, getCurrentWorkspace} from '@/utils/store_utils';
import {queryWorkspaceMetaById, updateWorkspaceMeta} from '@/database/workspace_meta'

import {queryCollectionMetaById, queryCollectionMetaByName} from '@/database/collection_meta'
import { ToastContainer, toast } from 'react-toastify';
import {ImportType, VariableScopeType, getVariableScopeType} from '@/enums'
const {Url, QueryParam, PropertyList, Collection, ItemGroup, Item} = PostmanSDK

const getCollectionMeta = (postmanItemGroup, parentId) => {
    const {name, auth, description, events, variables} = postmanItemGroup;
    let collectionMetaData = {
        name: name,
        parentId: parentId,
        description: description ? description.toString() : '',
        auth: auth ? auth.toJSON() : undefined,
        prerequest: postmanEventToDbScript(events, 'prerequest'),
        test: postmanEventToDbScript(events, 'test')
    }
    if (variables) {
        collectionMetaData.variable = variables.map(variable => {
            let {key, value, disabled} = variable.toJSON();
            return {id: UUID(), key: key, initialValue: value, currentValue: value, disabled: disabled}
        })
    }
    return collectionMetaData;
}

const getRequestMeta = (postmanItem, parentId) => {
    const {name, request, responses, events} = postmanItem;
    const {auth, body, description, headers, method, url} = request;
    const queryParam = url.toJSON().query;
    let requestMetaData = {
        parentId: parentId,
        name: name,
        url: getUrlWithoutQueryString(url),
        method: method,
        header: postmanListToMelancholyDbArr(headers),
        description: description ? description.toString() : '',
        auth: auth ? auth.toJSON() : undefined,
        param: postmanListToMelancholyDbArr(queryParam),
        prerequest: postmanEventToDbScript(events, 'prerequest'),
        test: postmanEventToDbScript(events, 'test'),
    }
    return body ? {...requestMetaData, body: body.toJSON} : requestMetaData
   
}

const getCollectionStatistics = (sourcePostmanCollection, parentId) => {
       
    let collectionId = UUID();
    let collectionMetaData = getCollectionMeta(sourcePostmanCollection, parentId);
    const {name, items} = sourcePostmanCollection;
    let collectionObj = {
        id: collectionId,
        name: name,
        items: []
    };
    let requestMetaList = [], collectionMetaList = [{...collectionMetaData, id: collectionId}];
    items.each(o => {
        console.log(o);
        console.log(ItemGroup.isItemGroup(o));
        if (ItemGroup.isItemGroup(o)) {
            let collectionChild = getCollectionStatistics(o, collectionId);
            const {requestMetaList: childRequestMetaList, collectionMetaList: childCollectionMetaList, collectionObj: childCollectionObj} = collectionChild;
            collectionObj.items.push(childCollectionObj);
            requestMetaList = [...requestMetaList, ...childRequestMetaList];
            collectionMetaList = [...collectionMetaList, ...childCollectionMetaList];
        } else if (Item.isItem(o)) {
            
            const {name, request} = o;
            const {method} = request;
            const requestMetaId = UUID();
            let requestMetaData = getRequestMeta(o, collectionId);
            requestMetaList.push({...requestMetaData, id: requestMetaId});
            collectionObj.items.push({
                id: requestMetaId,
                name: name,
                method: method,
            });
        } 
    })
    return {
        collectionObj: collectionObj,
        requestMetaList: requestMetaList,
        collectionMetaList: collectionMetaList
    };
}

export const checkImportType = (fileJson) => {
    const {info, item, name, values} = fileJson;
    if (info && info.name && item) {
        return ImportType.COLLECTION.name();
    }
    if (name && values && Array.isArray(values)) {
        return ImportType.ENVIRONMENT.name();
    }

}

export const parseCollectionJsonFile = async (fileJson) => {
    console.log(fileJson);
    let postmanCollection = new Collection(fileJson);
    let collectionStatistics = getCollectionStatistics(postmanCollection);
    const {requestMetaList, collectionMetaList, collectionObj} = collectionStatistics;
    
    await importCollection(collectionObj, collectionMetaList, requestMetaList)
    publishCollectionSave(collectionMetaList[0]);
}

export const parseImportContent = async (content, type, callback = () => {}) => {
    
    let toastContent;
    try {
        let fileJson = JSON.parse(content);
        let importType = checkImportType(fileJson);
        if (!importType) {
            throw new Error("format error");
        } else if (!type) {
            type = importType
        } else if (type !== importType) {
            throw new Error("format error");
        }
        switch (type) {
            case ImportType.COLLECTION.name(): 
                const {info} = fileJson;
                const {name: collectionName} = info;
                let existCollectionInfo = await queryCollectionMetaByName(collectionName)
                if (existCollectionInfo.length > 0) {
                    publishImportCollectionModalShow({fileJson: fileJson, existCollectionId: existCollectionInfo[0].id})
                } else {
                    await parseCollectionJsonFile(fileJson)
                    toastContent = `Collection ${collectionName} imported`;
                }
                
                break;
            case ImportType.ENVIRONMENT.name(): 
                const {name: environmentName, values, _postman_variable_scope} = fileJson;
                let variables = getMelancholyDBVariables(values);
                if (VariableScopeType.GLOBALS.code === _postman_variable_scope) {
                    let currentWorkspace = await getCurrentWorkspace();
                    const {id: currentWorkspaceId, variable} = currentWorkspace;
                    const alreadyVariable = getCopyMelancholyDBVariables(variable)
                    await updateWorkspaceMeta(currentWorkspaceId, {$set: {variable: [...alreadyVariable, ...variables]}});
                    toastContent = `${VariableScopeType.GLOBALS.label} imported`;
                } else {
                    let envDbObject = {
                        id: UUID(),
                        name: environmentName,
                        variable: variables
                    };
                    await insertEnvironmentMeta(envDbObject);
                    toastContent = `${VariableScopeType.ENVIRONMENT.label} ${environmentName} imported`
                }
                break;
            default: break;
        }
        if (toastContent) {
            toast.success(toastContent, {
                position: toast.POSITION.BOTTOM_RIGHT,
            })
            await callback();
        }
        
    } catch (err) {
        console.log(err);
        toast.error('Error while importing: format not recognized', {
            position: toast.POSITION.BOTTOM_RIGHT,
        })
        return;
    }
    
}

export const importFromFilePath = (filePath, type, callback) => {
    if (!filePath) return;
    let filePathArr = Array.isArray(filePath) ? [...filePath] : [filePath];
    filePathArr.forEach(filePath => {
        let fileContent = getContentFromFilePath(filePath);
        parseImportContent(fileContent, type, callback);
    })
    
}

export const importFromFile = (type, callback) => {
    let filePath = getSingleSelectFilePath();
    importFromFilePath(filePath, type, callback);
}

export const executeDeleteCollection = async (id) => {
    let childrenReqs = await deleteCollection(id);
    childrenReqs.forEach(child => {
        publishRequestDelete({id: child.id,})
    })
}