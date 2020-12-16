const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);

async function execute(cmd) {
    console.info(`********** executing ${cmd} **********`)
    const { stdout, stderr } = await exec(cmd);
    console.log(stdout);
    console.log(stderr);
  }

execute("touch local.properties");
fs.writeFile('local.properties', "fuck this", () => console.log("written"));