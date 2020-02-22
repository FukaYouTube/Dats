const WizardScene = require('telegraf/scenes/wizard')


const sendMessage = new WizardScene('send-message-to-user', ctx => {
    
    ctx.reply('Какое сообщение вы хотите отправить?')
    return ctx.wizard.next()

}, async ctx => {

    if(ctx.message.text == 'отмена' || ctx.message.text == 'Отмена'){
        ctx.reply('Отменено...')
        return ctx.wizard.leave()
    }

    await ctx.telegram.sendMessage(ctx.session.whom_to_send, ctx.message.text)
    ctx.reply('Сообщение отправлено!')
    ctx.session.whom_to_send = null
    return ctx.scene.leave()

})

module.exports = sendMessage