const path = window.require('path');
const db = {};
const { app, ipcMain, session } = window.require('@electron/remote');

const userDataPath = app.getPath('userData')
const databaseUtil = window.require('@electron/remote').getGlobal('DATABASE_UTIL');
const {query, findOne, insert, remove, update, count, sort, } = databaseUtil;

export {query, findOne, insert, remove, update, count, sort}