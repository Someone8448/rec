module.exports.run = async (msg, args, fConsole) => {
	if (args.length == 0 || isNaN(Number(args[0]))) return speak.say(`Usage: ${config.prefix}delete <ID>`);
	var song = JSON.parse(await db.get(args[0]));
	if (typeof song === "number") throw new Error();
	if (msg.p._id !== song.id) return speak.say('Sorry, but you did not create this recording!');
	for (var i = 0; i < song.notes.length; i++) {
		var num = song.notes[i];
		try {
			await db.del(`${song.i}_${num}`);
			log('delete', `Deleted chunk ${num}`);
		} catch (error) {
			log('delete', `Error deleting chunk ${i}`);
		}
	}
	await db.del(`${song.i}`);
	speak.say(`Deleted your recording along with its ${song.notes.length} chunk${song.notes.length == 1 ? '' : 's'}.`)
}
module.exports.name = "delete"
module.exports.aliases = ["del"]
