// ###### © Dats - telegram bot 2020
// ###### Developer: Fuka
// ###### For company: ELaboration.Asia

// ###### View env file
require('dotenv').config()

// ###### Import print.js
const Print = require('./source/print')
const print = new Print()

// ###### Connect to Database
const mongoose = require('mongoose')

const optionMongoose = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

const connectMongoose = mongoose.connect(process.env.URI_MONGO, optionMongoose)

connectMongoose.then(print.info('Connect to MongoDB ...'))
connectMongoose.catch(err => print.error(err))

// ###### Bot application
const Telegraf = require('telegraf')
const app = new Telegraf(process.env.BOT_TOKEN)

const session = require('telegraf/session')
const stage = require('./stage')

app.use(session())
app.use(stage)

// ###### Rotuer
const router = require('./routes')

app.use(router.main)
app.use(router.admin)

// ###### Run bot
app.startPolling()