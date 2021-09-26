
import {query, update, insert, findOne} from '@/database/database'

const COLLECTION_META = 'collectionMeta';

export const queryCollectionMetaById = async (id) => {
    return await findOne(COLLECTION_META, {id: id});
}

export const insertCollectionMeta = async (doc) => {
    return await insert(COLLECTION_META, doc)
}

export const updateCollectionMeta = (id, doc) => {
    return update(COLLECTION_META, {id: id}, doc)
}

export const queryCollectionMetaByParentId = (parentId) => {
    return query(COLLECTION_META, {parentId: parentId});
}