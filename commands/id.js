module.exports.run = async (msg, args, fConsole) => {
	speak.say(`Your ID is: ${msg.p._id}`);
}
module.exports.name = "id"
module.exports.aliases = []
