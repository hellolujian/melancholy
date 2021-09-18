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