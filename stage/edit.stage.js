const WizardScene = require('telegraf/scenes/wizard')

const fs = require('fs')
const User = require('../model/user.model')

const service = require('../service')
const { keyboard, removeKeyboard } = require('telegraf/markup')

const editor = new WizardScene('edit-data', ctx => {
 
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.session.editdata = { type: undefined }
    ctx.replyWithMarkdown(message["edit-stage-messages"]["question-1"]["msg"], keyboard(message["edit-stage-messages"]["question-1"]["menu"]).oneTime().resize().extra())
    return ctx.wizard.next()

}, ctx => {

    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))

    switch(ctx.message.text){
        case message["edit-stage-messages"]["question-1"]["menu"][0][0]:
            ctx.session.editdata.type = 0
            ctx.replyWithMarkdown(message['edit-stage-messages']['question-2']['send_name'].message, removeKeyboard().oneTime().resize().extra())
            ctx.wizard.next()
        break
        case message["edit-stage-messages"]["question-1"]["menu"][0][1]:
            ctx.session.editdata.type = 1
            ctx.replyWithMarkdown(message['edit-stage-messages']['question-2']['send_surname'].message, removeKeyboard().oneTime().resize().extra())
            ctx.wizard.next()
        break
        case message["edit-stage-messages"]["question-1"]["menu"][1][0]:
            ctx.session.editdata.type = 2
            ctx.replyWithMarkdown(message['edit-stage-messages']['question-2']['send_birthday'].message, removeKeyboard().oneTime().resize().extra())
            ctx.wizard.next()
        break
        case message["edit-stage-messages"]["question-1"]["menu"][1][1]:
            ctx.session.editdata.type = 3
            ctx.replyWithMarkdown(message['edit-stage-messages']['question-2']['send_iin'].message, removeKeyboard().oneTime().resize().extra())
            ctx.wizard.next()
        break
        default:
            ctx.reply(message["main-menu-text"], keyboard(message["menu"]).oneTime().resize().extra())
            return ctx.scene.leave()
    }

}, async ctx => {

    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))

    switch(Number(ctx.session.editdata.type)){
        case 0:
            await User.findByIdAndUpdate(ctx.from.id, { user_name: ctx.message.text })
            ctx.reply(message['edit-stage-messages']['question-2']['send_name'].success, keyboard(message["menu"]).oneTime().resize().extra())
            ctx.scene.leave()
        break
        case 1:
            await User.findByIdAndUpdate(ctx.from.id, { user_surname: ctx.message.text })
            ctx.reply(message['edit-stage-messages']['question-2']['send_surname'].success, keyboard(message["menu"]).oneTime().resize().extra())
            ctx.scene.leave()
        break
        case 2:
            if(!service.regex.birthday.test(ctx.message.text)){
                await ctx.replyWithMarkdown(message["edit-stage-messages"]['question-2']["send_birthday"]["error"])
                ctx.replyWithMarkdown(message["edit-stage-messages"]["question-1"]["msg"], keyboard(message["edit-stage-messages"]["question-1"]["menu"]).oneTime().resize().extra())
                return ctx.wizard.back()
            }

            await User.findByIdAndUpdate(ctx.from.id, { user_birthday: ctx.message.text })
            ctx.reply(message['edit-stage-messages']['question-2']['send_birthday'].success, keyboard(message["menu"]).oneTime().resize().extra())
            ctx.scene.leave()
        break
        case 3:
            if(!Number(ctx.message.text)){
                await ctx.replyWithMarkdown(message["edit-stage-messages"]['question-2']["send_iin"]["error"])
                ctx.replyWithMarkdown(message["edit-stage-messages"]["question-1"]["msg"], keyboard(message["edit-stage-messages"]["question-1"]["menu"]).oneTime().resize().extra())
                return ctx.wizard.back()
            }


            await User.findByIdAndUpdate(ctx.from.id, { user_iin: Number(ctx.message.text) })
            ctx.reply(message['edit-stage-messages']['question-2']['send_iin'].success, keyboard(message["menu"]).oneTime().resize().extra())
            ctx.scene.leave()
        break
    }
    
})

module.exports = editor