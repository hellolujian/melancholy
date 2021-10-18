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

export { 
    stopClickPropagation, UUID, getTextSize, compareObject
}