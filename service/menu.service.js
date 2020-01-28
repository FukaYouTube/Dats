const fs = require('fs')

const { keyboard } = require('telegraf/markup')

exports.faq = async ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["FAQ"], keyboard(message["menu"]).oneTime().resize().extra())
}

exports.locations = async ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    
    await ctx.telegram.sendLocation(ctx.chat.id, 43.231863, 76.832276)
    ctx.replyWithMarkdown(message["location"], keyboard(message["menu"]).oneTime().resize().extra())
}

exports.about = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["about"], keyboard(message["menu"]).oneTime().resize().extra())
}

exports.contacts = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["contact"], keyboard(message["menu"]).oneTime().resize().extra())
}

exports.settings = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["settings-message"], keyboard(message["settings-keyboard"]).oneTime().resize().extra())
}

exports.back = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["main-menu-text"], keyboard(message["menu"]).oneTime().resize().extra())
}