const path = window.require('path');
const db = {};
const { app, ipcMain, session } = window.require('@electron/remote');

const userDataPath = app.getPath('userData')
const NeDB = window.require('@electron/remote').getGlobal('nedb');
const initDatabase = (dbName) => {
    if (!db[dbName]) {
        db[dbName] = new NeDB({
            filename: path.join(window.__dirname, `databases/collection.db`), 
            autoload: true,
            timestampData: true,
        });
    }
    return db[dbName]
}

export const addCollection = (doc) => {
    const collectionDB = initDatabase('collection');
    return new Promise((resolve, reject) => {
        collectionDB.insert(doc, function (err, newDoc) {   // Callback is optional
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(newDoc)
            }
        });
    }) 
    
}

export const queryCollection = (id) => {
    const collectionDB = initDatabase('collection');

    return new Promise((resolve, reject) => {
        collectionDB.findOne({ id: id }, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(doc)
            }
        });
      
    }) 
}

export const loadCollection = () => {
    const collectionDB = initDatabase('collection');

    return new Promise((resolve, reject) => {
        collectionDB.find({ $not: { deleted: true } }, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(doc)
            }
        });
      
    }) 
}

export const updateCollection = (id, data) => {
    const collectionDB = initDatabase('collection');

    return new Promise((resolve, reject) => {
        collectionDB.update({ id: id }, data, {}, (err, numAffected, affectedDocuments, upsert) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(affectedDocuments)
            }
        });
      
    }) 
}

export const deleteCollection = (id) => {
    const collectionDB = initDatabase('collection');

    return new Promise((resolve, reject) => {
        // 设定一个已存字段的值
        collectionDB.update({ id: id }, { $set: { deleted: true } }, {}, (err, numAffected, affectedDocuments, upsert) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(affectedDocuments)
            }
        });
      
    }) 
}

export const starCollection = (id, starred) => {
    console.log('id: %s, starred: %s', id, starred);
    const collectionDB = initDatabase('collection');

    return new Promise((resolve, reject) => {
        // 设定一个已存字段的值
        collectionDB.update({ id: id }, { $set: { starred: starred } }, {}, (err, numAffected, affectedDocuments, upsert) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(affectedDocuments)
            }
        });
      
    }) 
}

export const renameCollection = (id, name) => {
    const collectionDB = initDatabase('collection');

    return new Promise((resolve, reject) => {
        // 设定一个已存字段的值
        collectionDB.update({ id: id }, { $set: { name: name } }, {}, (err, numAffected, affectedDocuments, upsert) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(affectedDocuments)
            }
        });
      
    }) 
}
