
import {query, update, insert, findOne, remove, sort} from '@/database/database'

const ENVIRONMENT_META = 'environmentMeta';

export const queryEnvironmentMetaById = async (id) => {
    return await findOne(ENVIRONMENT_META, {id: id});
}

export const insertEnvironmentMeta = async (doc) => {
    return await insert(ENVIRONMENT_META, doc)
}

export const updateEnvironmentMeta = (id, doc) => {
    return update(ENVIRONMENT_META, {id: id}, doc)
}

export const multiUpdateEnvironmentMeta = async (param, doc) => {
    return await update(ENVIRONMENT_META, param, doc, {multi: true})
}

export const queryEnvironmentMeta = (param = {}) => {
    return query(ENVIRONMENT_META, param);
}

export const removeEnvironmentMetaById = (id) => {
    return remove(ENVIRONMENT_META, {id: id});
}

export const multiRemove = (query) => {
    return remove(ENVIRONMENT_META, query, true)
}
