const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
var spawn = require('child_process').spawn;


const localPropsPath = `${process.cwd()}/android`;
const pathProvider = { cwd: localPropsPath };
const genKeyCMD = `keytool -genkey -v -keystore safaf.keystore -alias aaa -storepass fuckthisshit -keyalg RSA -keysize 2048 -validity 10000`


var child = spawn(genKeyCMD, {
    cwd: localPropsPath,
  shell: true
});
child.stderr.on('data', function (data) {
  console.error("STDERR:", data.toString());
});
child.stdout.on('data', function (data) {
  console.log("STDOUT:", data.toString());
});
child.on('exit', function (exitCode) {
  console.log("Child exited with code: " + exitCode);
});
async function execute(cmd, option) {
    try {
          console.info(`********** executing ${cmd} **********`)
    const { stdout, stderr } = await exec(cmd, option);
    console.log(stdout);
    console.log(stderr);
    } catch(err) {
        console.error (err);
    }
  
  }


// execute("touch local.properties", pathProvider);
// fs.writeFile(`${process.cwd()}/tests/local.properties`, "fuck this", () => console.log("written"));