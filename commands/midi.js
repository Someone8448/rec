module.exports.run = async (msg, args, fConsole) => {
	if (args.length < 2 || !['url', 'path'].includes(args[0])) return speak.say(`Usage: ${config.prefix}midi <url, path (console only)> <url or path> <extra name URL only>`);
	if (!fConsole && args[0] === "path") return speak.say('Only console can convert paths.');
	try {
		var output = await midi.create(msg.p._id, args[0], (args[0] === "url") ? args[1] : args.slice(1).join(' '), (args.length > 2 && args[0] === "url") ? args.slice(2).join(' ') : undefined);
		if (typeof output === "string") throw output;
		speak.say(`Conversion begun. View status with the ${config.prefix}jobs. ID: ${output.uuid}`)
	} catch (uui) {
		delete midi.jobs[uui];
		speak.say(`There was a problem beginning comnversion (i.e. Downloading / Initializing).`)
		log('error', uui)
	}
}
module.exports.name = "midi"
module.exports.aliases = []
