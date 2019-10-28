"use strict";

let DELIMITER = "```";
let TOKEN = `~~${Math.random().toString().substr(2)}~~`;
let TOKEN_PATTERN = new RegExp(TOKEN, "g");

module.exports = function txtParse(content, { delimiter = DELIMITER } = {}) {
	if(!content.pop) {
		content = content.split(/\r?\n|\r/);
	}

	let segments = [];
	let currentBlock;
	let buffer = [];
	let conclude = block => {
		if(block) {
			currentBlock.content = buffer.join("\n");
			segments.push(block);
		} else if(buffer.length) { // plain text
			segments.push(buffer.join("\n"));
		}
		buffer = [];
		currentBlock = null;
	};
	content.forEach(line => {
		if(currentBlock && line === delimiter) { // end of block
			conclude(currentBlock);
			return;
		}
		if(!currentBlock && line.startsWith(delimiter)) { // start of block
			conclude();

			line = line.substr(delimiter.length);
			currentBlock = parseBlockDeclaration(line);
			return;
		}
		buffer.push(line);
	});
	conclude();
	return segments;
};

function parseBlockDeclaration(line) {
	// replace spaces in quoted values before splitting, discarding quotation marks
	let parts = line.replace(/(="[^"]*")/g, match => {
		let str = match.replace(/ /g, TOKEN);
		return str.substr(0, 1) + str.substr(2, str.length - 3);
	}).split(" ").map(part => part.replace(TOKEN_PATTERN, " "));

	return {
		type: parts[0] || null,
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
