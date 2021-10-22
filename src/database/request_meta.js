
import {update, insert, findOne, query, count} from '@/database/database'

const REQUEST_META = 'requestMeta';

export const queryRequestMetaById = async (id) => {
    return await findOne(REQUEST_META, {id: id});
}

export const insertRequestMeta = async (doc) => {
    return await insert(REQUEST_META, doc)
}

export const updateRequestMeta = (id, doc) => {
    return update(REQUEST_META, {id: id}, doc)
}

export const multiUpdateRequestMeta = async (param, doc) => {
    return await update(REQUEST_META, param, doc, {multi: true})
}

export const queryRequestMetaByParentId = (parentId) => {
    return query(REQUEST_META, {parentId: parentId})
}

export const queryRequestCount = (parentId) => {
    return count(REQUEST_META, {parentId: parentId});
}