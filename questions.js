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
      name: 'keystoreName',
      default: 'my-release-key',
      message: "Enter your keystore name: "
    }, 
    // {
    //   type: 'input',
    //   name: 'keystorePass',
    //   default: 'my-release-password',
    //   message: "Enter your keystore password: "
    // }, 
    
    {
        type: 'input',
        name: 'keystoreAlias',
        default: 'my-key-alias',
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
      message: "Do you want to continue and sign your app? (make sure you generate a key using keytool first) ",
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

