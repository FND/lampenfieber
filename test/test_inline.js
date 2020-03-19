/* global suite, test */
"use strict";

let txtParse = require("..");
let { readFile } = require("fs").promises;
let path = require("path");
let { deepStrictEqual: assertDeep } = require("assert");

let FIXTURE = path.resolve(__dirname, "inline.mdx");

suite("inline blocks");

test("inline blocks", async () => {
	let content = await readFile(FIXTURE, "utf8");
	let memo = {};
	let segments = txtParse(content, {
		iblocks: memo,
		_iblockToken: "@iblock@"
	});
	let expected = [`
lorem ipsum
dolor sit amet

consectetur adipisicing elit,
@iblock@:1
sed do eiusmod tempor
@iblock@:2
incididunt ut labore et dolore magna aliqua

@iblock@:3
	`.trim() + "\n"];
	assertDeep(segments, expected);
	assertDeep(memo, {
		"@iblock@:1": {
			type: "jsx",
			params: {},
			content: "<Footnote numbered>disclaimer: IANA*</Footnote>"
		},
		"@iblock@:2": {
			type: null,
			params: {},
			content: "<Footnote>¯\\_(ツ)_/¯</Footnote>"
		},
		"@iblock@:3": {
			type: null,
			params: {},
			content: "<Footnote>…</Footnote>"
		}
	});
});
