import Pubsub from 'pubsub-js';

const COLLECTION_MODAL_OPEN_EVENT = 'collection_modal_open_event';

export const publish = (key, data) => {
    Pubsub.publish(key)
}

export const subscribe = (key, handle) => {
    Pubsub.subscribe(key, handle)
}

export const publishCollectionModalOpen = (data) => {
    publish(COLLECTION_MODAL_OPEN_EVENT, data)
}

export const subscribeCollectionModalOpen = (handle) => {
    subscribe(COLLECTION_MODAL_OPEN_EVENT, handle);
}