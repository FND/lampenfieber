module.exports = [
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
	"\nut enim ad minim veniam, quis nostrud exercitation ullamco laboris\n",
	{
		type: null,
		params: {},
		content: "…"
	},
	""
];
