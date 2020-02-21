const WizardScene = require('telegraf/scenes/wizard')

const fs = require('fs')
const User = require('../model/user.model')

const service = require('../service')
const { keyboard } = require('telegraf/markup')

const register = new WizardScene('new-user', ctx => {
 
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["register"]["send_name"]["message"])
    return ctx.wizard.next()

}, ctx => {

    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    
    ctx.session.user_info = {
        name: ctx.message.text,
        surname: undefined,
        birthday: undefined
    }

    ctx.replyWithMarkdown(message["register"]["send_surname"]["message"])
    return ctx.wizard.next()

}, ctx => {
    
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))

    if(ctx.message.text === 'назад' || ctx.message.text === 'Назад'){
        ctx.replyWithMarkdown(message["register"]["send_name"]["message"]) // send user name
        return ctx.wizard.back()
    }

    ctx.session.user_info.surname = ctx.message.text
    ctx.replyWithMarkdown(message["register"]["send_birthday"]["message"])
    return ctx.wizard.next()

}, async ctx => {
    
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))

    if(ctx.message.text === 'назад' || ctx.message.text === 'Назад'){
        ctx.replyWithMarkdown(message["register"]["send_surname"]["message"]) // send user surname
        return ctx.wizard.back()
    }

    if(!service.regex.birthday.test(ctx.message.text)){
        await ctx.replyWithMarkdown(message["register"]["send_birthday"]["error"])
        ctx.replyWithMarkdown(message["register"]["send_surname"]["message"]) // send user surname
        return ctx.wizard.back()
    }

    ctx.session.user_info.birthday = ctx.message.text
    ctx.replyWithMarkdown(message["register"]["send_iin"]["message"])
    return ctx.wizard.next()

}, async ctx => {

    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))

    if(ctx.message.text === 'назад' || ctx.message.text === 'Назад'){
        ctx.replyWithMarkdown(message["register"]["send_birthday"]["message"]) // send user birthday
        return ctx.wizard.back()
    }

    if(!service.regex.individual_identification_number.test(ctx.message.text)){
        await ctx.replyWithMarkdown(message["register"]["send_iin"]["error"])
        ctx.replyWithMarkdown(message["register"]["send_birthday"]["message"]) // send user birthday
        return ctx.wizard.back()
    }
    
    let user = new User({
        _id: ctx.from.id,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        user_name: ctx.session.user_info.name,
        user_surname: ctx.session.user_info.surname,
        user_birthday: ctx.session.user_info.birthday,
        user_iin: Number(ctx.message.text),
        by_whom: Number(ctx.session.start_on_refurl) || '',
        ref_url: `https://t.me/DatsFinanceBot?start=${ctx.from.id}`,
    })
    
    user.save()

    let refurl = await User.findById(ctx.session.start_on_refurl)
    if(refurl) ctx.telegram.sendMessage(refurl._id, message["new-user-on-refurl"][0] + ` ${ctx.session.user_info.name} ${ctx.session.user_info.surname} ` + message["new-user-on-refurl"][1])

    ctx.session.user_info = null
    ctx.session.start_on_refurl = null

    ctx.replyWithMarkdown(message["register"]["done_register"], keyboard(message["menu"]).oneTime().resize().extra())
    return ctx.scene.leave()

})

module.exports = register