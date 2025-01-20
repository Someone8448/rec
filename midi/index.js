var fs = require('fs');
var add = require('./../add.js');
var statusType = {w: "Waiting", l: "Loading", p: "Playing"};
var { DownloaderHelper } = require('node-downloader-helper');
const { Worker } = require("worker_threads");
/*
fs.readdirSync('midi/jobs').forEach(a => {
	fs.readdirSync(`midi/jobs/${a}`).forEach(b => fs.rmSync(`midi/jobs/${a}/${b}`));
	fs.rmdirSync(`midi/jobs/${a}`)
});
*/
//log('init', 'Deleted MIDI Cache.');

module.exports.jobs = {};
module.exports.statusTypes = statusType;
module.exports.create = async (id, type, midi, name) => {
	var uuid = crypto.randomUUID();
	module.exports.jobs[uuid] = {id: id, uuid: uuid, name: name, s: {t: "w", a: "..."}};
	module.exports.jobs[uuid].getStatus = () => `${uuid} ${statusType[module.exports.jobs[uuid].s.t]} ${module.exports.jobs[uuid].s.a}`
	fs.mkdirSync(`midi/jobs/${uuid}`);
	if (type === "path") {
		module.exports.jobs[uuid].midi = midi.split('/').reverse()[0];
		fs.copyFileSync(midi, `midi/jobs/${uuid}/file.mid`);
	} else if (type === "url") {
		if (!(new URL(midi)).pathname.endsWith('.mid')) return uuid || speak.say('Incorrect file type.');
		var download = await (() => new Promise(async (resolve, reject) => {
			var downloader = new DownloaderHelper(midi, `midi/jobs/${uuid}/`);
			downloader.on('end', file => resolve(file.fileName));
			downloader.on('error', () => resolve());
			await downloader.start().catch(() => resolve());
		}))()
		if (!download) return uuid;
		module.exports.jobs[uuid].midi = download;
		fs.renameSync(`midi/jobs/${uuid}/${download}`, `midi/jobs/${uuid}/file.mid`);
	} else return uuid;
		fs.writeFileSync(`midi/jobs/${uuid}/recovery`, JSON.stringify(module.exports.jobs[uuid]));
		module.exports.jobs[uuid].worker = new Worker('./midi/worker.js');
		module.exports.jobs[uuid].worker.on('message', msg => {
			if (msg.m === "ready") {
				module.exports.jobs[uuid].worker.postMessage(uuid);
			} else if (msg.m === "s") {
				module.exports.jobs[uuid].s.t = msg.t;
				module.exports.jobs[uuid].s.a = msg.a;
				log('status', module.exports.jobs[uuid].getStatus());
			}
		});
		module.exports.jobs[uuid].worker.on('error', () => {});
		module.exports.jobs[uuid].worker.on('exit', async () => {
			//await fun.sleep(1000);
			try {
				var recid = await add(uuid);
				speak.say(`\`${uuid}\` - Success. ID: ${recid}`);
			} catch (error) {
				speak.say(`\`${uuid}\` - Failed.`);
				log('error', error)
			}
			delete module.exports.jobs[uuid];
			fs.readdirSync(`midi/jobs/${uuid}`).forEach(a => fs.rmSync(`midi/jobs/${uuid}/${a}`));
			fs.rmdirSync(`midi/jobs/${uuid}`);
		});
		return module.exports.jobs[uuid];
}

(async () => {
	var dir = fs.readdirSync('midi/jobs');
	if (dir.length == 0) return log('recover', 'No recovery jobs');
	log('recover', `Found ${dir.length} lost jobs... recovering.`);
	for (var i = 0; i < dir.length; i++) {
		var uuid = dir[i]
		try {
			module.exports.jobs[uuid] = JSON.parse(fs.readFileSync(`midi/jobs/${uuid}/recovery`, 'utf8'))
			log('recover', `Beginning recovery job ${i} - ${uuid}`);
			try {
				var recid = await add(uuid);
				speak.say(`Recovery \`${uuid}\` - Success. ID: ${recid}`);
			} catch (err) {
				speak.say(`Recovery \`${uuid}\` - Failed.`);
				log('error', err)

			}
		} catch (error) {
			log('recover', `Could not recover job ${i} - ${uuid}`);
			log('error', error)
		}
			delete module.exports.jobs[uuid];
			fs.readdirSync(`midi/jobs/${uuid}`).forEach(a => fs.rmSync(`midi/jobs/${uuid}/${a}`));
			fs.rmdirSync(`midi/jobs/${uuid}`);
			log('recover', `Deleted ${i} - ${uuid}`)
	}
})()
