var cmds = {};
cmds.commands = [];
cmds.load = () => {
cmds.commands = [];
fs.readdirSync('commands').filter(f => f.endsWith('.js')).forEach(file => {
try {
var cFileName = `./commands/${file}`
var cFile = require(cFileName)
delete require.cache[require.resolve(cFileName)]
cmds.commands.push(cFile)
log('cmds' , `Loaded command ${file}`)
} catch (error) {
console.log('cmds', `Failed to load command ${file}: ${error}`)
}
})
}
cmds.get = (cName) => {
return cmds.commands.find(Command => Command.name === cName || Command.aliases.includes(cName));
}
module.exports = cmds
