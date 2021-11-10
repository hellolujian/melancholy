
import {query, update, insert, findOne, remove, sort} from '@/database/database'
import {currentWorkspaceIdQuery} from '@/utils/store_utils'

const ENVIRONMENT_META = 'environmentMeta';

export const queryEnvironmentMetaById = async (id) => {
    return await findOne(ENVIRONMENT_META, {id: id});
}

export const insertEnvironmentMeta = async (doc) => {
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    return await insert(ENVIRONMENT_META, {...workspaceIdQuery, ...doc})
}

export const updateEnvironmentMeta = (id, doc) => {
    return update(ENVIRONMENT_META, {id: id}, doc)
}

export const multiUpdateEnvironmentMeta = async (param, doc) => {
    return await update(ENVIRONMENT_META, param, doc, {multi: true})
}

export const queryEnvironmentMeta = async (param = {}) => {
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    return query(ENVIRONMENT_META, {...workspaceIdQuery, ...param});
}

export const removeEnvironmentMetaById = (id) => {
    return remove(ENVIRONMENT_META, {id: id});
}
