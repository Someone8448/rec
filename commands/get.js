module.exports.run = async (msg, args, fConsole) => {
	if (args.length == 0 || isNaN(Number(args[0]))) return speak.say(`Usage: ${config.prefix}get <ID>`);
	var song = JSON.parse(await db.get(args[0]));
	if (typeof song === "number") throw new Error();
	speak.say(`Made by ${song.id}, Users: ${song.users.join(', ')} | Length: ${fun.timenum(song.t / 1000)} | Chunks: ${song.notes.length} | JSON: ${!song.convert}`);
}
module.exports.name = "get"
module.exports.aliases = ["info"]
