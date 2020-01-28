const path      = require('path')
const bunyan    = require('bunyan')

// View package.json file projects
const fs = require('fs')
const projects = JSON.parse(fs.readFileSync('package.json'))

// Create log folders
if(!fs.existsSync('source/debug/log')){
    fs.mkdirSync('source/debug/log')
}

// Save log functions
let logger = bunyan.createLogger({
    name: projects.name,
    streams: [{
        level: 'info',
        path: path.resolve(__dirname, `log/${projects.name}-logger.json`)
    }]
})

module.exports = logger