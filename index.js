"use strict";

let DELIMITER = "```";
let TOKEN = `~~${Math.random().toString().substr(2)}~~`;
let TOKEN_PATTERN = new RegExp(TOKEN, "g");

// `iblocks` (optional) is an empty, mutable object for mapping inline-block
// placeholders to the corresponding block; if provided, inline blocks within
// default segments (i.e. not supported within fenced blocks) are replaced with
// those placeholders and need to be restored in post-processing
module.exports = function txtParse(content,
		{ delimiter = DELIMITER, iblocks, _iblockToken } = {}) {
	if(iblocks && !_iblockToken) {
		_iblockToken = uniqueID(content);
	}

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
		if(currentBlock) {
			if(line === delimiter) { // end of block
				conclude(currentBlock);
				return;
			}
		} else if(line.startsWith(delimiter)) { // start of block
			if(iblocks && line.endsWith(delimiter)) { // inline block
				let placeholder = parseInlineBlock(line, delimiter, iblocks,
						_iblockToken);
				buffer.push(placeholder);
				return;
			}
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

function parseInlineBlock(line, delimiter, memo, token) {
	// strip delimiters
	let len = delimiter.length;
	line = line.substr(0, line.length - len).substr(len);
	// split block declaration from content
	let i = line.indexOf(" "); // XXX: crude
	let declaration = line.substr(0, i);
	let iblock = parseBlockDeclaration(declaration, delimiter);
	iblock.content = line.substr(i + 1);
	// map generated placeholder to block
	let id = Object.keys(memo).length + 1;
	id = `${token}:${id}`;
	memo[id] = iblock;
	return id;
}

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

// generates an ID which does not already occur within given string
function uniqueID(text, attempts = 0) {
	if(attempts === 10) {
		throw new Error("failed to generate unique ID");
	}
	let id = Math.random().toString().substr(2);
	id = parseInt(id, 10).toString(36);
	return text.indexOf(id) === -1 ? id : uniqueID(text, attempts + 1);
}
