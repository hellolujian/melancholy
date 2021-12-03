import PostmanSDK from 'postman-collection'
import {UUID, writeJsonFileSync, getSaveFilePath, getContentFromFilePath, getSingleSelectFilePath} from './global_utils'
import { ToastContainer, toast } from 'react-toastify';
const {Url, QueryParam, PropertyList} = PostmanSDK

// 获取postmanUrl对象
export const getPostmanUrl = (url = '', param = []) => {
    let urlopt = Url.parse(url);
    let postmanUrl = new Url(urlopt);
    param.forEach(item => {
        postmanUrl.addQueryParams(param)
    })
    return postmanUrl
}

// 根据postman url对象获取不带querystring的字符串
export const getUrlWithoutQueryString = (postmanUrl) => {
    postmanUrl.query = new PropertyList();
    return postmanUrl.toString();
}

// 获取完整的url字符串
export const getUrlString = (url, param) => {
    let postmanUrl = getPostmanUrl(url, param);
    return postmanUrl.toString();
}

// 获取完整的url字符串
export const getFullUrl = (requestMeta) => {
    const {url, param} = requestMeta;
    return getUrlString(url, param);
}

// postman的event转db存储
export const postmanEventToDbScript = (events, eventName) => {
    let targetEvents = events.listenersOwn(eventName),
    targetEvent = targetEvents.length > 0 ? targetEvents[0] : {};
    return targetEvent.script ? targetEvent.script.toSource() : ''
}

export const getPostmanUrlJson = (url, param) => {
    let postmanUrl = getPostmanUrl(url, param);
    let postmanJson = postmanUrl.toJSON();
    delete postmanJson.variable;
    return postmanJson;
}

// 获取导出的带有enabled的keyvalue数组
export const getExportEnabledKeyValueArr = (sourceArr = []) => {
    return sourceArr.map(item => {
        const {key, value, description, disabled} = item;
        return {
            key: key, 
            value: value,
            description: description,
            enabled: disabled !== true
        }
    })
}

// 获取导出的带有disabled的keyvalue数组
export const getExportDisabledKeyValueArr = (sourceArr = []) => {
    return sourceArr.map(item => {
        const {key, value, description, disabled} = item;
        return {
            key: key, 
            value: value,
            description: description,
            disabled: disabled
        }
    })
}

export const getExportEventItem = (code, listen) => {
    return {
        listen: listen,
        script: {
            id: UUID(),
            type: 'text/javascript',
            exec: code.split('\n')
        }
    }
}

export const getEventExportObj = (prerequest, test) => {
    if (prerequest && test) {
        let events = [];
        if (prerequest) {
            events.push(getExportEventItem(prerequest, 'prerequest'));
        }
        if (test) {
            events.push(getExportEventItem(test, 'test'));
        }
        return events;
    } else {
        return null;
    }
}

// 获取变量导出带有enabled的数组
export const getVariableExportEnabledArr = (variables = []) => {
    return variables.map(variableItem => {
        const {key, initialValue = '', disabled} = variableItem;
        return {
            key: key,
            value: initialValue,
            enabled: disabled !== true
        }
    })
}

// 获取变量导出带有disabled的数组
export const getVariableExportDisabledArr = (variables = []) => {
    return variables.map(variableItem => {
        const {key, initialValue = '', disabled, id} = variableItem;
        return {
            id: id,
            key: key,
            value: initialValue,
            disabled: disabled
        }
    })
}

// 变量转为db的存储结构
export const getMelancholyDBVariables = (variables = []) => {
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

// 变量转为db的存储结构
export const getCopyMelancholyDBVariables = (variables = []) => {
    return variables.map(o => {
        const {key, value, disabled} = o;
        return {
            id: UUID(),
            key: key,
            initialValue: value,
            currentValue: value,
            disabled: disabled
        }
    })
}

// postman的list对象转为db存储结构
export const postmanListToMelancholyDbArr = (keyValueArr = []) => {
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
