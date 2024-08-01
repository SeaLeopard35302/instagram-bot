const fs = require('fs');
const path = require('path');

const commandsFolder = path.join(__dirname, 'cmds')
const commands = [];

fs.readdirSync(commandsFolder).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(path.join(commandsFolder, file))
    commands.push(command)
  }
})


module.exports = commands;