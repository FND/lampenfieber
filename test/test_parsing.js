/* global suite, test */
"use strict";

let txtParse = require("..");
let path = require("path");
let { deepStrictEqual: assertDeep } = require("assert");

suite("parsing");

let FIXTURE = path.resolve(__dirname, "sample.mdx");
let EXPECTED = [
	"lorem ipsum\ndolor sit amet\n",
	{
		type: "javascript",
		params: {},
		content: "function Card() {\n    // …\n}"
	},
	"\nconsectetur adipisicing elit, sed do eiusmod tempor\n" +
			"incididunt ut labore et dolore magna aliqua\n\n" +
			"* foo\n* bar\n* baz\n",
	{
		type: "jsx",
		params: {
			pragma: "createElement",
			max: 9,
			fancy: true
		},
		content: "<Card>\n    <p>hello world</p>\n</Card>"
	},
	"\nut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
];

test("emitter", done => {
	let segments = [];
	txtParse(FIXTURE).on("segment", segment => {
		segments.push(segment);
	}).on("end", () => {
		assertDeep(segments, EXPECTED);
		done();
	});
});

test("convenience wrapper", () => {
	return txtParse.sync(FIXTURE).
		then(segments => {
			assertDeep(segments, EXPECTED);
		});
});
