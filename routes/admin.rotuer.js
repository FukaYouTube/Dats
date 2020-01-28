const Composer = require('telegraf/composer')
const app = new Composer()

const service = require('../service')

app.command('add_admin', ctx => {
    ctx.session.secret_code = Math.floor(100000 + Math.random() * 900000)
    console.log(ctx.session.secret_code)
})

app.hears(/active_code\s([^+\"]+)/i, ctx => service.admin.active_code(ctx))

app.command('admin_help', ctx => service.admin.admin_help(ctx))
app.command('all_user', async ctx => service.admin.all_user(ctx))

app.hears(/view_user\s([^+\"]+)/i, ctx => service.admin.view_user(ctx))

module.exports = app