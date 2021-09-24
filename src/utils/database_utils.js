
import {insertCollection, updateCollection, queryCollectionById} from '@/database/collection'
import {insertCollectionMeta, updateCollectionMeta, queryCollectionMetaById} from '@/database/collection_meta'
import {insertRequestMeta, updateRequestMeta, queryRequestMetaById} from '@/database/request_meta'

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

export const newCollection = async (doc, parentId) => {

    if (parentId) {
        doc.parentId = parentId;
        await insertCollectionMeta(doc);
    
        let parentIdArr = await getParentIdArr(parentId);
        let collectionInfo = await queryCollectionById(parentIdArr[0]);
        let target = getTargetItem(collectionInfo, parentIdArr)
        if (!target.items) {
            target.items = [];
        } 
        target.items = [...target.items, {id: doc.id, name: doc.name, items: []}]
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

export const renameCollection = async (id, name) => {
    let collectionMetaInfo = await queryCollectionMetaById(id);
    if (!collectionMetaInfo) {
        return;
    }
    await updateCollectionMeta(id, { $set: { name: name } });
    
    let parentId = collectionMetaInfo.parentId;
    if (parentId) {
        let parentIdArr = await getParentIdArr(parentId);
        let collectionInfo = await queryCollectionById(parentIdArr[0]);
        let target = getTargetItem(collectionInfo, [...parentIdArr, id]);
        target.name = name;
        return await updateCollection(collectionInfo.id, {$set: { items: collectionInfo.items } })
    } else {
        return await updateCollection(id, { $set: { name: name } })
    }
}

export const deleteCollection = async (id) => {
    let collectionMetaInfo = await queryCollectionMetaById(id);
    if (!collectionMetaInfo) {
        return;
    }
    await updateCollectionMeta(id, { $set: { deleted: true } });
    
    let setObj = { deleted: true };
    let parentId = collectionMetaInfo.parentId;
    if (parentId) {
        let parentIdArr = await getParentIdArr(parentId);
        let collectionInfo = await queryCollectionById(parentIdArr[0]);
        let target = getTargetItem(collectionInfo, parentIdArr);
        target.items = target.items.filter(item => item.id !== id);
        setObj = { items: collectionInfo.items }; 
    } 
    return await updateCollection(id, { $set: setObj })

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