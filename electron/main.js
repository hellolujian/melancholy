const { 
    app, 
    Menu, 
    shell,
    dialog, 
    ipcMain, 
    BrowserWindow,  
} = require('electron');
const log = require('electron-log');
// const contextMenu = require('electron-context-menu');
const path = require('path');

const Store = require('electron-store');
// const store = new Store({cwd: 'config', name: 'settings'});
let checkUpdateFromMenu;
let webContents;
let win;
const viewMenu = {
    label: `View`,
    submenu: [
        {
          label: `Toggle Full Screen`,
          role: 'togglefullscreen'
        },
        {
            type: 'separator'
        },
        {
          label: `Toggle DevTools`,
          role: 'toggleDevTools'
        },
    ],
  };

const helpMenu = {
    label: "Help",
    submenu: [
        
        {
          label: `Show App Logs Folder`,
          click: (menuItem, w, e) => {
            const logPath = log.transports.file.getFile().path;
            const {dirname} = path;
            const directory = dirname(logPath);
            shell.showItemInFolder(directory);
          },
        },
        {
          label: `Show App Data Folder`,
          click: (menuItem, w, e) => {
            const directory = app.getPath('userData');
            shell.showItemInFolder(directory);
          },
        },
    ]
}

const template = [
    // {
    //     label: '首页'
    // },
    // {
    //     label: '新闻资讯',
    //     submenu: [{
    //         label: '国内新闻',
    //         submenu: [{
    //             label: '北京新闻'
    //         }, {
    //             label: '河南新闻'
    //         }]
    //     }, {
    //         label: '国际新闻'
    //     }]
    // },
]

template.push(viewMenu);
template.push(helpMenu)
var list = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(list)

const isDev = require('electron-is-dev')
// 全局变量
// global.__dirname = __dirname
// global.fs = require('fs');
// global.store = store;
isDev && require('electron-debug')({ enabled: true, showDevTools: false });

function createDevTools() {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
  } = require('electron-devtools-installer');
  // 安装devtron
  // const devtronExtension = require('devtron');
  // devtronExtension.install();
  // 安装React开发者工具
  installExtension(REACT_DEVELOPER_TOOLS);
  installExtension(REDUX_DEVTOOLS);
}

function createWindow() {
    console.log(__dirname );
    // const log = require('electron-log');
    // log.debug(app.getPath('userData'));


    

    // const store = new Store({cwd: 'Config', name: 'second'});
    
    // store.set('unicorn', '🦄');
    // console.log(store.get('unicorn'));
    // 编辑器打开
    // store.openInEditor()

    // 创建浏览器窗口。
    win = new BrowserWindow({ 
        width: isDev ? 1500 : 850, 
        height: 680 ,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            // preload: __dirname + '/preload.js',
            enableRemoteModule: true,
            title: "Code Generator"
          }
    })
    webContents = win.webContents;

    // 然后加载应用的 index.html。  url 及本地文件形式
    const localFile = `file://${path.join(__dirname, './build/index.html')}`
    win.loadURL(isDev ? 'http://localhost:8000' : localFile)
    
    // // 打开开发者工具
    // if (isDev) {
    //     webContents.openDevTools()
    // }

    isDev && createDevTools();
  
    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })

    
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  createWindow();
  isDev && createDevTools();
})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow()
        
    }
})
