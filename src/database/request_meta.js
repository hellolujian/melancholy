
import {update, insert, findOne} from '@/database/database'

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