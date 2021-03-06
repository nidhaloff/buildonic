const util = require("util");
const fs = require("fs");
const figlet = require("./figlet");
const { timer } = require('./helpers')
const exec = util.promisify(require("child_process").exec);
const inquirer = require("inquirer");
const {
  initQuestions,
  androidSdkPathQuestion,
  androidReleaseQuestions,
  signAppQuestion
} = require("./questions");


class Buildonic {
  constructor() {
    figlet("Buildonic",["-c"], function (fig){
      console.log(fig.toString());    
  });
  }

  run() {
    timer(500)
    .then(_ => {
       inquirer
      .prompt(initQuestions)
      .then(({ mode, platform }) => this.build(mode, platform))
      .catch((err) => console.error(err));
    })
   
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

  _debugAndroid() {
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
            await this.execute("./gradlew assembleDebug", pathProvider);
            console.info(
              `Build successfully! You can find your .apk file in android/app/build/outputs/apk/debug/`
            );
          }
        );
      } catch (err) {
        console.error(err);
      }
    });
  }

  _releaseAndroid() {
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
            await this.execute("./gradlew assembleRelease", pathProvider);
            console.info(
              `Build successfully! You can find your .apk file in android/app/build/outputs/apk/release/`
            );

            // continue to sign the app
            inquirer.prompt(signAppQuestion).then(answer => {
              if (answer.sign === "no") {
                console.log("You decided not to sign the app now. Notice that this is a must-do if you want to upload your app to playstore in the future!")
                process.exit(1);
              }
              else {
                console.log(`[  IMPORTANT  ] Make sure you generate key using keytool. read more about it here: https://ionicframework.com/docs/deployment/play-store`)
                console.log(`[  IMPORTANT  ] Make sure you have jarsigner and zipalign installed`)
              
            inquirer.prompt(androidReleaseQuestions).then(async (answers) => {
              
              const androidDirPath = `${process.cwd()}/android`;
              const apkReleasePath = `${androidDirPath}/app/build/outputs/apk/release/`;
              const keystoreName = answers.keystoreName;
              const keystoreAlias = answers.keystoreAlias;
              const keystorePass = answers.keystorePass;

              console.log(
                `please wait.. buildonic will sign the app for you. Make sure you have jarsigner installed`
              );
              // const genKeyCMD = `keytool -genkey -v -keystore ${keystoreName}.keystore -alias ${keystoreAlias} -storepass ${keystorePass} -keyalg RSA -keysize 2048 -validity 10000`
              // await this.execute(genKeyCMD, { cwd: apkReleasePath })
              // const jarsignerCMD = `jarsigner -keystore ${keystorePath} -storepass ${keystorePassword} app-release-unsigned.apk ${keystoreAlias} `;
              const jarsignerCMD = `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ${keystoreName}.keystore --storepass ${keystorePass} app-release-unsigned.apk ${keystoreAlias}`
              await this.execute(jarsignerCMD, { cwd: apkReleasePath });

              console.log(`please wait.. buildonic will optimize the app for you.  Make sure you have zipalign installed`);

              const zipalignCMD =
                "zipalign 4 app-release-unsigned.apk app-release.apk";
              await this.execute(zipalignCMD, { cwd: apkReleasePath });
              console.log(`Buildonic has optimized your app successfully. The optimized version is stored under app-release.apk and can be uploaded to playstore directly!`)
              console.log("Thanks for using Buildonic!")
            });
          }
        })
          }
        );
      } catch (err) {
        console.error(err);
      }
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
      // console.debug(`********** executing ${cmd} **********`);
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
