const Stage = require('telegraf/stage')
const stage = new Stage()

stage.register(require('./register.stage'))

module.exports = stage