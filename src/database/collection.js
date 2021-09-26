
import {query, findOne, update, insert} from '@/database/database'

const COLLECTION = 'collection';

export const queryCollectionById = async (id) => {
    return await findOne(COLLECTION, {id: id});
}

export const queryCollection = async (param = {}) => {
    let result = await query(COLLECTION, param);
    return result;
}

export const insertCollection = (doc) => {
    return insert(COLLECTION, doc)
}

export const updateCollection = (id, doc) => {
    return update(COLLECTION, {id: id}, doc);
}

