var { isMainThread, parentPort } = require("worker_threads");
if (isMainThread) {
    console.error("You are running the wrong file; run index.js!");
    process.exit();
}
globalThis.playerTime = 0;
globalThis.config = require('./config.json');
if (config.buffer === "same") config.buffer = require('./../config.json').buffer.size;
const fs = require('fs');
var notes = [];
var chunks = [];
var chunknum = 0;
var keys = ["a-1", "as-1", "b-1", "c0", "cs0", "d0", "ds0", "e0", "f0", "fs0", "g0", "gs0", "a0", "as0", "b0", "c1", "cs1", "d1", "ds1", "e1", "f1", "fs1", "g1", "gs1", "a1", "as1", "b1", "c2", "cs2", "d2", "ds2", "e2", "f2", "fs2", "g2", "gs2", "a2", "as2", "b2", "c3", "cs3", "d3", "ds3", "e3", "f3", "fs3", "g3", "gs3", "a3", "as3", "b3", "c4", "cs4", "d4", "ds4", "e4", "f4", "fs4", "g4", "gs4", "a4", "as4", "b4", "c5", "cs5", "d5", "ds5", "e5", "f5", "fs5", "g5", "gs5", "a5", "as5", "b5", "c6", "cs6", "d6", "ds6", "e6", "f6", "fs6", "g6", "gs6", "a6", "as6", "b6", "c7"];
const Player = new (require('./mp.js').Player)(evt => {
if (config.tempo && evt.name === "Set Tempo") Player.setTempo(evt.data);
if (!evt.name.startsWith('Note')) return;
if (config.nodrum && evt.channel === 10) return;
var key = keys[evt.noteNumber - 21];
var vel = evt.velocity / 127
if (vel == 0 && config.velsus) evt.name = "Note off"
//if (config.timing === "test") {
//	var time = ((60000 / Player.defaultTempo) / Player.division) * Player.tick;
//} else if (config.timing === "date") {
//	var time = Date.now() - start;
//} else if (config.timing === "player") {
	var time = playerTime
//}
if (!key) return;
if (evt.name === "Note on") {
	notes.push({n: key, v: vel, t: time});
} else {
	notes.push({n: key, t: time, s: 1});
}
	if (config.save && notes.length >= config.buffer) {
		fs.writeFileSync(`${config.output}${chunknum}`, JSON.stringify(notes));
		notes = [];
		chunks.push(`${chunknum}`)
		console.log(`Saved chunk ${chunknum}`);
		chunknum++
	}
})
Player.on('endOfFile', () => {
	var d = Date.now();
	process.stdout.write('\n');
	if (!config.save) {
	console.log('Done playing, saving Chunks.');
	for (var i = 0;;i++) {
		if (notes.length == 0) break;
		fs.writeFileSync(`${config.output}${i}`, JSON.stringify(notes.splice(0, config.buffer)));
		console.log(`Saved chunk ${i}`);
		chunks.push(`${i}`);
	}
	console.log(`Done saving ${chunks.length} chunks`);
	} else if (notes.length > 0) {
		fs.writeFileSync(`${config.output}${chunknum}`, JSON.stringify(notes));
		notes = [];
		chunks.push(`${chunknum}`);
		console.log(`Saved extra chunk ${chunknum}`)
	}
	fs.writeFileSync(`${config.output}main`, JSON.stringify(chunks));
	fs.writeFileSync(`${config.output}length`, playerTime.toString())
	console.log('Done.');
	delete Player.tracks
	process.exit();
})
setInterval(() => {
}, config.update)
parentPort.on('message', msg => {
	config.output = `midi/jobs/${msg}/`;
	Player.loadFile(config.output + 'file.mid');
	Player.play();
	start = Date.now();
	setInterval(() => parentPort.postMessage({m: "s", t: "p", a: Math.floor(Player.tick / Player.totalTicks * 100) + "%"}), config.update);
});
Player.on('loadUpdate', msg => parentPort.postMessage({m: "s", t: "l", a: msg}))
parentPort.postMessage({m: "ready"})
