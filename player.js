var player = {};
player.playing = false;
player.data = [];
player.length = 0;
player.using = "";
player.time = 0;
player.play = () => {
	if (player.playing && player.interval) return;
	if (!player.playing && player.interval) return player.playing = true;
	player.interval = setInterval(() => {
		if (!player.playing) return;
		if (player.time > player.length) {
		clearInterval(player.interval);
		delete player.interval;
		player.time = 0;
		player.playing = false;
		speak.say('Finished playing!')
		return;
		}
		if (config.segmented) {
		var secnotes = player.data[player.time];
		if (!secnotes) var secnotes = config.segmented === "testint" ? {} : [];
		} else var secnotes = player.data.filter(f => Math.floor(f.t / config.buffer.note) == player.time);
		//console.log(`NPS: ${secnotes.length}`)
		if (config.testint) {
		var notems = config.segmented === "testint" ? secnotes : {};
		if (config.segmented !== "testint") {
		secnotes.forEach(f => {
			var noteTime = f.t - (player.time * config.buffer.note);
			if (!notems[noteTime]) notems[noteTime] = [];
			notems[noteTime].push(f);
		});
		}
		//console.log(notems)
		Object.keys(notems).forEach(st => setTimeout(() => notems[st].forEach(f => {
			if (f.s == 1) {
				client.stopNote(f.n);
			} else client.startNote(f.n, f.v);
		}), st));
		} else {
		secnotes.forEach(f => {
		if (f.s == 1) {
		setTimeout(() => client.stopNote(f.n), f.t - (player.time * config.buffer.note))
		} else setTimeout(() => client.startNote(f.n, f.v), f.t - (player.time * config.buffer.note))
		})
		}
		player.time++
		}, config.buffer.note);
	player.playing = true;
}
player.load = (data) => {
player.stop();
var maxT = 0;
data.forEach(f => {
	if (f.t > maxT) maxT = f.t;
})
player.length = maxT / config.buffer.note;
if (config.segmented) {
player.data = [];
for (var i = 0; i < Math.floor(player.length + 1); i++) {
	player.data.push(config.segmented === "testint" ? {} : []);
}
data.forEach(f => {
	if (0 > f.t) return;
	if (config.segmented === "testint") {
		var section = Math.floor(f.t / config.buffer.note);
		if (!player.data[section][f.t % config.buffer.note]) player.data[section][f.t % config.buffer.note] = [];
		player.data[section][f.t % config.buffer.note].push(f);
	} else player.data[Math.floor(f.t / config.buffer.note)].push(f);
})
} else player.data = data
}
player.pause = () => {
	player.playing = false;
}
player.stop = () => {
if (!player.interval) return;
player.playing = false;
clearInterval(player.interval);
delete player.interval;
player.time = 0;
}

module.exports = player
