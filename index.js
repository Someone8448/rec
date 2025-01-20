globalThis.log = require('./log.js');
globalThis.config = require('./config.json');
globalThis.fs = require('fs')
//globalThis.db = new (require('level').Level)(config.db);
globalThis.db = require('./db.js')
db.id = async () => {
try {
var id = Number(await db.get('id'));
if (isNaN(id)) throw new Error('');
} catch (error) {
var id = 1;
}
await db.put('id', id + 1);
return id.toString();
}
globalThis.commands = require('./commands.js');
commands.load()
globalThis.fun = require('./fun.js');
globalThis.midi = require('./midi/index.js');
globalThis.client = new (require(config.client))(config.uri, config.token);
client.start();
client.setChannel(config.room);
client.once('ch', () => client.sendArray([{m: "userset", set: config.set}]));
globalThis.speak = {}
speak.msgs = []
speak.say = function (ms) {
   // if (speak.interval) return msg.match(/.{0,511}/g).forEach(function(x, i) { if (x == "") return; if (i !== 0) x = "" + x; speak.msgs.push({m: "a", a: x})})
    eval(`ms.match(/.{0,${config.buffer.length}}/g)`).forEach(function(x, i) { if (x == "") return; if (i !== 0) x = "" + x; speak.msgs.push({m: "a", message: x})})
    if (speak.interval) return;
    log('bot', speak.msgs[0].message)
    client.sendArray([speak.msgs[0]])
    speak.msgs.splice(0,1)
    speak.interval = setInterval(() => {
        if (speak.msgs.length == 0) { clearInterval(speak.interval); delete speak.interval; return;}
	log('bot', speak.msgs[0].message)
        client.sendArray([speak.msgs[0]])
        speak.msgs.splice(0,1)

    }, config.buffer.chat)
}
client.on('a', async msg => {
if (msg.p._id === client.getOwnParticipant()._id) return;
var mArray = msg.a.replace(/\s+/g, ' ').trim().split(' ');
if (!mArray[0].toLowerCase().startsWith(config.prefix)) return;
var commandData = commands.get(mArray[0].slice(config.prefix.length).toLowerCase());
if (!commandData) return;
try {
await commandData.run(msg, mArray.slice(1));
} catch (error) {
speak.say(`There was an internal error.`)
log('error', error)
}
})
if (config.console) {
var readline = require('readline');
var rl = new readline.Interface({input: process.stdin, output: process.stdout, prompt: ""});
rl.on('line', async msg => {
	var mArray = msg.replace(/\s+/g, ' ').trim().split(' ');
	if (!mArray[0].toLowerCase().startsWith(config.prefix)) return speak.say(`Console: ${msg}`);
	var commandData = commands.get(mArray[0].slice(config.prefix.length).toLowerCase());
	if (!commandData) return speak.say(`Console: ${msg}`);
	try {
		await commandData.run({m: "a", a: msg, p: {_id: "console", name: "Console", id: "console", color: "#888888"}, t: Date.now()}, mArray.slice(1), true);
	} catch (error) {
		speak.say(`There was an internal error.`);
		log('error', error)
	}
})
}
globalThis.rec = []
globalThis.player = require('./player.js')
client.on('n', n => {
if (!rec.filter(a => a.users.includes(n.p))) return;
if (config.deviate && ((n.t - client.serverTimeOffset) > Date.now() + config.deviate || Date.now() - config.deviate > (n.t - client.serverTimeOffset) || isNaN(n.t))) n.t = Date.now();
n.n.forEach(note => {
if (note.d === undefined) note.d = 0
rec.filter(a => a.users.includes(n.p)).forEach(a => a.notes.push({n: note.n, t: (n.t ? n.t : Date.now()) - (a.t - note.d), v: note.v, s: note.s}));
})
})
globalThis.convert = require('./convert.js')
setInterval(() => {
        if (!client.channel || client.channel._id !== config.room) client.setChannel(config.room)
}, 10000)
//console.log = speak.say
if (config.filter) {
        //var oldpress = MPP.press; MPP.press = (n, v) => {if (v < ((MPP.noteQuota.points / MPP.noteQuota.max) * -1) + 1) return; oldpress(n, v)};
        var synthfilter = {};
	if (config.filter.nps) {
		synthfilter.nps = {t: fun.nps(), f: fun.nps(), l: 0}
		synthfilter.nps.c = () => {
			var date = Date.now()
			if (date - synthfilter.nps.l <= 1000) return;
			log('nps', `TOTAL: ${synthfilter.nps.t.get().toLocaleString()} | FILTERED: ${synthfilter.nps.f.get().toLocaleString()}`);
			synthfilter.nps.l = date;
		}
	}
	if (config.filter.multi && typeof config.filter.multi.count === "number") {
		if (!config.filter.multi.tokens) config.filter.multi.tokens = new Array(config.filter.multi.count).fill('');
		config.filter.multi.tokens.sort();
		if (!config.filter.multi.names) {
			config.filter.multi.names = [];
			for (var i = 0; i < config.filter.multi.count; i++) config.filter.multi.names.push(`Note Recorder Player #${i+1}`);
		};
		if (!config.filter.multi.colors) config.filter.multi.colors = ["#ff0000", "#00ff00", "#0000ff"];
		synthfilter.keys = ["a-1", "as-1", "b-1", "c0", "cs0", "d0", "ds0", "e0", "f0", "fs0", "g0", "gs0", "a0", "as0", "b0", "c1", "cs1", "d1", "ds1", "e1", "f1", "fs1", "g1", "gs1", "a1", "as1", "b1", "c2", "cs2", "d2", "ds2", "e2", "f2", "fs2", "g2", "gs2", "a2", "as2", "b2", "c3", "cs3", "d3", "ds3", "e3", "f3", "fs3", "g3", "gs3", "a3", "as3", "b3", "c4", "cs4", "d4", "ds4", "e4", "f4", "fs4", "g4", "gs4", "a4", "as4", "b4", "c5", "cs5", "d5", "ds5", "e5", "f5", "fs5", "g5", "gs5", "a5", "as5", "b5", "c6", "cs6", "d6", "ds6", "e6", "f6", "fs6", "g6", "gs6", "a6", "as6", "b6", "c7"];
		synthfilter.m = {i: -1, c: []};
		synthfilter.m.get = () => {
			synthfilter.m.i = (synthfilter.m.i + 1) % synthfilter.m.c.length;
			return synthfilter.m.i;
		}
		var ClFun = require(config.client);
		Array(config.filter.multi.count).fill().forEach((notneeded, i) => {
			var cl = new ClFun(config.uri, config.filter.multi.tokens[i]);
			cl.on('hi', () => cl.sendArray([{m: "sub", t: false, a: "n"}, {m: "sub", t: false, a: "a"}, {m: "userset", set: {name: config.filter.multi.names[i] || "no name note recorder", color: config.filter.multi.colors[i % config.filter.multi.colors.length]}}]));
			cl.start();
			cl.setChannel(config.room);
			synthfilter.m.c.push(cl);
		});
		if (config.filter.multi.userkey) {
		synthfilter.m.key = {};
		synthfilter.keys.forEach((a, i) => {synthfilter.m.key[a] = Math.floor(i / (synthfilter.keys.length / synthfilter.m.c.length))});
		}
	}
        synthfilter.q = require('./quota.js')[config.filter.quota](config.filter.args[0], config.filter.args[1], config.filter.args[2]);
        synthfilter.t = vel => {
                var avail = vel >= ((synthfilter.q.points / synthfilter.q.max) * -1) + 1;
                if (!avail) return false;
                synthfilter.q.spend(1);
                return true;
        };
	if (config.filter.check) synthfilter.c = {};
	client._startNote = client.startNote;
	client._stopNote = client.stopNote;
	client.startNote = (n, v) => {
		if (synthfilter.nps) {
			synthfilter.nps.t.put();
			synthfilter.nps.c();
		}
		if (!synthfilter.q.try()) return;
		if (config.filter.deblack && !synthfilter.t(v)) return;
		if (synthfilter.m) {
			synthfilter.m.c[config.filter.multi.userkey ? synthfilter.m.key[n] : synthfilter.m.get()].startNote(n, v);
		} else client._startNote(n, v);
		if (synthfilter.c) synthfilter.c[n] = true;
		if (!config.filter.deblack) synthfilter.q.spend(1);
		if (synthfilter.nps) synthfilter.nps.f.put();
	};
	client.stopNote = (n) => {
		if (synthfilter.nps) {
			synthfilter.nps.t.put();
			synthfilter.nps.c();
		}
		if (config.filter.sustain || (synthfilter.c && synthfilter.c[n]) || !synthfilter.q.try()) return;
		if (synthfilter.m) {
			synthfilter.m.c[config.filter.multi.userkey ? synthfilter.m.key[n] : synthfilter.m.get()].stopNote(n);
		} else client._stopNote(n);
		delete synthfilter.c[n]
		synthfilter.q.spend(1);
		if (synthfilter.nps) synthfilter.nps.f.put();
	}
}
