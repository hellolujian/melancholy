
import {insertCollection, updateCollection, queryCollectionById, queryCollection} from '@/database/collection'
import {insertCollectionMeta, updateCollectionMeta, queryCollectionMetaById, queryCollectionMetaByParentId} from '@/database/collection_meta'
import {insertRequestMeta, updateRequestMeta, queryRequestMetaById, queryRequestMetaByParentId, queryRequestCount} from '@/database/request_meta'

import {UUID} from '@/utils/global_utils'

/**
 * 根据id数组定位到collection所在位置
 * @param {*} collectionInfo 
 * @param {*} idArr 
 * @returns 
 */
export const getTargetItem = (collectionInfo, idArr) => {
    let target = collectionInfo;
    if (!idArr) {
        return target;
    }
    for (let i = 0; i < idArr.length; i++) {
        if (i === 0) {
            target = collectionInfo;
        } else {
            let parentId = idArr[i];
            target = target.items.find(item => item.id === parentId);
        }
    }
    return target;
}

/**
 * 根据id向上遍历获取父级id数组
 * @param {*} id 
 * @param {*} excludeSelf 
 * @returns 
 */
export const getParentIdArr = async (id, excludeSelf) => {
    let idArr = [];
    for (;;) {
        if (!id) {
            break;
        }
        idArr.unshift(id);
        let collectionMetaInfo = await queryCollectionMetaById(id);
        if (!collectionMetaInfo) {
            break;
        }
        id = collectionMetaInfo.parentId;
    }
    if (excludeSelf) {
        idArr.pop()
    }            
    return idArr;
}

export const getParentArr = async (id) => {
    let arr = [];
    for (;;) {
        let collectionMetaInfo = await queryCollectionMetaById(id);
        if (!collectionMetaInfo) {
            break;
        }
        arr.unshift({id: collectionMetaInfo.id, name: collectionMetaInfo.name});
        id = collectionMetaInfo.parentId;
        if (!id) {
            break;
        }
    }           
    return arr;
}

export const sortCollectionData = (collectionData) => {
    return collectionData.sort((a, b) => {
        if (a.starred) {
            if (!b.starred) {
                return -1;
            }
        } else if(b.starred) {
            return 1;
        }
        return a.name.localeCompare(b.name);
    })
}

export const loadCollection = async () => {
    let result = await queryCollection();
    return sortCollectionData(result);
}

/**
 * 创建集合（folder）
 * @param {*} doc 
 * @param {*} parentId 
 * @returns 
 */
export const newCollection = async (doc, parentId) => {

    if (!doc.id) {
        doc.id = UUID();
    }
    // 创建folder
    if (parentId) {
        doc.parentId = parentId;
        await insertCollectionMeta(doc);
    
        let parentIdArr = await getParentIdArr(parentId);
        let collectionInfo = await queryCollectionById(parentIdArr[0]);
        let target = getTargetItem(collectionInfo, parentIdArr)
        let newItem = {id: doc.id, name: doc.name, items: []};
        if (!target.items || target.items.length === 0) {
            target.items = [newItem];
        } else {
            let splitIndex = target.items.findIndex(item => !item.items);
            if (splitIndex < 0) {
                target.items = [...target.items, newItem];
            } else {
                target.items = [...target.items.slice(0, splitIndex), newItem, ...target.items.slice(splitIndex)];
            }
        }
        return await updateCollection(collectionInfo.id, {$set: { items: collectionInfo.items } })
    } else {
        await insertCollectionMeta(doc);
        return await insertCollection({
            id: doc.id,
            name: doc.name, 
            requestCount: 0
        })
    }
}

export const saveCollection = async (id, doc) => {

    let collectionMetaInfo = await queryCollectionMetaById(id);
    if (!collectionMetaInfo) {
        return;
    }
    await updateCollectionMeta(id, {$set: doc});

    let parentId = collectionMetaInfo.parentId;
    if (parentId) {
        let parentIdArr = await getParentIdArr(parentId);
        let collectionInfo = await queryCollectionById(parentIdArr[0]);
        let target = getTargetItem(collectionInfo, [...parentIdArr, id]);
        target.name = doc.name;
        return await updateCollection(collectionInfo.id, {$set: { items: collectionInfo.items } })
    } else {
        return await updateCollection(id, { $set: { name: doc.name } })
    }
}

/**
 * 根据id获取请求数量
 * @param {*} id 
 * @returns 
 */
export const getRequestCount = async (id) => {
    let count = 0;
    let collectionMetaInfo = await queryCollectionMetaById(id);
    if (!collectionMetaInfo) { 
        return count;
    }
    // 获取自己包含的请求数
    count = await queryRequestCount(id);
    let childrenCollection = await queryCollectionMetaByParentId(id);
    // 获取每个子集合的请求数
    for (let child of childrenCollection) {
        let childRequestCount = await getRequestCount(child.id);
        count += childRequestCount;
    }
    return count;
}

/**
 * 删除集合（如删除folder需要更新所属collection的requestCount）
 * @param {*} id 
 * @returns 
 */
export const deleteCollection = async (id) => {
    let collectionMetaInfo = await queryCollectionMetaById(id);
    if (!collectionMetaInfo) {
        return;
    }
    await updateCollectionMeta(id, { $set: { deleted: true } });
    
    let parentId = collectionMetaInfo.parentId;
    if (parentId) {
        let parentIdArr = await getParentIdArr(parentId);
        let collectionInfo = await queryCollectionById(parentIdArr[0]);
        let target = getTargetItem(collectionInfo, parentIdArr);
        target.items = target.items.filter(item => item.id !== id);
        let subtractCount = await getRequestCount(id);
        return await updateCollection(collectionInfo.id, { $set: { items: collectionInfo.items, requestCount: collectionInfo.requestCount - subtractCount } })
    } else {
        return await updateCollection(id, { deleted: true })
    }

}

export const starCollection = async (id, starred) => {
    let update = { $set: { starred: starred } }
    return await updateCollection(id, update)
    // return updateCollectionMeta(id, update)
}

export const newRequest = async (doc) => {

    const {id, name, method, parentId} = doc;
    await insertRequestMeta(doc);

    let parentIdArr = await getParentIdArr(parentId);
    let collectionInfo = await queryCollectionById(parentIdArr[0]);
    let target = getTargetItem(collectionInfo, parentIdArr)
    if (!target.items) {
        target.items = [];
    } 
    target.items = [...target.items, {id: id, name: name, method: method}]
    return await updateCollection(collectionInfo.id, {$set: { items: collectionInfo.items, requestCount: collectionInfo.requestCount + 1 } })

}

export const saveRequest = async (doc) => {
    const {id, name} = doc;
    let requestMetaInfo = await queryRequestMetaById(id);
    if (!requestMetaInfo) {
        return;
    }
    await updateRequestMeta(id, {$set: doc});

    let parentIdArr = await getParentIdArr(requestMetaInfo.parentId);
    let collectionInfo = await queryCollectionById(parentIdArr[0]);
    let target = getTargetItem(collectionInfo, [...parentIdArr, id]);
    target.name = name;
    return await updateCollection(collectionInfo.id, {$set: { items: collectionInfo.items } })

}

export const duplicateRequest = async (id) => {

    let requestMetaInfo = await queryRequestMetaById(id);
    if (!requestMetaInfo) {
        return;
    }
    const {parentId, name, url, method, body, header, description, auth, prerequest, test} = requestMetaInfo;
    let duplicateRequest = {
        id: UUID(),
        parentId: parentId,
        name: name + " Copy",
        url: url,
        method: method,
        body: body,
        header: header,
        description: description,
        auth: auth,
        prerequest: prerequest,
        test: test, 
    }
    await newRequest(duplicateRequest);

}

export const deleteRequest = async (id) => {
    let requestMetaInfo = await queryRequestMetaById(id);
    if (!requestMetaInfo) {
        return;
    }
    await updateRequestMeta(id, { $set: { deleted: true } });
    
    let parentIdArr = await getParentIdArr(requestMetaInfo.parentId);
    let collectionInfo = await queryCollectionById(parentIdArr[0]);
    let target = getTargetItem(collectionInfo, parentIdArr);
    target.items = target.items.filter(item => item.id !== id);
    let requestCount = collectionInfo.requestCount > 0 ? (collectionInfo.requestCount - 1) : 0
    return await updateCollection(collectionInfo.id, {$set: { items: collectionInfo.items, requestCount: requestCount } })

}

/**
 * 
 * @param {*} id 目标集合id
 * @param {*} collectionMetaArr 待插入的collection数组
 * @param {*} requestMetaArr 待插入的request数组
 * @returns 
 */
export const getDuplicateCollectionByMeta = async (id, collectionMetaArr, requestMetaArr, newParentId) => {
    
    let newId = UUID();
    let collectionMetaInfo = await queryCollectionMetaById(id);
    const {name, parentId, description, auth, prerequest, test, variable} = collectionMetaInfo; 
    let duplicateName = collectionMetaArr.length > 0 ? name : (name + ' Copy');
    collectionMetaArr.push({
        id: newId, 
        parentId: newParentId || parentId,
        name: duplicateName, 
        description: description,
        auth: auth,
        prerequest: prerequest,
        test: test,
        variable: variable
    })
    let childrenRequest = await queryRequestMetaByParentId(id);
    let newMetaRequests = childrenRequest.map(childRequest => {
        const  {name, url, method, body, header, description, auth, prerequest, test} = childRequest
        return {
            id: UUID(),
            parentId: newId,
            name: name,
            url: url,
            method: method,
            body: body,
            header: header,
            description: description,
            auth: auth,
            prerequest: prerequest,
            test: test,
        }
    })
    requestMetaArr.push(...newMetaRequests)

    let childrenCollection = await queryCollectionMetaByParentId(id);
    let items = [];
    for (let child of childrenCollection) {
        let item = await getDuplicateCollectionByMeta(child.id, collectionMetaArr, requestMetaArr, newId);
        items.push(item)
    }
    let obj = {
        id: newId, 
        name: duplicateName,
        items: items,
    }
   
    obj.items.push(...newMetaRequests.map(item => {return {id: item.id, name: item.name}}));

    return obj;
}

/**
 * 复制集合
 * @param {*} id 
 * @returns 
 */
export const duplicateCollection = async (id) => {

    let collectionMetaArr = [], requestMetaArr = [];
    let duplicateCollection = await getDuplicateCollectionByMeta(id, collectionMetaArr, requestMetaArr);
    await insertRequestMeta(requestMetaArr);
    await insertCollectionMeta(collectionMetaArr);
    let parentIdArr = await getParentIdArr(id, true);
    if (parentIdArr.length > 0) {
        let rootCollectionInfo = await queryCollectionById(parentIdArr[0]);
        let target = getTargetItem(rootCollectionInfo, parentIdArr);
        target.items = [...target.items, duplicateCollection]
        return await updateCollection(rootCollectionInfo.id, {$set: { items: rootCollectionInfo.items, requestCount: rootCollectionInfo.requestCount + requestMetaArr.length } })
    } else {
        duplicateCollection.requestCount = requestMetaArr.length;
        return await insertCollection(duplicateCollection)
    }
}