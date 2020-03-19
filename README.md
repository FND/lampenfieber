Lampenfieber
============

text parser for parameterized content blocks within text files

    lorem ipsum
    dolor sit amet

    ```formula caption="mass-energy equivalence"
    E = mc^2
    ```

    consectetur adipisicing elit,
    sed do eiusmod tempor

    ```
    …
    ```

parsing the above results in a list of segments, each either a string (default)
or a `{ type, params, content }` object (fenced blocks):

```javascript
[
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
]
```

each segment can then be processed separately, e.g. rendering via different
markup languages


Getting Started
---------------

*   `npm install lampenfieber`
*   usage:

    ```javascript
    let txtParse = require("lampenfieber");

    let segments = txtParse("…", { delimiter: "~~~" });
    ```


Contributing
------------

* ensure [Node](https://nodejs.org) is installed
* `npm install` downloads dependencies
* `npm test` runs the test suite and checks code for stylistic consistency


Release Process
---------------

NB: version numbers are incremented in accordance with
    [semantic versioning](https://semver.org)

1. update version number in `package.json`
2. commit as "v#.#.#"

        $ git commit -m "v`node -p -e 'require("./package.json").version'`"

    the commit description should also include a rationale, e.g. why a major
    version was required, and a list of significant changes

3. `./release` publishes the new version


License
-------

Lampenfieber is licensed under the Apache 2.0 License.
