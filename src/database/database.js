const path = window.require('path');
const db = {};
const { app, ipcMain, session } = window.require('@electron/remote');

const userDataPath = app.getPath('userData')
const NeDB = window.require('@electron/remote').getGlobal('nedb');
const initDatabase = (dbName) => {
    if (!db[dbName]) {
        db[dbName] = new NeDB({
            filename: path.join(window.__dirname, `databases/${dbName}.db`), 
            autoload: true,
            timestampData: true,
        });
    }
    return db[dbName]
}

export const query = (dbName, query) => {
    const collectionDB = initDatabase(dbName);

    return new Promise((resolve, reject) => {
        collectionDB.find({...query, $not: { deleted: true }}, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(doc)
            }
        });
      
    }) 
}

export const findOne = (dbName, query) => {
    const collectionDB = initDatabase(dbName);

    return new Promise((resolve, reject) => {
        collectionDB.findOne(query, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(doc)
            }
        });
      
    }) 
}

export const insert = (dbName, doc) => {
    const collectionDB = initDatabase(dbName);
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

export const update = (dbName, query, doc, options = {}) => {
    console.log('=======udpate======');
    console.log('dbname: %s, ', dbName);
    console.log(query)
    console.log(doc)
    const collectionDB = initDatabase(dbName);

    return new Promise((resolve, reject) => {
        collectionDB.update(query, doc, options, (err, numAffected, affectedDocuments, upsert) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(affectedDocuments)
            }
        });
      
    }) 
}

export const count = (dbName, query) => {
    const collectionDB = initDatabase(dbName);

    return new Promise((resolve, reject) => {
        collectionDB.count({...query, $not: { deleted: true }}, (err, count) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(count)
            }
        });
      
    }) 
}