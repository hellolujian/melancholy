const storeUtil = window.require('@electron/remote').getGlobal('STORE_UTIL');

const currentWorkspace = window.require('@electron/remote').getGlobal('CURRENT_WORKSPACE');

const {getValue, setValue} = storeUtil;
const getStoreValue = (key) => {
    return getValue(key)
}

const setStoreValue = (key, value) => {
    return setValue(key, value)
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

export { 
    getStoreValue, setStoreValue, getCurrentWorkspaceId, currentWorkspaceIdQuery
}