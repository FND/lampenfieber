"use strict";

let EventEmitter = require("events");
let fs = require("fs");
let readline = require("readline");

let SEP = "```";

module.exports = txtParse;

txtParse.sync = filepath => new Promise(resolve => {
	let segments = [];
	txtParse(filepath).on("segment", segment => {
		segments.push(segment);
	}).on("end", () => {
		resolve(segments);
	});
});

function txtParse(filepath) {
	let rl = readline.createInterface({
		input: fs.createReadStream(filepath),
		crlfDelay: Infinity
	});
	let emitter = new EventEmitter();

	let block;
	let lines = [];
	let report = () => {
		if(lines.length) {
			emitter.emit("segment", lines.join("\n"));
		}
	};
	rl.on("line", line => {
		if(block && line === SEP) { // end block
			block.content = lines.join("\n");
			emitter.emit("segment", block);
			block = false;
			lines = [];
			return;
		}

		if(!block && line.startsWith(SEP)) { // start block
			report();

			line = line.substr(SEP.length);
			block = parseBlockDeclaration(line);
			lines = [];
			return;
		}

		lines.push(line);
	});

	rl.on("close", () => {
		report();
		emitter.emit("end");
	});
	return emitter;
}

function parseBlockDeclaration(line) {
	let parts = line.split(" ");
	return {
		type: parts[0],
		params: parts.slice(1).reduce((memo, part) => {
			part = part.trim();
			let i = part.indexOf("=");
			if(i === -1) {
				memo[part] = true;
				return memo;
			}

			let key = part.substr(0, i);
			let value = part.substr(i + 1);
			memo[key] = isNaN(value) ? value : parseFloat(value);
			return memo;
		}, {})
	};
}
