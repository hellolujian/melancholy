
import {update, insert, findOne, query} from '@/database/database'

const HEADER_PRESET = 'headerPreset';

export const queryHeaderPresetById = async (id) => {
    return await findOne(HEADER_PRESET, {id: id});
}

export const insertHeaderPreset = async (doc) => {
    return await insert(HEADER_PRESET, doc)
}

export const updateHeaderPreset = (id, doc) => {
    return update(HEADER_PRESET, {id: id}, doc)
}

export const multiUpdateHeaderPreset = async (param, doc) => {
    return await update(HEADER_PRESET, param, doc, {multi: true})
}

export const queryHeaderPreset = async (param = {}) => {
    return await query(HEADER_PRESET, param);
}
