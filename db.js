if (config.files) {
	var fs = require('fs');
	var path = require('path');
	var allowed = '1234567890-_qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM '.split('');
	module.exports.get = async (ID) => {
		var name = ID.split('').filter(a => allowed.includes(a)).join('');
		if (name.length == 0) return;
		var file = await fs.promises.readFile(path.join(config.db, name), 'utf8');
		return file;
	};
	module.exports.put = async (ID, data) => {
		var name = ID.split('').filter(a => allowed.includes(a)).join('');
		if (name.length == 0) return;
		if (data === undefined) return;
		await fs.promises.writeFile(path.join(config.db, name), (['object', 'number'].includes(typeof data) ? data.toString() : data));
		return;
	}
	module.exports.del = async (ID) => {
		try {
			var name = ID.split('').filter(a => allowed.includes(a)).join('');
			if (name.length == 0) return;
			await fs.promises.rm(path.join(config.db, name));
		} catch (error) {
			//a
		}
		return;
	}
	module.exports.clear = async (nosync) => {
		if (!nosync) {
			var dir = fs.readdirSync(config.db);
			for (var i = 0; i < dir.length; i++) {
				fs.rmSync(path.join(config.db, dir[i]));
			}
		} else {
			var dir = await fs.promises.readir(config.db);
			for (var i = 0; i < dir.length; i++) {
				fs.promises.rm(path.join(config.db, dir[i]));
			}
		}
	}
} else module.exports = new (require('level').Level)(config.db);
