module.exports.run = async (msg, args, fConsole) => {
	if (args.length == 0 || !midi.jobs[args[0]]) return speak.say(Object.keys(midi.jobs).join(', '));
	var job = midi.jobs[args[0]];
	speak.say(`${job.getStatus()} | By ${job.id} | ${job.midi}`)
}
module.exports.name = "jobs"
module.exports.aliases = ["job"]
