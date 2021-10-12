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

export { 
    stopClickPropagation, UUID, getTextSize
}