const os = require('os')


const initQuestions = [
    {
      type: 'list',
      name: 'mode',
      message: "Enter your build mode: ",
      choices: ['debug', 'release'],
      default: 'debug'
    }, {
      type: 'list',
      name: 'platform',
      message: "Enter your target platform: ",
      default: 'android',
      choices: ['android', 'ios']
    }
  ]

  const androidReleaseQuestions = [
    
    {
      type: 'input',
      name: 'keystorePath',
      default: 'my-release-key.keystore',
      message: "Enter your keystore path: "
    }, 
    {
        type: 'input',
        name: 'keystorePassword',
        default: 'password',
        message: "Enter your keystore password: "
    }, 
    {
        type: 'input',
        name: 'keystoreAlias',
        default: 'alias-name',
        message: "Enter your keystore alias: "
    }
  ]



  const androidSdkPathQuestion = [
    {
      type: 'input',
      name: 'sdkPath',
      message: "Enter path to your android sdk: ",
      default: '/home/nidhal/Android/Sdk' //`/home/${os.hostname()}/Android/Sdk`
  }
    
  ]

  const signAppQuestion = [
    {
      type: 'list',
      name: 'sign',
      message: "Do you want to continue and sign your app? ",
      choices: ['yes', 'no'],
      default: 'no'
    }
  ]
  module.exports = { 
      initQuestions, 
      signAppQuestion,
      androidSdkPathQuestion,
      androidReleaseQuestions
  }

