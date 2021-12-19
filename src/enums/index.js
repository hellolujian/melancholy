import { DEL_REQUEST_ICON, BOOTCAMP_ICON, EXAMPLE_ICON, POST_REQUEST_ICON, GET_REQUEST_ICON, PATCH_REQUEST_ICON, PUT_REQUEST_ICON } from 'ui/constants/icons'
import {TEXT_ICON,} from 'ui/constants/icons'
const Enum = require('node-enumjs');

export const TabType = Enum.define("TabType", ["REQUEST", "EXAMPLE", "BOOTCAMP"])

export const ImportType = Enum.define("ImportType", ["COLLECTION", "DUMP", "ENVIRONMENT"])

export const VariableScopeType = Enum.define("VariableScopeType", {
    constants: {
        ENVIRONMENT: {
            code: 'environment', 
            label: 'Environment',
        },
        GLOBALS: {
            code: 'globals',
            label: 'Globals',
        }
    }
});


export const getVariableScopeType = (type) => {
    let target = VariableScopeType.values().find(item => item.code === type) || VariableScopeType.ENVIRONMENT;
    return target.label
}

export const TabIconType = Enum.define("TabIconType", {
    constants: {
        GET: {
            code: 'get',
            icon: GET_REQUEST_ICON
        },
        POST: {
            code: 'post',
            icon: POST_REQUEST_ICON
        },
        PUT: {
            code: 'put',
            icon: PUT_REQUEST_ICON
        },
        DELETE: {
            code: 'delete',
            icon: DEL_REQUEST_ICON
        },
        EXAMPLE: {
            code: 'example',
            icon: EXAMPLE_ICON
        },
        BOOTCAMP: {
            code: 'bootcamp',
            icon: BOOTCAMP_ICON
        } 
    }
});

export const getIconByCode = (code = 'get') => {
    let target = TabIconType.values().find(item => item.code === code || item.code.toUpperCase() === code);
    if (target) {
        return target.icon;
    }
    return TEXT_ICON(code.toUpperCase(), {width: code.length * 8});
}

export const AuthSceneType = Enum.define("AuthSceneType", ["REQUEST", "COLLECTION", "FOLDER", "WORKSPACE"])
export const CommonValueType = Enum.define("CommonValueType", ["GLOBALS", ])

export const OptType = Enum.define("OptType", ["ADD", "DEL", "UPDATE"])

export const RequestBodyModeType = Enum.define("RequestBodyModeType", {
    constants: {
        NONE: {
            code: 'none',
            label: 'none',
            icon: POST_REQUEST_ICON
        },
        FORMDATA: {
            code: 'formdata',
            label: 'form-data',
            icon: PUT_REQUEST_ICON
        },
        URLENCODED: {
            code: 'urlencoded',
            label: 'x-www-form-urlencoded',
            icon: DEL_REQUEST_ICON
        },
        RAW: {
            code: 'raw',
            label: 'raw',
            icon: GET_REQUEST_ICON
        },
        BINARY: {
            code: 'binary',
            label: 'binary',
            icon: EXAMPLE_ICON
        },
        GRAPHQL: {
            code: 'graphql',
            label: 'GraphQL',
            icon: BOOTCAMP_ICON
        } 
    },
    methods: {
        
        // surfaceGravity: function() {
        //     var G = 6.67300E-11;
        //     return (G * this.mass) / Math.pow(this.radius, 2);
        // },
        // surfaceWeight: function(mass) {
        //     return mass * this.surfaceGravity();
        // }
    }
});