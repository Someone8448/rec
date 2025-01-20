module.exports.run = async (msg, args, fConsole) => {
	speak.say('Commands: ' + commands.commands.map(a => `${config.prefix}${a.name}`).join(', '))
}
module.exports.name = "help"
module.exports.aliases = []
