module.exports = async (uuid) => {
	if (uuid) {
		var location = `midi/jobs/${uuid}/`
	} else var location = '../noteconv/data/'
	var id = await db.id();
	var notechunks = JSON.parse(fs.readFileSync(`${location}main`));
	var noterec = {"i": id, "id": uuid ? midi.jobs[uuid].id : "midi", "users": uuid ? (midi.jobs[uuid].name ? ["midi", midi.jobs[uuid].midi, midi.jobs[uuid].name] : ["midi", midi.jobs[uuid].midi]) : ["midi"], notes: notechunks, t: Number(fs.readFileSync(`${location}length`, 'utf8')), convert: config.convert};
	for (var i = 0; i < notechunks.length; i++) {
		await db.put(`${id}_${i}`, config.convert ? convert(JSON.parse(fs.readFileSync(`${location}${notechunks[i]}`))) : fs.readFileSync(`${location}${notechunks[i]}`));
		log('save', `Saved chunk ${notechunks[i]}`);
	}
	await db.put(id, JSON.stringify(noterec));
	log('save' ,`ID: ${id}`);
	return id;
}
