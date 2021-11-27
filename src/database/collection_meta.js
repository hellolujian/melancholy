
import {query, update, insert, findOne} from '@/database/database'

import {currentWorkspaceIdQuery} from '@/utils/store_utils'

const COLLECTION_META = 'collectionMeta';

export const queryCollectionMetaById = async (id) => {
    return await findOne(COLLECTION_META, {id: id});
}

export const insertCollectionMeta = async (doc) => {
    
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    return await insert(COLLECTION_META, Array.isArray(doc) ? doc.map(item => {
        return {...workspaceIdQuery, ...item}
    }) : {...workspaceIdQuery, ...doc})
}

export const updateCollectionMeta = (id, doc) => {
    return update(COLLECTION_META, {id: id}, doc)
}

export const queryCollectionMetaByParentId = (parentId) => {
    return query(COLLECTION_META, {parentId: parentId});
}

export const queryCollectionMetaByName = async (name) => {
    
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    return query(COLLECTION_META, {name: name, ...workspaceIdQuery});
}