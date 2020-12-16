const util = require("util");
const fs = require("fs");
const exec = util.promisify(require("child_process").exec);
const inquirer = require("inquirer");
const {
  initQuestions,
  androidSdkPathQuestion,
  androidReleaseQuestions,
} = require("./questions");

class Buildonic {
  constructor() {
    console.info(`********** initialized buildonic **********`);
  }

  run() {
    inquirer
      .prompt(initQuestions)
      .then(({ mode, platform }) => this.build(mode, platform))
      .catch((err) => console.error(err));
  }

  build(mode, platform) {
    console.info(`starting ${mode} process targeting ${platform}`);
    switch (platform) {
      case "android":
        this.buildForAndroid(mode);
        break;
      case "ios":
        this.buildForIOS(mode);
        break;
    }
  }

  buildAPK(DEBUG=true) {

      inquirer.prompt(androidSdkPathQuestion).then(async ({ sdkPath }) => {
        try {
          await this.execute("ionic capacitor add android");
          await this.execute("ionic capacitor copy android");
          const localPropsPath = `${process.cwd()}/android`;
          const pathProvider = { cwd: localPropsPath };
          await this.execute("touch local.properties", pathProvider);
          fs.writeFile(
            `${localPropsPath}/local.properties`,
            `sdk.dir = ${sdkPath}`,
            async () => {
              console.log("sdk path added successfully");
              await this.execute(
                DEBUG ? "./gradlew assembleDebug": "./gradlew assembleRelease",
                pathProvider
              );
              console.info(
                `Build successfully! You can find your .apk file in android/app/build/outputs/apk/${DEBUG ? "debug": "release"}/`
              );
            }
          );
        } catch (err) {
          console.error(err);
        }
      });
  }
  _debugAndroid() {
    this.buildAPK(true);
  }

  _releaseAndroid() {
    this.buildAPK(false);

    // continue to sign the app
    inquirer.prompt(androidReleaseQuestions).then((answers) => {
      if (answers.sign === 'no') process.exit(1);
      const androidDirPath = `${process.cwd()}/android`
      const apkReleasePath = `${androidDirPath}/app/build/outputs/apk/release/`
      const keystorePath = answers.keystorePath
      const keystorePassword = answers.keystorePassword
      const keystoreAlias = answers.keystoreAlias
      console.log(`please wait.. buildonic will sign the app for you. Make sure you have jarsigner installed`)

    const jarsignerCMD = `jarsigner -keystore ${keystorePath} -storepass ${keystorePassword} app-release-unsigned.apk ${keystoreAlias} `;
    this.execute(jarsignerCMD, {cwd: apkReleasePath})

    console.log(`please wait.. buildonic will optimize the app for you. 
    Make sure you have zipalign installed`)
      
    const zipalignCMD = "zipalign 4 app-release-unsigned.apk app-release.apk";
    this.execute(zipalignCMD, {cwd: apkReleasePath})

    });
    


  }

  buildForAndroid(mode) {
    if (mode === "debug") {
      this._debugAndroid();
    } else if (mode === "release") {
      this._releaseAndroid();
    }
  }

  _debugIOS() {
    // TODO: implement debug commands for ios
    console.log(`building debug version for ios`);
  }


  _releaseIOS() {
    // TODO: implement release commands for ios
    console.log(`building release version for ios`);
  }


  buildForIOS(mode) {
    // TODO: implement debug and release for ios
    if (mode === "debug") {
      this._debugIOS();
    } else if (mode === "release") {
      this._releaseIOS();
    }
  }

  async execute(cmd, option) {
    try {
      console.debug(`********** executing ${cmd} **********`);
      const { stdout, stderr } = await exec(cmd, option);
      console.log(stdout);
      console.log(stderr);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }
}

module.exports = { Buildonic };
