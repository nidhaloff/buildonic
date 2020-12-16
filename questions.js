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
      message: "Enter your keystore path: "
    }, 
    {
        type: 'input',
        name: 'keystorePassword',
        message: "Enter your keystore password: "
    }, 
    {
        type: 'input',
        name: 'keystoreAlias',
        message: "Enter your keystore alias: "
    }, 
    {
        type: 'input',
        name: 'sdkPath',
        message: "Enter path to your android sdk: ",
        default: `/home/${os.hostname()}/Android/Sdk`
    }
  ]



  const androidDebugQuestions = [
    {
      type: 'input',
      name: 'sdkPath',
      message: "Enter path to your android sdk: ",
      default: `/home/${os.hostname()}/Android/Sdk`
  }
    
  ]
  module.exports = { 
      initQuestions, 
      androidDebugQuestions,
      androidReleaseQuestions
  }

