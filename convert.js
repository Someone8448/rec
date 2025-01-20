var keys = ["a-1", "as-1", "b-1", "c0", "cs0", "d0", "ds0", "e0", "f0", "fs0", "g0", "gs0", "a0", "as0", "b0", "c1", "cs1", "d1", "ds1", "e1", "f1", "fs1", "g1", "gs1", "a1", "as1", "b1", "c2", "cs2", "d2", "ds2", "e2", "f2", "fs2", "g2", "gs2", "a2", "as2", "b2", "c3", "cs3", "d3", "ds3", "e3", "f3", "fs3", "g3", "gs3", "a3", "as3", "b3", "c4", "cs4", "d4", "ds4", "e4", "f4", "fs4", "g4", "gs4", "a4", "as4", "b4", "c5", "cs5", "d5", "ds5", "e5", "f5", "fs5", "g5", "gs5", "a5", "as5", "b5", "c6", "cs6", "d6", "ds6", "e6", "f6", "fs6", "g6", "gs6", "a6", "as6", "b6", "c7"];
var hex = (num, length) => {
	var h = Math.floor(Math.max(0, num)).toString(16);
	return ('0'.repeat(Math.max(length - h.length, 0))) + h
}
module.exports = data => {
	if (typeof data === "string") {
		var output = [];
		var i = 0;
		for (;;) {
			if (i >= data.length) break
			var obj = {};
			//console.log(parseInt(data.slice(i + 1, i + 3), 16))
			if (data[i] === "1") obj.s = 1;
			obj.n = keys[parseInt(data.slice(i + 1, i + 3), 16)];
			if (obj.s) {
				obj.t = parseInt(data.slice(i + 3, i + 11), 16);
			} else {
				obj.v = parseInt(data.slice(i + 3, i + 5), 16) / 255;
				obj.t = parseInt(data.slice(i + 5, i + 13), 16);
			}
			//console.log(obj)
			output.push(obj);
			i += (obj.s ? 11 : 13);
		}
		return output
	} else {
		var output = "";
		data.forEach(note => {
			if (note.s) {
				output += '1';
			} else output += '0';
			output += hex(keys.indexOf(note.n), 2);
			if (!note.s) output += hex(note.v * 255, 2);
			output += hex(note.t, 8)
		})
		return output;
	}
}
