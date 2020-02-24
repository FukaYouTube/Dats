const fs = require('fs')
const User = require('../model/user.model')

const { keyboard } = require('telegraf/markup')

function dateFormat(date){
    return `${date.getDate()}.${(date.getMonth() + 1) <= 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}.${date.getFullYear()} [${date.getHours()}:${date.getMinutes()} Coordinated Universal Time (GMT+0000)]`
}

exports.myurl = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["my-url"] + ` https://t.me/DatsFinanceBot?start=${ctx.from.id}`, keyboard(message["menu"]).oneTime().resize().extra())
}

exports.mylist = async ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    let all_user = await User.find({ by_whom: ctx.from.id })
    
    let list = message["my-list-in-user"] + '\n\n'

    all_user.map(u => {
        list += `${u.username ? `Username: @` + u.username : ``}\n` +
        message["list-all-user"][0] + ' ' + u.user_name + '\n' +
        message["list-all-user"][1] + ' ' + u.user_surname + '\n' +
        message["list-all-user"][3] + ' ' + dateFormat(u.date) + '\n\n'
    })

    ctx.reply(list, keyboard(message["menu"]).oneTime().resize().extra())
}

exports.mydata = async ctx => {
    let user = await User.findById(ctx.from.id)
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))

    let messagesend = `${user.username ? `Username: @` + user.username : ``}\n` +
    message["my-list"]['msg'][0] + ' ' + user.user_name + '\n' +
    message["my-list"]['msg'][1] + ' ' + user.user_surname + '\n' +
    message["my-list"]['msg'][2] + ' ' + user.user_birthday + '\n' +
    message["my-list"]['msg'][3] + ' ' + user.user_iin + '\n' +
    message["my-list"]['msg'][4] + ' ' + user.ref_url + '\n' +
    message["my-list"]['msg'][6] + ' ' + dateFormat(user.date)

    ctx.reply(messagesend, keyboard(message["my-list"].menu).oneTime().resize().extra())
}

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

exports.video = async ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    
    let mediaArr = [{
        type: 'video',
        media: 'BAACAgIAAxkBAAIHoV5ONgdYtmVeQ1aPyAsEGy7C8aSRAAJhBwAC6pV5Slrm6xk8rFJMGAQ'
    }, {
        type: 'video',
        media: 'BAACAgIAAxkBAAIHol5ONxTOykWpmcPQCvCDom8bdv8YAAKhBgACCbNwSuVkrmvf1E0XGAQ'
    }]

    await ctx.replyWithMediaGroup(mediaArr)
    ctx.reply('...', keyboard(message["menu"]).oneTime().resize().extra())
}

exports.settings = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["settings-message"], keyboard(message["settings-keyboard"]).oneTime().resize().extra())
}

exports.back = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["main-menu-text"], keyboard(message["menu"]).oneTime().resize().extra())
}