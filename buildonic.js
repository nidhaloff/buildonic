const util = require("util");
const fs = require("fs");
const exec = util.promisify(require("child_process").exec);
const inquirer = require("inquirer");
const {
  initQuestions,
  androidDebugQuestions,
  androidReleaseQuestions,
} = require("./questions");

class Buildonic {
  constructor() {
    console.info(`********** initialized buildonic **********`);
  }

  run() {
    inquirer
      .prompt(initQuestions)
      .then(async ({ mode, platform }) => await this.build(mode, platform))
      .catch((err) => console.error(err));
  }

  async build(mode, platform) {
    console.info(`starting ${mode} process targeting ${platform}`);
    switch (platform) {
      case "android":
        await this.buildForAndroid(mode);
        break;
      case "ios":
        this.buildForIOS(mode);
        break;
    }
  }

  async _debugAndroid() {
    try {
      inquirer.prompt(androidDebugQuestions).then(async ({ sdkPath }) => {
        try {
          await this.execute("ionic capacitor add android");
          await this.execute("ionic capacitor copy android");
          const localPropsPath = `cd ${process.cwd()}/android`;
          const pathProvider = {cwd: localPropsPath};
          await this.execute("touch local.properties", pathProvider);
          fs.writeFile(`${pathProvider}/local.properties`, `sdk.dir = ${sdkPath}`, async () => {
            console.log("sdk path added successfully");
            await this.execute("./gradlew assembleDebug && cd ..", pathProvider);
            console.info(
              `Build successfully! You can find your .apk file in ${this.platform}/app/build/outputs/debug/app-${this.mode}.apk`
            );
          });
        } catch (err) {
          console.error(err);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  _debugIOS() {
    console.log(`building debug version for ios`);
  }

  _releaseAndroid() {
    console.log(`building release version for android`);
    let keystorePath, keystorePassword, keystoreAlias, sdkPath;

    inquirer.prompt(androidReleaseQuestions).then((answers) => {
      keystorePath = answers.keystorePath;
      keystorePassword = answers.keystorePassword;
      keystoreAlias = answers.keystoreAlias;
      sdkPath = answers.sdkPath;
    });
    const path = "app/build/outputs/apk/release";
    this.execute("touch local.properties");
    fs.writeFileSync("local.properties", sdkPath);

    this.execute("cd android && ./gradlew assembleRelease").then(() =>
      console.log(`your release is now in ${path}`)
    );
    this.execute("cd app/build/outputs/apk/release").then(() =>
      console.log(`!!!!!make sure you have jarsigner installed!!!!!`)
    );

    const jarsignerCMD = `jarsigner -keystore ${keystorePath} -storepass ${keystorePassword} app-release-unsigned.apk ${keystoreAlias} `;
    this.execute(jarsignerCMD).then(() =>
      console.log(
        "App signed successfully! Now make sure zipalign is installed for optimization purposes!"
      )
    );

    const zipalignCMD = "zipalign 4 app-release-unsigned.apk app-release.apk";
    this.execute(zipalignCMD).then(() =>
      console.log(`App optimized successfully!`)
    );
  }

  _releaseIOS() {
    console.log(`building release version for ios`);
  }

  async buildForAndroid(mode) {
    if (mode === "debug") {
      await this._debugAndroid();
    } else if (mode === "release") {
      this._releaseAndroid();
    }
  }

  buildForIOS(mode) {
    if (mode === "debug") {
      this._debugIOS();
    } else if (mode === "release") {
      this._releaseIOS();
    }
  }

  async execute(cmd, option) {
    console.info(`********** executing ${cmd} **********`);
    const { stdout, stderr } = await exec(cmd, option);
    console.log(stdout);
    console.log(stderr);
  }
}

module.exports = { Buildonic };
