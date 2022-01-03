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

var pjson = require('../electron/package.json');
console.log(pjson.version);
console.log(pjson.build.productName);
let deployBaseDir = "D:\\node_project\\file-server\\packages\\";
let deployDir = deployBaseDir + "download\\";
let sourceDir = "./electron";


// 更新version.json文件
console.log('============更新版本releaseNotes===================')
let versionDir = path.join(deployBaseDir, 'update/version.json');    
if (fs.existsSync(versionDir)) {
    let versionTxt = fs.readFileSync(versionDir)
    let versionJson = JSON.parse(versionTxt)
    let latestVersion = require('./release.json');
    versionJson.history = [versionJson.current, ...versionJson.history];
    versionJson.current = latestVersion;
    fs.writeFileSync(versionDir, JSON.stringify(versionJson, "", "\t"));
} 



