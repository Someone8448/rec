module.exports.run = async (msg, args, fConsole) => {
	if (args.length == 0) return speak.say(`Usage: ${config.prefix}search <Page Number> <Term>`)
	var num = isNaN(Number(args[0])) ? 0 : Number(args[0]);
	var item = (isNaN(Number(args[0])) ? args.join(' ') : args.slice(1).join(' ')).normalize('NFKD').toLowerCase();
	console.log(item)
	var maxPage = config.page || 5;
	var id = await db.get('id');
	var found = [];
	var start = Date.now()
	for (var i = 1; i < Number(id); i++) {
		if (found.length >= (num+1)*maxPage) break;
		try {
			var recdata = await db.get(i.toString()).then(a => JSON.parse(a));
			if (recdata.id.normalize('NFKD').toLowerCase().includes(item) || !!recdata.users.find(b => b.normalize('NFKD').toLowerCase().includes(item))) found.push(`${i} - ${recdata.id}: \`${recdata.users.join(', ')}\``)
		} catch (error) {}
	}
	var end = Date.now();
	var spent = end - start;
	if (found.length == 0) return speak.say(`None found in ${spent}ms.`);
	speak.say(`\`Page: ${num}\` | ${found.slice(maxPage * num, (maxPage * num)+maxPage).join('; ')} | \`Showing max ${maxPage}.\` | \`Completed in ${spent}ms\``)
}
module.exports.name = "search"
module.exports.aliases = ["find"]
