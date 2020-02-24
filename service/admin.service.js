const { inlineKeyboard, callbackButton } = require('telegraf/markup')

const User = require('../model/user.model')
const Admin = require('../model/admin.model')

function dateFormat(date){
    return `${date.getDate()}.${(date.getMonth() + 1) <= 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}.${date.getFullYear()} [${date.getHours()}:${date.getMinutes()} Coordinated Universal Time (GMT+0000)]`
}
function viewUserFormat(user){
    return `ID пользователя: ${user._id} \nНик: ${user.first_name} \nЮзер: @${user.username} \nИмя: ${user.user_name} \nФамилия: ${user.user_surname} \nДата регистраций: ${dateFormat(user.date)} \n\n`
}

exports.active_code = async ctx => {
    if(ctx.session.secret_code == ctx.match[1]){
        let admin = new Admin({
            _id: ctx.from.id,
            username: ctx.from.username,
            first_name: ctx.from.first_name
        })
        admin.save()

        ctx.replyWithMarkdown('Администратор успешно добавлен!')
    }
}

exports.admin_help = async ctx => {
    let admin = await Admin.findById(ctx.from.id)
    
    if(admin){
        ctx.reply('Все команды: \n/all_user - список всех пользователей \n/admin_help - доступные команды \n/view_user (id user) - полный список выбранного пользователя \n/send_message (id user) - отправить сообщение пользователю \n\n!Внимение: где поле (id user) пишите ID пользователя! \nПример: /view_user 123456789')
    }
}

exports.all_user = async ctx => {
    let admin = await Admin.findById(ctx.from.id)
    
    if(!admin){
        return null
    }

    let user = await User.find({})
    let all_users = `Все пользователи: \n\n`

    user.map(async u => {
        all_users += viewUserFormat(u)
    })

    ctx.reply(all_users)
}

exports.view_user = async ctx => {
    let admin = await Admin.findById(ctx.from.id)

    if(!admin){
        return null
    }

    let user = await User.findById(ctx.match[1])
    let users = `Пользователь ${'@' + user.username || user.first_name}: \n\n`
    
    if(user){
        users += `ID пользователя: ${user._id} \n` +
        `Ник: ${user.first_name} \nЮзер: @${user.username} \n` +
        `Имя: ${user.user_name} \nФамилия: ${user.user_surname} \n` +
        `Дата рождения: ${user.user_birthday} (дата/месяц/год или дата-месяц-год) \n` +
        `ИИН: ${user.user_iin} \nРеферальная ссылка: ${user.ref_url} \n` +
        `От кого: ${user.by_whom} \n` +
        `Дата регистраций: ${dateFormat(user.date)}` + '\n\n' +
        `Дерево пользователя: \n\n`

        let all_user = await User.find({ by_whom: user._id })
        
        all_user.map(u => {
            users += viewUserFormat(u)
        })

        ctx.reply(users)
    }else{
        ctx.reply('Пользователь не найден')
    }
}

exports.sendMessageToUser = async ctx => {
    let admin = await Admin.findById(ctx.from.id)

    if(!admin){
        return null
    }

    ctx.session.whom_to_send = ctx.match[1]
    ctx.scene.enter('send-message-to-user')
}

exports.removeUserMessage = async ctx => {
    let admin = await Admin.findById(ctx.from.id)

    if(!admin){
        return null
    }

    if(!Number(ctx.match[1])){
        ctx.reply('После команды /remove_user напишите ID пользователя! \nПример: /remove_user 123456789')
        return null
    }

    ctx.session.rmuserid = ctx.match[1]
    ctx.reply('Вы уверены что хотите удлаить данного пользователя?', inlineKeyboard([
        [callbackButton('Да уверен все на 100%', 'yes-remove-user')],
        [callbackButton('Не уверен', 'not-remove-user')],
        [callbackButton('Отмена', 'not-remove-user')]
    ]).extra())
}

exports.removeUser = async ctx => {
    let admin = await Admin.findById(ctx.from.id)

    if(!admin){
        return null
    }

    ctx.deleteMessage()
    await User.remove({ _id: Number(ctx.session.rmuserid) })
    ctx.reply('Данный пользователь успешно удален!')
}