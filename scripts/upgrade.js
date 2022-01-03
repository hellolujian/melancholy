const fs = require('fs');
const path = require('path');
function copyDir(src, dist) {
    var b = fs.existsSync(dist)
    console.log("dist = " + dist)
    if(!b) {
      console.log("mk dist = ", dist)
      fs.mkdirSync(dist);
    }
    console.log("_copy start")
    _copy(src, dist);
}
function _copy(src, dist) {
    var paths = fs.readdirSync(src)
    paths.forEach((p) => {
        var _src = src + '/' +p;
        var _dist = dist + '/' +p;
        var stat = fs.statSync(_src)
        if(stat.isFile()) {// 判断是文件还是目录
            fs.writeFileSync(_dist, fs.readFileSync(_src));
        } else if(stat.isDirectory()) {
            copyDir(_src, _dist)// 当是目录是，递归复制
        }
    })
}

// fs.copyFileSync('./electron.js', './build/electron.js', (err) => {
// 	if (err) console.log('something wrong was happened')
// 	else console.log('copy file succeed');
// })
// fs.copyFileSync('./preload.js', './build/preload.js', (err) => {
// 	if (err) console.log('something wrong was happened')
// 	else console.log('copy file succeed');
// })

// // 老的打包方法
// copyDir("./templates", "./build/templates");

// 新的打包方法，优化包的大小
// copyDir("./build", "./electron/build");

// console.log("复制结束")

var pjson = require('../electron/package.json');
let oldVersionArr = pjson.version.split('.').map(item => parseInt(item)).reverse();

let addVersion = 1;
let i = 0;
for (i = 0; i < oldVersionArr.length; i++) {
    let item = oldVersionArr[i];
    if (item < 99) {
        oldVersionArr[i] += addVersion;
        addVersion = 0;
        break;
    }
    oldVersionArr[i] = 0;
}
if (i === oldVersionArr.length && addVersion) {
    oldVersionArr.push(addVersion);
}
let newVersion = oldVersionArr.reverse().join('.');
pjson.version = newVersion;
console.log("-------------------新版本号：%s=======================", newVersion)
fs.writeFileSync("./electron/package.json", JSON.stringify(pjson, "", "\t"));

let releaseJson = require('./release.json');
releaseJson.version = newVersion;
fs.writeFileSync("./scripts/release.json", JSON.stringify(releaseJson, "", "\t"));
var process = require('child_process');

// process.exec('cd ./electron && npm run dist', function (error, stdout, stderr) {

    
//     console.log("进入electron文件夹")
//     console.log("当前文件夹：" + process.cwd())
//     // process.exec('', function(error, stdout, stderr) {
//     //     console.log("开始打包")
//     //     console.log(stdout)
//     //     console.log(stderr)
//     //     console.log(error)

//     // });

// })

// "prebuild": "node ./scripts/prebuild.js",



