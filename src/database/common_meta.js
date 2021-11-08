
import {query, update, insert, findOne, remove, sort} from '@/database/database'

const COMMON_META = 'commonMeta';

export const queryCommonMetaById = async (id) => {
    return await findOne(COMMON_META, {id: id});
}

export const insertCommonMeta = async (doc) => {
    return await insert(COMMON_META, doc)
}

export const updateCommonMeta = (id, doc, options) => {
    return update(COMMON_META, {id: id}, doc, options)
}

export const multiUpdateCommonMeta = async (param, doc) => {
    return await update(COMMON_META, param, doc, {multi: true})
}

export const queryCommonMeta = (param = {}) => {
    return query(COMMON_META, param);
}

export const queryCommonMetaByType = async (type) => {
    let result = await query(COMMON_META, {type: type});
    return result ? result[0] : undefined;
}

export const removeCommonMetaById = (id) => {
    return remove(COMMON_META, {id: id});
}

export const multiRemove = (query) => {
    return remove(COMMON_META, query, true)
}
