const Stage = require('telegraf/stage')
const stage = new Stage()

stage.register(require('./register.stage'))
stage.register(require('./sendMessage.stage'))

module.exports = stage