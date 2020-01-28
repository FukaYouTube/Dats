const User = require('../model/user.model')
const Admin = require('../model/admin.model')

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
        ctx.reply('Все команды: \n/all_user \n/admin_help \n/view_user (id user)')
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
        all_users += `ID пользователя: ${u._id} \nНик: ${u.first_name} \nЮзер: @${u.username} \nИмя: ${u.user_name} \nФамилия: ${u.user_surname} \nОтчество: ${u.user_middlename} \nДата регистраций: ${u.date} \n\n`
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
        users += `ID пользователя: ${user._id} \nНик: ${user.first_name} \nЮзер: @${user.username} \nИмя: ${user.user_name} \nФамилия: ${user.user_surname} \nОтчество: ${user.user_middlename} \nДата рождения: ${user.user_birthday} (дата/месяц/год или дата-месяц-год) \nИИН: ${user.iin} \nРеферальная ссылка: ${user.ref_url} \nОт кого: ${user.by_whom} \n Дата регистраций: ${user.date} \n\nДерево пользователя: \n\n`

        let all_user = await User.find({ by_whom: user._id })
        
        all_user.map(u => {
            users += `ID: ${u._id} \nНик: ${u.first_name} \nЮзер: @${u.username} \nИмя: ${u.user_name} \nФамилия: ${u.user_surname} \nОтчество: ${u.user_middlename} \nДата регистраций: ${u.date} \n\n`
        })

        ctx.reply(users)
    }else{
        ctx.reply('Пользователь не найден')
    }
}