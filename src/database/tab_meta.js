
import {query, update, insert, findOne, remove, sort} from '@/database/database'
import {currentWorkspaceIdQuery} from '@/utils/store_utils'

const TAB_META = 'tabMeta';

export const queryTabMetaById = async (id) => {
    return await findOne(TAB_META, {id: id});
}

export const insertTabMeta = async (doc) => {
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    return await insert(TAB_META, {...workspaceIdQuery, ...doc})
}

export const updateTabMeta = (id, doc) => {
    return update(TAB_META, {id: id}, doc)
}

export const multiUpdateTabMeta = async (param, doc) => {
    return await update(TAB_META, param, doc, {multi: true})
}

export const queryTabMeta = async (param = {}) => {
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    return query(TAB_META, {...workspaceIdQuery, ...param});
}

export const removeTabMetaById = (id) => {
    return remove(TAB_META, {id: id});
}

export const multiRemove = (query) => {
    return remove(TAB_META, query, true)
}

export const querySortedTab = async (param, order) => {
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    return sort(TAB_META, {...workspaceIdQuery, ...param}, order)
}