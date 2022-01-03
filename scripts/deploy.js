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
fs.copyFileSync(sourceDir + '/dist/latest.yml', deployDir + "latest.yml", (err) => {
	if (err) console.log('something wrong was happened')
	else console.log('copy file succeed');
})

// 复制exe
let exeName = pjson.build.productName + " Setup " + pjson.version + ".exe";
fs.copyFileSync(sourceDir + '/dist/' + exeName, deployDir + exeName, (err) => {
	if (err) console.log('something wrong was happened')
	else console.log('copy file succeed');
});
fs.copyFileSync(sourceDir + '/dist/' + exeName, deployDir + pjson.build.productName + " Setup " + ".exe", (err) => {
	if (err) console.log('something wrong was happened')
	else console.log('copy file succeed');
})

// 复制zip
let zipName = pjson.build.productName + "-" + pjson.version + "-win.zip";
fs.copyFileSync(sourceDir + '/dist/' + zipName, deployDir + zipName, (err) => {
	if (err) console.log('something wrong was happened')
	else console.log('copy file succeed');
});
fs.copyFileSync(sourceDir + '/dist/' + zipName, deployDir + pjson.build.productName + "-win.zip", (err) => {
	if (err) console.log('something wrong was happened')
	else console.log('copy file succeed');
})

// copyDir("./dist", "D:\\node_project\\file-server\\packages\\download");

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


