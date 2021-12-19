import PostmanSDK from 'postman-collection'
import {UUID, getContentFromFilePath, getSingleSelectFilePath} from './global_utils'
import {getMelancholyDBVariables, postmanEventToDbScript, postmanListToMelancholyDbArr, 
    getUrlWithoutQueryString, getCopyMelancholyDBVariables, exportedListToMelancholyDbArr,
    parseFullUrl, getScriptFromEventsJson, getUrlWithoutQueryStringByFullUrl, 
    exportedFormdataJsonToMelancholy, parseExportedBodyToMelancholy, normalDescAndDisabledListToMelancholyDbArr
} from './common_utils'
import {deleteCollection, saveCollection, importCollection} from '@/utils/database_utils'
import {queryEnvironmentMeta, updateEnvironmentMeta, insertEnvironmentMeta} from '@/database/environment_meta'
import {publishCollectionSave, publishImportCollectionModalShow, publishRequestDelete} from '@/utils/event_utils'
import {getCurrentWorkspaceId, getCurrentWorkspace} from '@/utils/store_utils';
import {queryWorkspaceMetaById, updateWorkspaceMeta} from '@/database/workspace_meta'

import {queryCollectionMetaById, queryCollectionMetaByName} from '@/database/collection_meta'
import {insertHeaderPreset, queryHeaderPreset, updateHeaderPreset} from '@/database/header_preset'
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
    if (body) {
        console.log('===================body.tojosn()==========');
        console.log(body.toJSON())
        const bodyJson = body.toJSON();
        const {mode} = bodyJson;
        const modeData = bodyJson[mode];
        const bodyDbObj = {
            ...bodyJson
        }
        switch (mode) {
            case 'formdata':
            case "urlencoded": 
                bodyDbObj[mode] =  exportedFormdataJsonToMelancholy(modeData)
                return {...requestMetaData, body: bodyDbObj}
            default: return {...requestMetaData, body: bodyDbObj}
        }
    } 
   
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
    const {info, item, name, values, collections} = fileJson;
    if (info && info.name && item) {
        return ImportType.COLLECTION.name();
    }
    if (name && values && Array.isArray(values)) {
        return ImportType.ENVIRONMENT.name();
    }
    if (collections && Array.isArray(collections)) {
        return ImportType.DUMP.name();
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

const importEnvironment = async (fileJson) => {
    let toastContent = '';
    const {name, values, _postman_variable_scope} = fileJson;
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
            name: name,
            variable: variables
        };
        await insertEnvironmentMeta(envDbObject);
        toastContent = `${VariableScopeType.ENVIRONMENT.label} ${name} imported`
    }
    return toastContent;
}

const getCollectionDbObj = (item, folders, requests, parentId) => {
    const {name, order, folders_order, description, auth, events, variables} = item;
    let items = [];
    let collectionId = UUID();
    let collectionMetaList = [{
        id: collectionId, 
        parentId: parentId,
        name: name, 
        description: description,
        auth: auth ? auth : undefined,
        ...getScriptFromEventsJson(events),
        variable: normalDescAndDisabledListToMelancholyDbArr(variables)
    }]
    let requestMetaList = [];
    folders_order.forEach(folderId => {
        let folderInfo = folders.find(folder => folder.id === folderId);
        if (folderInfo) {
            const childItemObj = getCollectionDbObj(folderInfo, folders, requests, collectionId);
            items.push(childItemObj.collectionObj);
            requestMetaList = [...requestMetaList, ...childItemObj.requestMetaList];
            collectionMetaList = [...collectionMetaList, ...childItemObj.collectionMetaList]
        }
    })
    order.forEach(requestId => {
        let requestInfo = requests.find(request => request.id === requestId);
        if (requestInfo) {
            let requestNewId = UUID();
            let {name, url, method, description, events, headerData, auth, queryParams} = requestInfo;
            items.push(
                {
                    id: requestNewId,
                    name: name,
                    method: method
                }
            );
            requestMetaList.push({
                id: requestNewId,
                parentId: collectionId,
                name: name,
                method: method,
                body: parseExportedBodyToMelancholy(requestInfo),
                header: exportedListToMelancholyDbArr(headerData),
                description: description,
                auth: auth ? auth : undefined,
                ...getScriptFromEventsJson(events),
                url: getUrlWithoutQueryStringByFullUrl(url),
                param: exportedListToMelancholyDbArr(queryParams)
            })
        }
    })
    return {
        collectionObj: {
            id: collectionId,
            name: name,
            items: items
        },
        requestMetaList: requestMetaList,
        collectionMetaList: collectionMetaList

    }
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
                toastContent = importEnvironment(fileJson)
                break;
            case ImportType.DUMP.name():
                const {collections, environments, headerPresets, globals} = fileJson;
                for (let env of environments) {
                    await importEnvironment(env);
                    
                } 
                await insertHeaderPreset(
                    headerPresets.map(headerPreset => {
                        const {name, headers} = headerPreset; 
                        return {
                            id: UUID(),
                            name: name,
                            preset: exportedListToMelancholyDbArr(headers)
                        }
                    })
                )
                for (let collection of collections) {
                    const {folders, requests} = collection;
                    let collectionDBItem = getCollectionDbObj(collection, folders, requests);
                    let {collectionMetaList, requestMetaList, collectionObj} = collectionDBItem;
                    await importCollection({...collectionObj, requestCount: requests.length}, collectionMetaList, requestMetaList)
                    publishCollectionSave();
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