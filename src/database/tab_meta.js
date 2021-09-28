
import {query, update, insert, findOne, remove} from '@/database/database'

const TAB_META = 'tabMeta';

export const queryTabMetaById = async (id) => {
    return await findOne(TAB_META, {id: id});
}

export const insertTabMeta = async (doc) => {
    return await insert(TAB_META, doc)
}

export const updateTabMeta = (id, doc) => {
    return update(TAB_META, {id: id}, doc)
}

export const queryTabMeta = (param = {}) => {
    return query(TAB_META, param);
}

export const removeTabMetaById = (id) => {
    return remove(TAB_META, {id: id});
}

export const multiRemove = (query) => {
    return remove(TAB_META, query, true)
}