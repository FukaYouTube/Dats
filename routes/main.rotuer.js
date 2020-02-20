const Composer = require('telegraf/composer')
const app = new Composer()

const fs= require('fs')
const User = require('../model/user.model')

const service = require('../service')

app.start(ctx => service.main.cmdStart(ctx))
app.help(ctx => service.main.cmdHelp(ctx))

// Null function
app.hears(/./gm, async (ctx, next) => {
    let user = await User.findById(ctx.from.id)
    if(!user) return null
    
    next()
})

// More ...
app.hears(/./gm, (ctx, next) => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))

    switch(ctx.message.text){
        case message["menu"][0][0]: service.menu.myurl(ctx)
        break
        case message["menu"][1][0]: service.menu.mylist(ctx)
        break
        case message["menu"][2][0]: service.menu.locations(ctx)
        break
        case message["menu"][3][0]: service.menu.faq(ctx)
        break
        case message["menu"][3][1]: service.menu.about(ctx)
        break
        case message["menu"][3][2]: service.menu.contacts(ctx)
        break
        case message["menu"][4][0]: service.menu.video(ctx)
        break
        case message["menu"][5][0]: service.menu.settings(ctx)
        break
        default: next()
    }
})

app.hears(/./gm, (ctx, next) => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.message.text == message["settings-keyboard"][0][0] ? service.settings.editLanguageMessage(ctx) : next()
})

app.action('ru_language', ctx => service.settings.editLanguage(ctx, "ru"))
app.action('kz_language', ctx => service.settings.editLanguage(ctx, "kz"))
app.action('eng_language', ctx => service.settings.editLanguage(ctx, "eng"))

// Back
app.hears(/./gm, (ctx, next) => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.message.text === message["back-menu"] ? service.menu.back(ctx) : next()
})

module.exports = app