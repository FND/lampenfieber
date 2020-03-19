/* global suite, test */
"use strict";

let txtParse = require("..");
let { readFile } = require("fs").promises;
let path = require("path");
let { deepStrictEqual: assertDeep } = require("assert");

suite("parsing");

let FIXTURE = path.resolve(__dirname, "sample.mdx");

test("plain text", () => {
	let content = "lorem ipsum";
	assertDeep(txtParse(content), ["lorem ipsum"]);

	content = "lorem ipsum\ndolor sit amet";
	assertDeep(txtParse(content), ["lorem ipsum\ndolor sit amet"]);

	// line endings normalized for internal simplicity
	content = "lorem\nipsum\rdolor\r\nsit\n\ramet";
	assertDeep(txtParse(content), ["lorem\nipsum\ndolor\nsit\n\namet"]);
});

test("blocks", () => {
	let content = `
\`\`\`
foo
bar
\`\`\`

dolor sit amet
	`.trim();
	let expected = [
		{
			type: null,
			params: {},
			content: "foo\nbar"
		},
		"\ndolor sit amet"
	];
	assertDeep(txtParse(content), expected);

	content = `
lorem ipsum

${content}
	`.trim();
	expected.unshift("lorem ipsum\n");
	assertDeep(txtParse(content), expected);
});

test("block parameters", () => {
	let content = `
\`\`\`list id=123 title="Hello World"
foo
bar
\`\`\`

dolor sit amet
	`.trim();
	let expected = [
		{
			type: "list",
			params: {
				id: 123,
				title: "Hello World"
			},
			content: "foo\nbar"
		},
		"\ndolor sit amet"
	];
	assertDeep(txtParse(content), expected);

	content = `
lorem ipsum

${content}
	`.trim();
	expected.unshift("lorem ipsum\n");
	assertDeep(txtParse(content), expected);
});

test("comprehensive composition", async () => {
	let content = await readFile(FIXTURE, "utf8");
	let segments = txtParse(content);
	assertDeep(segments, require("./sample_expected.js"));
});

test("custom delimiter", () => {
	let content = `
lorem ipsum

~list id=123
foo
bar
~

dolor sit amet
	`.trim();
	let expected = [
		"lorem ipsum\n",
		{
			type: "list",
			params: {
				id: 123
			},
			content: "foo\nbar"
		},
		"\ndolor sit amet"
	];
	assertDeep(txtParse(content, { delimiter: "~" }), expected);
});

test("README sample", () => {
	let content = `
lorem ipsum
dolor sit amet

\`\`\`formula caption="mass-energy equivalence"
E = mc^2
\`\`\`

consectetur adipisicing elit,
sed do eiusmod tempor

\`\`\`
…
\`\`\`
	`.trim();
	let expected = [
		"lorem ipsum\ndolor sit amet\n",
		{
			type: "formula",
			params: {
				caption: "mass-energy equivalence"
			},
			content: "E = mc^2"
		},
		"\nconsectetur adipisicing elit,\nsed do eiusmod tempor\n",
		{
			type: null,
			params: {},
			content: "…"
		}
	];
	assertDeep(txtParse(content), expected);
});
