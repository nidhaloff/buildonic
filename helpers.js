const timer = ms => new Promise( res => setTimeout(res, ms));

module.exports = { timer }