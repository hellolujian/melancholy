// 阻止点击事件冒泡
const stopClickPropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
}

const UUID = () => {
    const { v4: uuidv4 } = require("uuid");
    return uuidv4();
}

export { 
    stopClickPropagation, UUID
}