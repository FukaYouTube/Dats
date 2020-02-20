const fs = require('fs')
const User = require('../model/user.model')

const { keyboard } = require('telegraf/markup')

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
        message["list-all-user"][2] + ' ' + u.user_middlename + '\n' +
        message["list-all-user"][3] + ' ' + `${u.date.getDate()}.${
            (u.date.getMonth() + 1) <= 10 ? '0' + (u.date.getMonth() + 1) :
            (u.date.getMonth() + 1)}.${u.date.getFullYear()
        } [${u.date.getHours()}:${u.date.getMinutes()} Coordinated Universal Time (GMT+0000)]` + '\n\n'
    })

    ctx.reply(list, keyboard(message["menu"]).oneTime().resize().extra())
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

exports.video = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    
    let mediaArr = [{
        type: 'video',
        media: 'BAACAgIAAxkBAAIWQl5OKw1lKOKpKG-vVH_RttDx_mAMAAItBgACx7pwSt1S2AHTsMAbGAQ'
    }, {
        type: 'video',
        media: 'BAACAgIAAxkBAAIWQ15OLJ0mjpb1_zfoLuO7Soy2GN0LAAIIBQAC60hwStQqFATNFcxwGAQ'
    }]

    ctx.replyWithMediaGroup(mediaArr)
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