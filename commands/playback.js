module.exports.run = async (msg, args, fConsole) => {
	if (args.length == 0 || isNaN(Number(args[0]))) return speak.say(`Usage: ${config.prefix}playback <ID>`);
	if (player.playing && player.using !== msg.p._id) return speak.say(`The player is currently playing something. Say ${config.prefix}stop playback to stop it.`);
	var song = JSON.parse(await db.get(args[0]));
	song.data = [];
	for (var i = 0; i < song.notes.length; i++) {
		var num = song.notes[i];
		try {
			var chunk = (song.convert ? convert : JSON.parse)(await db.get(`${song.i}_${num}`));
			//song.data = song.data.concat(chunk);
			chunk.forEach(n => song.data.push(n));
			log('load', `Loaded chunk ${num}`)
		} catch (error) {
			log('load', `Error loading chunk ${num}`);
			//console.log(error)
		}
	}
	if (typeof song === "number") throw new Error();
	speak.say(`Made by ${song.id}, Users: ${song.users.join(', ')} | Length: ${fun.timenum(song.t / 1000)} | Events: ${song.data.length}`);
	player.load(song.data);
	player.using = msg.p._id;
	player.play();
}
module.exports.name = "playback"
module.exports.aliases = ["play"]
