// 阻止点击事件冒泡
const stopClickPropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
}

export { 
    stopClickPropagation
}