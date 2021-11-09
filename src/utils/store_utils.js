const storeUtil = window.require('@electron/remote').getGlobal('STORE_UTIL');

const {getValue, setValue} = storeUtil;
const getStoreValue = (key) => {
    return getValue(key)
}

const setStoreValue = (key, value) => {
    return setValue(key, value)
}

export { 
    getStoreValue, setStoreValue
}