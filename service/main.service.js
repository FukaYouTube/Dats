const fs = require('fs')
const User = require('../model/user.model')

const { keyboard } = require('telegraf/markup')

exports.cmdStart = async ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    let user = await User.findById(ctx.from.id)

    let refurl = await User.findById(ctx.startPayload)
    if(refurl && !user){
        ctx.session.start_on_refurl = ctx.startPayload
        await ctx.replyWithMarkdown(message["welcome"]["new-user-refurl"][0] + ` ${refurl.user_name} ${refurl.user_middlename}. ` + message["welcome"]["new-user-refurl"][1])
        return ctx.scene.enter('new-user')
    }

    if(user){
        ctx.replyWithMarkdown(message["welcome"]["old-user"], keyboard(message["menu"]).oneTime().resize().extra())
    }else{
        await ctx.replyWithMarkdown(message["welcome"]["new-user"])
        ctx.scene.enter('new-user')
    }
}

exports.cmdHelp = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["help"])
}