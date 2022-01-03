var lifecycleScript = process.env.npm_lifecycle_script;
var scriptIndex = lifecycleScript.indexOf('customizescript');
if (scriptIndex !== -1) {
    lifecycleScript = lifecycleScript.substring(scriptIndex, lifecycleScript.length);
    var realScript = lifecycleScript.indexOf('=') !== -1 ? lifecycleScript.substring(lifecycleScript.indexOf('=') + 1, lifecycleScript.length) : '';
    if (realScript) {
        console.log("执行自定义脚本：" + realScript)
        // const exec = require('child_process').exec;
        // exec(realScript, { cwd: './electron' }, (error, stdout, stderr) => {
        //     console.log('hahahhahaha')
        //     console.log(stdout)
        // });

        const spawn = require('child_process').spawn;
        spawn(realScript, { 
            cwd: './electron',
            stdio: 'inherit',
            shell: true
        }, (error, stdout, stderr) => {
            console.log('启动成功')
        })
    }
}
