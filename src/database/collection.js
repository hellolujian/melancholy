
import {query, findOne, update, insert} from '@/database/database'
import {currentWorkspaceIdQuery} from '@/utils/store_utils'

const COLLECTION = 'collection';

export const queryCollectionById = async (id) => {
    return await findOne(COLLECTION, {id: id});
}

export const queryCollection = async (param = {}) => {
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    let result = await query(COLLECTION, {...workspaceIdQuery, ...param});
    return result;
}

export const insertCollection = async (doc) => {
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    return insert(COLLECTION, {...workspaceIdQuery, ...doc, })
}

export const updateCollection = (id, doc) => {
    return update(COLLECTION, {id: id}, doc);
}

