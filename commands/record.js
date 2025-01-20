module.exports.run = async (msg, args, fConsole) => {
	if (args.length == 0) return speak.say(`Usage: ${config.prefix}record <Full User IDs>`)
	if (rec.find(a => a.id === msg.p._id)) return speak.say(`You already have a recording. Say ${config.prefix}stop recording to stop the recording before recording something else.`);
	var ran = Math.random();
	var users = [];
	args.forEach(a => {
		if (users.includes(a)) return;
		users.push(a);
	})
	rec.push({id: msg.p._id, users: users, notes: [], t: Date.now(), r: ran});
	speak.say('Now recording...');
	setTimeout(async () => {
		var reco = rec.find(a => ran === a.r && a.id === msg.p._id)
		if (!reco) return;
		rec.splice(rec.indexOf(reco), 1);
		delete reco.r;
		reco.t = config.max;
		var id = await db.id();
		reco.i = id;
		reco.convert = config.convert;
		var noteids = [];
		for (var i = 0;;i++) {
			if (reco.notes.length == 0) break;
			await db.put(`${id}_${i}`, (config.convert ? convert : JSON.stringify)(reco.notes.splice(0, config.buffer.size)));
			log('save', `Saved chunk ${i}`);
			noteids.push(i);
		}
		reco.notes = noteids;
		await db.put(id, JSON.stringify(reco));
		speak.say(`@${msg.p._id}, I have automatically went over the maximum recording time of ${fun.timeword(config.max)}, so I saved your recording. ID: ${id}`);
	}, config.max)
}
module.exports.name = "record"
module.exports.aliases = ["rec"]
