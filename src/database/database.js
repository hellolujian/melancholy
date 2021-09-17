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
    collectionDB.insert(doc, function (err, newDoc) {   // Callback is optional
        console.log(err)
    });
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