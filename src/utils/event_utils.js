import Pubsub from 'pubsub-js';

import {setStoreValue, getStoreValue} from '@/utils/store_utils'

const COLLECTION_MODAL_EVENT = 'collection_modal_event';
const COLLECTION_MODAL_EVENT_OPEN = `${COLLECTION_MODAL_EVENT}.open`
const COLLECTION_MODAL_EVENT_SAVE = `${COLLECTION_MODAL_EVENT}.save`

export const publish = (key, data) => {
    Pubsub.publish(key, data)
}

export const subscribe = (key, handle) => {
    Pubsub.subscribe(key, handle)
}

export const publishCollectionModalOpen = (data) => {
    publish(COLLECTION_MODAL_EVENT_OPEN, data)
}

export const subscribeCollectionModalOpen = (handle) => {
    subscribe(COLLECTION_MODAL_EVENT_OPEN, handle);
}

export const publishCollectionSave = (data) => {
    publish(COLLECTION_MODAL_EVENT_SAVE, data);
}

export const subscribeCollectionSave = (handle) => {
    subscribe(COLLECTION_MODAL_EVENT_SAVE, handle);
}

const ENVIRONMENT_MODAL_EVENT = 'environment_modal_event';
const ENVIRONMENT_MODAL_EVENT_OPEN = `${ENVIRONMENT_MODAL_EVENT}.open`
const ENVIRONMENT_MODAL_EVENT_SAVE = `${ENVIRONMENT_MODAL_EVENT}.save`

export const publishEnvironmentOpen = (data) => {
    publish(ENVIRONMENT_MODAL_EVENT_OPEN, data);
}

export const subscribeEnvironmentOpen = (handle) => {
    subscribe(ENVIRONMENT_MODAL_EVENT_OPEN, handle);
}

export const publishEnvironmentSave = (data) => {
    publish(ENVIRONMENT_MODAL_EVENT_SAVE, data);
}

export const subscribeEnvironmentSave = (handle) => {
    subscribe(ENVIRONMENT_MODAL_EVENT_SAVE, handle);
}

/**
 * ======================================保存请求==========================================
 */
const REQUEST_MODAL_EVENT = 'request_modal_event';
const REQUEST_MODAL_EVENT_OPEN = `${REQUEST_MODAL_EVENT}.open`
const REQUEST_MODAL_EVENT_SAVE = `${REQUEST_MODAL_EVENT}.save`
const REQUEST_MODAL_EVENT_DELETE = `${REQUEST_MODAL_EVENT}.delete`

export const publishRequestModalOpen = (data) => {
    publish(REQUEST_MODAL_EVENT_OPEN, data)
}

export const subscribeRequestModalOpen = (handle) => {
    
    subscribe(REQUEST_MODAL_EVENT_OPEN, handle);
}

export const publishRequestSave = (data) => {
    publish(REQUEST_MODAL_EVENT_SAVE, data);
}

export const subscribeRequestSave = (handle) => {
    subscribe(REQUEST_MODAL_EVENT_SAVE, handle);
}

export const publishRequestDelete = (data) => {
    publish(REQUEST_MODAL_EVENT_DELETE, data);
}

export const subscribeRequestDelete = (handle) => {
    subscribe(REQUEST_MODAL_EVENT_DELETE, handle);
}

/**
 * ======================================选中请求==========================================
 */
const REQUEST_SELECTED_EVENT = 'request_selected_event';

export const publishRequestSelected = (data) => {
    publish(REQUEST_SELECTED_EVENT, data)
}

export const subscribeRequestSelected = (handle) => {
    subscribe(REQUEST_SELECTED_EVENT, handle);
}

 /**
  * =====================================开启新tab===========================================
  */
const OPEN_NEW_TAB_EVENT = 'open_new_tab_event';

export const publishNewTabOpen = (data) => {
    publish(OPEN_NEW_TAB_EVENT, data)
}

 export const subscribeNewTabOpen = (handle) => {
     subscribe(OPEN_NEW_TAB_EVENT, handle);
 }

 /**
  * =====================================导入collection弹框提醒===========================================
  */
const SHOW_IMPORT_COLLECTION_MODAL_EVENT = 'show_collection_import_event';

export const publishImportCollectionModalShow = (data) => {
    publish(SHOW_IMPORT_COLLECTION_MODAL_EVENT, data)
}
 
export const subscribeImportCollectionModalShow = (handle) => {
    subscribe(SHOW_IMPORT_COLLECTION_MODAL_EVENT, handle);
}

const {ipcRenderer} = window.require('electron')
const LOCAL_SHORTCUT_EVENT = window.require('@electron/remote').getGlobal('LOCAL_SHORTCUT_EVENT');
export const listenShortcut = (key, handle) => {
    ipcRenderer.on(LOCAL_SHORTCUT_EVENT, (event, msg) => {
        let enableShortcut = getStoreValue('shortcutSwitch')
        if (enableShortcut && msg.key === key) {
            handle()
        }
    })
}



 /**
  * =====================================导入collection弹框提醒===========================================
  */
  const CHANGE_THEME_EVENT = 'change_theme_event';

  export const publishThemeChange = (data) => {
      publish(CHANGE_THEME_EVENT, data)
  }
   
  export const subscribeThemeChange = (handle) => {
      subscribe(CHANGE_THEME_EVENT, handle);
  }