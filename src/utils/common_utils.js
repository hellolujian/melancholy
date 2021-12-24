import PostmanSDK from 'postman-collection'
import {UUID, writeJsonFileSync, getSaveFilePath, getContentFromFilePath, getSingleSelectFilePath} from './global_utils'
import { ToastContainer, toast } from 'react-toastify';
import {Modal} from 'antd'
import {RequestBodyModeType} from '@/enums'
const {Url, QueryParam, PropertyList, EventList, Event} = PostmanSDK

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

export const parseFullUrl = (fullUrl) => {
    if (!fullUrl) {
        return {url: '', param: []};
    }

    let urlJson = Url.parse(fullUrl);
    const postmanUrl = new Url(urlJson);
    let queryString = postmanUrl.getQueryString();
    let queryStringArr = [];
    if (queryString) {
        queryStringArr = QueryParam.parse(queryString);
        postmanUrl.query = new PropertyList();
    }
    let urlString = postmanUrl.toString();
    return {url: urlString, param: queryStringArr.map(item => ({...item, id: UUID()}))};  
}

export const getUrlWithoutQueryStringByFullUrl = (fullUrl) => {
    if (!fullUrl) return '';
    let urlJson = Url.parse(fullUrl);
    const postmanUrl = new Url(urlJson);
    postmanUrl.query = new PropertyList();
    return postmanUrl.toString();
}

// postman的event转db存储
export const postmanEventToDbScript = (events, eventName) => {
    let targetEvents = events.listenersOwn(eventName),
    targetEvent = targetEvents.length > 0 ? targetEvents[0] : {};
    return targetEvent.script ? targetEvent.script.toSource() : ''
}

// json对象转postman的EventList
export const parseEventsToPostman = (events = []) => {
    let eventList = new EventList();
    events.forEach(event => eventList.add(new Event(event)))
    return eventList;
}

export const getScriptFromEventsJson = (events) => {
    const eventList = parseEventsToPostman(events || []);
    const prerequest = postmanEventToDbScript(eventList, 'prerequest')
    const test = postmanEventToDbScript(eventList, 'test')
    return {
        prerequest: prerequest, test: test,
    }
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
        return undefined;
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

// json对象的list转db存储结构
export const normalDescAndDisabledListToMelancholyDbArr = (keyValueArr = []) => {
    return keyValueArr.map(h => {
        let {key, value, description = '', disabled = false} = h;
        return {
            id: UUID(),
            key: key,
            value: value,
            disabled: disabled,
            description: description,
        }
    })
}

// 普通的list对象转为db存储结构
export const exportedListToMelancholyDbArr = (keyValueArr = []) => {
    return keyValueArr.map(h => {
        let {key, value, description, enabled, type} = h;

        if (type === 'file') {
            return {
                id: UUID(), 
                key: key,
                src: Array.isArray(value) ? value : (value ? [value] : ''),
                description: description || '',
                type: type,
                disabled: enabled === false
            }
        } else {
            return {
                id: UUID(),
                key: key,
                value: value,
                description: description || '',
                disabled: enabled === false
            }
        }
    })
}

export const exportedFormdataJsonToMelancholy = (keyValueArr = []) => {
    return keyValueArr.map(item => {
        const {key, value, src, description = {}, disabled, type} = item;
        if (type === 'file') {
            return {
                id: UUID(), 
                key: key,
                src: Array.isArray(src) ? src : (src ? [src] : ''),
                description: description.content,
                type: type,
                disabled: disabled
            }
        } else {
            return {
                id: UUID(),
                key: key,
                value: value,
                description: description.content,
                disabled: disabled
            }
        }
    })
}

export const parseExportedBodyToMelancholy = (dumpRequestItem) => {
    const {dataMode, rawModeData, graphqlModeData, dataOptions, data} = dumpRequestItem;
    if (!dataMode) {
        return undefined;
    }
    switch (dataMode) {
        case 'params': 
            return {
                mode: RequestBodyModeType.FORMDATA.code,
                formdata: exportedListToMelancholyDbArr(data)
            }
        case RequestBodyModeType.URLENCODED.code: 
            return {
                mode: dataMode,
                [dataMode]: exportedListToMelancholyDbArr(data)
            }
        case RequestBodyModeType.RAW.code: 
            return {
                mode: dataMode,
                [dataMode]: rawModeData,
                options: dataOptions
            }
            case RequestBodyModeType.GRAPHQL.code: 
                return {
                    mode: dataMode,
                    [dataMode]: graphqlModeData,
                }
            case RequestBodyModeType.BINARY.code: 
                return {
                    mode: 'file',
                    file: {
                        src: rawModeData
                    },
                }
        default: 
            return {
                mode: dataMode,
                [dataMode]: rawModeData
            };
    }
}

export const confirmModal = (modalProps = {}) => {
    Modal.confirm({
        title: 'DELETE',
        icon: null,
        closable: true,
        width: 530,
        okText: 'Delete',
        cancelText: 'Cancel',
        zIndex: 999999,
        okButtonProps: { 
            danger: true,
        },
        ...modalProps,
    });
}
