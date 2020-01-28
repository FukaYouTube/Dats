// file system
const fs = require('fs')

// Use telegraf technology
const { keyboard, inlineKeyboard, callbackButton } = require('telegraf/markup')

exports.editLanguageMessage = (ctx) => {
    ctx.replyWithMarkdown('Выберите язык | Choose language | Тілді таңдаңыз', inlineKeyboard([
        [callbackButton('🇷🇺 Руский язык', 'ru_language')],
        [callbackButton('🇰🇿 Қазақ тілі', 'kz_language')],
        [callbackButton('🇺🇸 English language', 'eng_language')]
    ]).extra())
}

exports.editLanguage = (ctx, type_lang) => {
    let message = JSON.parse(fs.readFileSync(`source/messages/msg.${ctx.session.lang || "ru"}.json`))

    switch(type_lang){
        case 'ru':
        ctx.deleteMessage()
        ctx.session.lang = 'ru'
        ctx.replyWithMarkdown('✅ Успешно переведено на русский язык', keyboard([ message["back-menu"] ]).oneTime().resize().extra())
        break
        case 'kz':
        ctx.deleteMessage()
        ctx.session.lang = 'ru'
        ctx.replyWithMarkdown('❌ Кешіріңіз, қате пайда болды', keyboard([ message["back-menu"] ]).oneTime().resize().extra())
        break
        case 'eng':
        ctx.deleteMessage()
        ctx.session.lang = 'ru'
        ctx.replyWithMarkdown('❌ Sorry, an error occurred', keyboard([ message["back-menu"] ]).oneTime().resize().extra())
        break
    }
}