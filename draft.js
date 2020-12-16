const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);

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

  const localPropsPath = `${process.cwd()}/android`;
   const pathProvider = { cwd: localPropsPath };
execute("touch local.properties", pathProvider);
fs.writeFile(`${process.cwd()}/tests/local.properties`, "fuck this", () => console.log("written"));