import Pubsub from 'pubsub-js';

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

/**
 * ======================================保存请求==========================================
 */
const REQUEST_MODAL_EVENT = 'request_modal_event';
const REQUEST_MODAL_EVENT_OPEN = `${REQUEST_MODAL_EVENT}.open`
const REQUEST_MODAL_EVENT_SAVE = `${REQUEST_MODAL_EVENT}.save`

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

const {ipcRenderer} = window.require('electron')
const LOCAL_SHORTCUT_EVENT = window.require('@electron/remote').getGlobal('LOCAL_SHORTCUT_EVENT');
export const listenShortcut = (key, handle) => {
    ipcRenderer.on(LOCAL_SHORTCUT_EVENT, (event, msg) => {
        if (msg.key === key) {
            handle()
        }
    })
}