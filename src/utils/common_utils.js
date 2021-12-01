import PostmanSDK from 'postman-collection'
import {UUID} from './global_utils'
const {Url, QueryParam, PropertyList} = PostmanSDK

export const getFullUrl = (requestMeta) => {
    const {url = '', param} = requestMeta;
    let queryString = QueryParam.unparse(param);
    let urlWithQuery = url + (queryString ? ("?" + queryString) : "")
    return urlWithQuery;
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
        const {key, initialValue, disabled} = variableItem;
        return {
            key: key,
            value: initialValue,
            enabled: disabled !== true
        }
    })
}