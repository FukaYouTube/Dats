const { red, yellow, green, blue, reset } = require('./colors')
const debug = require('../debug')

// View package.json file projects
const fs = require('fs')
const projects = JSON.parse(fs.readFileSync('package.json'))

// Log messages
class Print{
    log(message){
        let msg = `[${projects.name}::log] ${message}`
        debug.info(msg)

        process.stdout.write(green + msg + reset + '\n')
    }

    info(message){
        let msg = `[${projects.name}::info] ${message}`
        debug.info(msg)

        process.stdout.write(blue + msg + reset + '\n')
    }

    warn(message){
        let msg = `[${projects.name}::warn] ${message}`
        debug.info(msg)
        
        process.stdout.write(yellow + msg + reset + '\n')
    }

    error(message){
        let msg = `[${projects.name}::error] ${message}`
        debug.info(msg)

        process.stdout.write(red + msg + reset + '\n')
    }
}

module.exports = Print