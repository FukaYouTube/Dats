const fs = require('fs')
const User = require('../model/user.model')

const { keyboard } = require('telegraf/markup')

exports.cmdStart = async ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    let user = await User.findById(ctx.from.id)

    let mediaArr = [{
        type: 'photo',
        media: 'AgACAgIAAxkBAAIWWF5OLqY04TyV66BWriMqvLlkGOrnAAJWrTEbhgdxSlcAATQoHUlAfoV3wQ8ABAEAAwIAA3gAA7OxBAABGAQ'
    }, {
        type: 'photo',
        media: 'AgACAgIAAxkBAAIWWV5OLqhHfL4wUQABP4lzr8cQY3QaWwACV60xG4YHcUpiYcHfWzdUK0q5e5EuAAMBAAMCAAN4AANXFwACGAQ'
    }]

    let refurl = await User.findById(ctx.startPayload)
    if(refurl && !user){
        ctx.session.start_on_refurl = ctx.startPayload
        await ctx.replyWithMarkdown(message["welcome"]["new-user-refurl"][0] + ` ${refurl.user_name} ${refurl.user_middlename}. ` + message["welcome"]["new-user-refurl"][1])
        return ctx.scene.enter('new-user')
    }

    if(user){
        await ctx.replyWithMarkdown(message["welcome"]["old-user"], keyboard(message["menu"]).oneTime().resize().extra())
        ctx.replyWithMediaGroup(mediaArr)
    }else{
        await ctx.replyWithMarkdown(message["welcome"]["new-user"])
        ctx.replyWithMediaGroup(mediaArr)
        ctx.scene.enter('new-user')
    }
}

exports.cmdHelp = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["help"])
}