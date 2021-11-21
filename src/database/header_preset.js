
import {update, insert, findOne, query} from '@/database/database'
import {currentWorkspaceIdQuery} from '@/utils/store_utils'

const HEADER_PRESET = 'headerPreset';

export const queryHeaderPresetById = async (id) => {
    return await findOne(HEADER_PRESET, {id: id});
}

export const insertHeaderPreset = async (doc) => {
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    return await insert(HEADER_PRESET, Array.isArray(doc) ? doc.map(item => {
        return {...workspaceIdQuery, ...item}
    }) : {...workspaceIdQuery, ...doc})
}

export const updateHeaderPreset = (id, doc) => {
    return update(HEADER_PRESET, {id: id}, doc)
}

export const multiUpdateHeaderPreset = async (param, doc) => {
    return await update(HEADER_PRESET, param, doc, {multi: true})
}

export const queryHeaderPreset = async (param = {}) => {
    let workspaceIdQuery = await currentWorkspaceIdQuery();
    return await query(HEADER_PRESET, {...workspaceIdQuery, ...param});
}
