import PostmanSDK from 'postman-collection'
import {UUID, writeJsonFileSync, getSaveFilePath, getContentFromFilePath, getSingleSelectFilePath} from './global_utils'
import { ToastContainer, toast } from 'react-toastify';
const {Url, QueryParam, PropertyList} = PostmanSDK

export const getFullUrl = (requestMeta) => {
    const {url = '', param} = requestMeta;
    let queryString = QueryParam.unparse(param);
    let urlWithQuery = url + (queryString ? ("?" + queryString) : "")
    return urlWithQuery;
}

export const getPostmanUrl = (url = '', param = []) => {
    let urlopt = Url.parse(url);
    let postmanUrl = new Url(urlopt);
    param.forEach(item => {
        postmanUrl.addQueryParams(param)
    })
    return postmanUrl
}

export const getUrlString = (url, param) => {
    let postmanUrl = getPostmanUrl(url, param);
    return postmanUrl.toString();
}

export const getPostmanUrlJson = (url, param) => {
    let postmanUrl = getPostmanUrl(url, param);
    let postmanJson = postmanUrl.toJSON();
    delete postmanJson.variable;
    return postmanJson;
}

export const getExportKeyValueArr = (sourceArr = []) => {
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

export const getExportKeyValueDisabledArr = (sourceArr = []) => {
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

export const getEventItem = (code, listen) => {
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
            events.push(getEventItem(prerequest, 'prerequest'));
        }
        if (test) {
            events.push(getEventItem(test, 'test'));
        }
        return events;
    } else {
        return null;
    }
}

export const getVariableExportArr = (variables = []) => {
    return variables.map(variableItem => {
        const {key, initialValue = '', disabled} = variableItem;
        return {
            key: key,
            value: initialValue,
            enabled: disabled !== true
        }
    })
}

export const getVariableExportDisabledArr = (variables = []) => {
    return variables.map(variableItem => {
        const {key, initialValue, disabled, id} = variableItem;
        return {
            id: id,
            key: key,
            value: initialValue,
            disabled: disabled
        }
    })
}

// export const getVariableArrFromImport = (variables = []) => {
//     return variables.map(variableItem => {
//         const {key, initialValue, disabled, id} = variableItem;
//         return {
//             id: id,
//             key: key,
//             value: initialValue,
//             disabled: disabled
//         }
//     })
// }

