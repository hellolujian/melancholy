const storeUtil = window.require('@electron/remote').getGlobal('STORE_UTIL');

const currentWorkspace = window.require('@electron/remote').getGlobal('CURRENT_WORKSPACE');

const {getValue, setValue} = storeUtil;
const getStoreValue = (key, defaultValue) => {
    let storeValue = getValue(key)
    return storeValue === undefined || storeValue === null ? defaultValue : storeValue;
}

const setStoreValue = (key, value, fileName, callback) => {
    if (value === undefined) return;
    setValue(key, value, fileName, callback);
}

const setStoreValueWithCallback = (key, value, callback) => {
    setValue(key, value, undefined, callback);
}

const getCurrentWorkspace = async () => {
    let currentWorkspaceInfo = await currentWorkspace();
    return currentWorkspaceInfo;
}

const getCurrentWorkspaceId = async () => {
    let currentWorkspaceInfo = await currentWorkspace();
    return currentWorkspaceInfo.id;
}

const currentWorkspaceIdQuery = async () => {
    let workspaceId = await getCurrentWorkspaceId();
    return {
        workspaceId: workspaceId
    }
}

const getCurrentWorkspaceSession = async () => {
    let workspaceSessionArr = getStoreValue('workspaceSession') || [];
    let currentWorkspaceId = await getCurrentWorkspaceId();
    let currentWorkspace = workspaceSessionArr.find(workspace => workspace.workspaceId === currentWorkspaceId) || {};
    return currentWorkspace;
}

const setCurrentWorkspaceSession = async (updateObj) => {

    let workspaceSessionArr = getStoreValue('workspaceSession') || [];
    let currentWorkspaceId = await getCurrentWorkspaceId();
    let currentWorkspace = workspaceSessionArr.find(workspace => workspace.workspaceId === currentWorkspaceId) || {workspaceId: currentWorkspaceId};
    currentWorkspace = {...currentWorkspace, ...updateObj}
    let newArr = workspaceSessionArr.filter(workspace => workspace.workspaceId !== currentWorkspaceId);
    newArr.unshift(currentWorkspace);
    setStoreValue('workspaceSession', newArr);
}

const setCollectionTreeSelectedKey = (selectedKey) => {
    setStoreValue('collectionTreeSelectedKey', selectedKey);
}

const getCollectionTreeSelectedKey = () => {
    return getValue('collectionTreeSelectedKey');
}

export { 
    getStoreValue, setStoreValue, getCurrentWorkspaceId, currentWorkspaceIdQuery, 
    getCurrentWorkspaceSession, setCurrentWorkspaceSession, getCurrentWorkspace, 
    setStoreValueWithCallback, setCollectionTreeSelectedKey, getCollectionTreeSelectedKey
}