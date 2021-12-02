import PostmanSDK from 'postman-collection'
import {UUID, writeJsonFileSync, getSaveFilePath, getContentFromFilePath, getSingleSelectFilePath} from './global_utils'
import {deleteCollection, saveCollection, importCollection} from '@/utils/database_utils'
import {queryEnvironmentMeta, updateEnvironmentMeta, insertEnvironmentMeta} from '@/database/environment_meta'
import {publishCollectionSave} from '@/utils/event_utils'
import {getCurrentWorkspaceId, getCurrentWorkspace} from '@/utils/store_utils';
import {queryWorkspaceMetaById, updateWorkspaceMeta} from '@/database/workspace_meta'
import { ToastContainer, toast } from 'react-toastify';
import {ImportType, VariableScopeType, getVariableScopeType} from '@/enums'
const {Url, QueryParam, PropertyList, Collection, ItemGroup, Item} = PostmanSDK

const getRequestScript = (events, eventName) => {
    let targetEvents = events.listenersOwn(eventName),
    targetEvent = targetEvents.length > 0 ? targetEvents[0] : {};
    return targetEvent.script ? targetEvent.script.toSource() : ''
}

const getMelancholyVariables = (variables) => {
    return variables.map(o => {
        const {key, value, enabled} = o;
        return {
            id: UUID(),
            key: key,
            initialValue: value,
            currentValue: value,
            disabled: enabled === false
        }
    })
}

const getKeyValueArrToMelancholy = (keyValueArr = []) => {
    return keyValueArr.map(h => {
        let {key, value, description, disabled = false} = h;
        return {
            id: UUID(),
            key: key,
            value: value,
            disabled: disabled,
            description: description ? description.toString() : '',
        }
    })
}

const getUrlWithoutQueryString = (postmanUrl) => {
    postmanUrl.query = new PropertyList();
    return postmanUrl.toString();
}

const getCollectionMeta = (postmanItemGroup, parentId) => {
    const {name, auth, description, events, variables} = postmanItemGroup;
    let collectionMetaData = {
        name: name,
        parentId: parentId,
        description: description ? description.toString() : '',
        auth: auth ? auth.toJSON() : undefined,
        prerequest: getRequestScript(events, 'prerequest'),
        test: getRequestScript(events, 'test')
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
        header: getKeyValueArrToMelancholy(headers),
        description: description ? description.toString() : '',
        auth: auth ? auth.toJSON() : undefined,
        param: getKeyValueArrToMelancholy(queryParam),
        prerequest: this.getRequestScript(events, 'prerequest'),
        test: this.getRequestScript(events, 'test'),
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
            collectionMetaList = [...collectionMetaList, childCollectionMetaList];
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

export const parseImportContent = async (content, type, callback = () => {}) => {
    let toastContent;
    try {
        let fileJson = JSON.parse(content);
        switch (type) {
            case ImportType.COLLECTION.name(): 
                const {info} = fileJson;
                if (!info || !info.name) {
                    throw new Error("format error");
                }
                let postmanCollection = new Collection(fileJson);
                let collectionStatistics = getCollectionStatistics(postmanCollection);
                const {requestMetaList, collectionMetaList, collectionObj} = collectionStatistics;
                
                await importCollection(collectionObj, collectionMetaList, requestMetaList)
                publishCollectionSave(collectionMetaList[0]);
                toastContent = `Collection ${info.name} imported`;
                break;
            case ImportType.ENVIRONMENT.name(): 
                const {name, values, _postman_variable_scope} = fileJson;
                if (!(name && values && Array.isArray(values))) {
                    throw new Error("format error");
                }
                let variables = getMelancholyVariables(values);
                if (VariableScopeType.GLOBALS.code === _postman_variable_scope) {
                    let currentWorkspaceId = await getCurrentWorkspaceId();
                    await updateWorkspaceMeta(currentWorkspaceId, {$set: {variable: variables}});
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
                break;
            default: break;
        }
    } catch (err) {
        console.log(err);
        toast.error('Error while importing: format not recognized', {
            position: toast.POSITION.BOTTOM_RIGHT,
        })
        return;
    }
    
    toast.success(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
    })
    callback();
}

export const importFromFilePath = (filePath, type, callback) => {
    if (!filePath) return;
    let fileContent = getContentFromFilePath(filePath);
    parseImportContent(fileContent, type, callback);
}

export const importFromFile = (type, callback) => {
    let filePath = getSingleSelectFilePath();
    importFromFilePath(filePath, type, callback);
}