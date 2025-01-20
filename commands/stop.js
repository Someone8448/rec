module.exports.run = async (msg, args, fConsole) => {
	if (['play', 'playing', 'playback'].includes(args[0])) {
		if (player.playing && (player.using === msg.p._id || fConsole)) {
			player.stop();
			speak.say('Stopped playing...');
		} else speak.say('Unable to stop.')
	} else if (['record', 'recording', 'rec'].includes(args[0])) {
		var reco = rec.find(a => a.id === msg.p._id)
                if (!reco) return speak.say('You aren\'t recording.');
                rec.splice(rec.indexOf(reco), 1);
                delete reco.r;
                reco.t = Date.now() - reco.t;
                var id = await db.id();
		reco.i = id;
		reco.convert = config.convert
		var noteids = [];
                for (var i = 0;;i++) {
                        if (reco.notes.length == 0) break;
                        await db.put(`${id}_${i}`, (config.convert ? convert : JSON.stringify)(reco.notes.splice(0, config.buffer.size)));
			log('save', `Saved chunk ${i}`);
                        noteids.push(i);
                }
                reco.notes = noteids;
                await db.put(id, JSON.stringify(reco));
                speak.say(`Stopped recording. ID: ${id}`);
	} else speak.say(`Invalid Option. | Usage: ${config.prefix}stop <playback, recording>`)
}
module.exports.name = "stop"
module.exports.aliases = []
