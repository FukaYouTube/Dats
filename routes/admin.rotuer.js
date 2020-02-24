const Composer = require('telegraf/composer')
const app = new Composer()

const service = require('../service')

// ## Command
app.command('add_admin', ctx => {
    ctx.session.secret_code = Math.floor(100000 + Math.random() * 900000)
    console.log(ctx.session.secret_code)
})
app.command('admin_help', ctx => service.admin.admin_help(ctx))
app.command('all_user', ctx => service.admin.all_user(ctx))

// ## Hears
app.hears(/active_code\s([^+\"]+)/i, ctx => service.admin.active_code(ctx))
app.hears(/view_user\s([^+\"]+)/i, ctx => service.admin.view_user(ctx))
app.hears(/send_message\s([^+\"]+)/i, ctx => service.admin.sendMessageToUser(ctx))
app.hears(/remove_user\s([^+\"]+)/i, ctx => service.admin.removeUserMessage(ctx))

// ## Action
app.action('not-remove-user', ctx => ctx.deleteMessage())
app.action('yes-remove-user', ctx => service.admin.removeUser(ctx))

module.exports = app