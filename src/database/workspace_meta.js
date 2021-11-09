
import {query, update, insert, findOne, remove, sort} from '@/database/database'

const WORKSPACE_META = 'workspaceMeta';

export const queryWorkspaceMetaById = async (id) => {
    return await findOne(WORKSPACE_META, {id: id});
}

export const insertWorkspaceMeta = async (doc) => {
    return await insert(WORKSPACE_META, doc)
}

export const updateWorkspaceMeta = (id, doc) => {
    return update(WORKSPACE_META, {id: id}, doc)
}

export const multiUpdateWorkspaceMeta = async (param, doc) => {
    return await update(WORKSPACE_META, param, doc, {multi: true})
}

export const queryWorkspaceMeta = (param = {}) => {
    return query(WORKSPACE_META, param);
}

export const removeWorkspaceMetaById = (id) => {
    return remove(WORKSPACE_META, {id: id});
}

export const multiRemove = (query) => {
    return remove(WORKSPACE_META, query, true)
}
