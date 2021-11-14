
import {query, update, insert, findOne, remove, sort} from '@/database/database'

const DOMAIN_META = 'domainMeta';

export const queryDomainMetaById = async (id) => {
    return await findOne(DOMAIN_META, {id: id});
}

export const insertDomainMeta = async (doc) => {
    return await insert(DOMAIN_META, doc)
}

export const updateDomainMeta = (id, doc) => {
    return update(DOMAIN_META, {id: id}, doc)
}

export const multiUpdateDomainMeta = async (param, doc) => {
    return await update(DOMAIN_META, param, doc, {multi: true})
}

export const queryDomainMeta = (param = {}) => {
    return query(DOMAIN_META, param);
}

export const removeDomainMetaById = (id) => {
    return remove(DOMAIN_META, {id: id});
}

export const multiRemove = (query) => {
    return remove(DOMAIN_META, query, true)
}
