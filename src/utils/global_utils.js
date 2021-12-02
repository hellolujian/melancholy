// 阻止点击事件冒泡
const stopClickPropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
}

const UUID = () => {
    const { v4: uuidv4 } = require("uuid");
    return uuidv4();
}

const getTextSize = (text) => {
    let span = document.createElement('span');
    let initWidth = span.offsetWidth;
    span.style.visibility = 'hidden';
    span.style.fontSize = '14px';
    span.style.fontFamily = '-apple-system, "PingFang SC", "Helvetica Neue", Helvetica,\n' +
        'STHeiTi, sans-serif';//字体 可以替换为项目中自己的字体
    span.style.display = "inline-block";
    document.body.appendChild(span);
    if (typeof span.textContent !== "undefined") {
        span.textContent = text;
    } else {
        span.innerText = text;
    }
    let moni = parseFloat(window.getComputedStyle(span).width) - initWidth;
    span.parentNode.removeChild(span);//删除节点
    return moni;
}

/**
 * 判断两个对象内容是否相等
 * @param {对象a} a 
 * @param {对象b} b 
 */
 const compareObject = (a, b) => {
    // 判断两个对象是否指向同一内存，指向同一内存返回true
    if (a === b) return true
    if (a === null || a === undefined || b === null || b === undefined) return false
    // 获取两个对象键值数组, 判断两个对象键值数组长度是否一致，不一致返回false
    let aProps = Object.getOwnPropertyNames(a)
    let bProps = Object.getOwnPropertyNames(b)
    if (aProps.length !== bProps.length) return false

    // 遍历对象的键值
    for (let prop in a) {
        // 判断a的键值，在b中是否存在，不存在，返回false
        if (b.hasOwnProperty(prop)) {
            // 判断a的键值是否为对象，是则递归，不是对象直接判断键值是否相等，不相等返回false
            if (typeof a[prop] === 'object') {
                if (!compareObject(a[prop], b[prop])) return false
            } else if (a[prop] !== b[prop]) {
                return false
            }
        } else {
            return false
        }
    }
    return true
}

/**
 * 判断两个对象内容是否相等
 * @param {对象a} a 
 * @param {对象b} b 
 */
 const compareObjectIgnoreEmpty = (a = '', b = '') => {
    // 判断两个对象是否指向同一内存，指向同一内存返回true
    if (a === b) return true
    if ((a === null || a === undefined || a === '' || (Array.isArray(a) && a.length === 0)) && (b === null || b === undefined || b === '' || (Array.isArray(b) && b.length === 0))) return true
    // 获取两个对象键值数组, 判断两个对象键值数组长度是否一致，不一致返回false
    let aProps = Object.getOwnPropertyNames(a)
    let bProps = Object.getOwnPropertyNames(b)
    // if (aProps.length !== bProps.length) return false
    let allProps = [...aProps];
    bProps.forEach(item => {
        if (!allProps.includes(item)) {
            allProps.push(item)
        }
    })

    // 遍历对象的键值
    for (let i = 0; i < allProps.length; i++) {
        let prop = allProps[i];
        let aValue = a[prop];
        let bValue = b[prop];
        if (typeof aValue === 'object' || typeof bValue === 'object') {
            if (!compareObjectIgnoreEmpty(aValue, bValue)) return false
        } else if ((aValue && !bValue) || (bValue && !aValue) || (aValue && bValue && aValue !== bValue)) {
            return false
        }
    }

    return true
}

const getSpecificFieldObj = (source = {}, keys = []) => {
    let newObj = {};
    keys.forEach(key => newObj[key] = source[key]);
    return newObj;
}

const writeFileSync = (filePath, fileContent) => {
    if (!filePath) return;
    const fs = window.require('fs');
    
    let result = fs.writeFileSync(  
        filePath,
        fileContent, 
        (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('写入成功')
            }
    });
    return result;
}

const writeJsonFileSync = (filePath, fileJson, callback = () => {}) => {
    writeFileSync(filePath, JSON.stringify(fileJson, "", "\t"), callback);
}

const getSaveFilePath = (fileProps = {}) => {
    const openFileSelect = window.require('@electron/remote').getGlobal('SHOW_SAVE_DIALOG');
    return openFileSelect({title: 'Select path to save file', ...fileProps});
}

const getSingleSelectFilePath = (fileProps = {}) => {
    const openFileSelect = window.require('@electron/remote').getGlobal('OPEN_FILES_ELECT_DIALOG');
    return openFileSelect(fileProps);
}

const saveJsonFileSync = (fileJson, fileProps = {}, callback) => {
    const openFileSelect = window.require('@electron/remote').getGlobal('SHOW_SAVE_DIALOG');
    let selectedFile = openFileSelect({title: 'Select path to save file', ...fileProps});
    writeJsonFileSync(selectedFile, fileJson, callback)
}

const getContentFromFilePath = (filePath) => {
    let fs = window.require('fs');
    return fs.readFileSync(filePath).toString()
}

const getJsonFromFile = (filePath) => {
    if (!filePath) return;
    let fs = window.require('fs');
    return JSON.parse(fs.readFileSync(filePath).toString());
}

let getValueByVariableType = (variable, param, ...rest) => {
    return typeof(variable) === 'function' ? variable(param, ...rest) : variable
}

export { 
    stopClickPropagation, UUID, getTextSize, 
    compareObject, compareObjectIgnoreEmpty, 
    getSpecificFieldObj, writeFileSync, getValueByVariableType,
    writeJsonFileSync, getJsonFromFile, saveJsonFileSync, getSaveFilePath,
    getContentFromFilePath, getSingleSelectFilePath
} 