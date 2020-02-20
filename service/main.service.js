const fs = require('fs')
const User = require('../model/user.model')

const { keyboard } = require('telegraf/markup')

exports.cmdStart = async ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    let user = await User.findById(ctx.from.id)

    let mediaArr = [{
        type: 'photo',
        media: 'AgACAgIAAxkBAAIHn15ONb7V7f6HaqVvtTQBJD8C9E9dAAJWrTEbhgdxStAwRT48JU2ghXfBDwAEAQADAgADbQADtbEEAAEYBA'
    }, {
        type: 'photo',
        media: 'AgACAgIAAxkBAAIHoF5ONb5ADL7CmXrx1cK_OuN6Mp1OAAJXrTEbhgdxSte0agvz0mtGSrl7kS4AAwEAAwIAA20AA1YXAAIYBA'
    }]

    let refurl = await User.findById(ctx.startPayload)
    if(refurl && !user){
        ctx.session.start_on_refurl = ctx.startPayload
        await ctx.replyWithMarkdown(message["welcome"]["new-user-refurl"][0] + ` ${refurl.user_name} ${refurl.user_middlename}. ` + message["welcome"]["new-user-refurl"][1])
        return ctx.scene.enter('new-user')
    }

    if(user){
        ctx.replyWithMediaGroup(mediaArr)
        setTimeout(() => {
            ctx.replyWithMarkdown(message["welcome"]["old-user"], keyboard(message["menu"]).oneTime().resize().extra())
        }, 1000)
    }else{
        ctx.replyWithMediaGroup(mediaArr)
        setTimeout(() => {
            ctx.replyWithMarkdown(message["welcome"]["new-user"])
            ctx.scene.enter('new-user')
        }, 1000)
    }
}

exports.cmdHelp = ctx => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))
    ctx.replyWithMarkdown(message["help"])
}