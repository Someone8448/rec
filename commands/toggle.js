module.exports.run = async (msg, args, fConsole) => {
	if (!config.filter) return speak.say('This feature is disabled.');
	if (args.length == 0 || !['deblack', 'sustain'].includes(args[0])) return speak.say(`Usage: ${config.prefix}toggle <deblack, sustain> | d: ${!!config.filter.deblack}, s: ${!!config.filter.sustain}`);
	config.filter[args[0]] = !config.filter[args[0]];
	speak.say(`Set \`${args[0]}\` to ${config.filter[args[0]]}`);
}
module.exports.name = "toggle"
module.exports.aliases = []
