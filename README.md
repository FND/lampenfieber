Lampenfieber
============

text parser for parameterized content blocks within text files

    lorem ipsum
    dolor sit amet

    ```formula caption="mass-energy equivalence"
    E = mc^2
    ```

    consectetur adipisicing elit, sed do eiusmod tempor
    incididunt ut labore et dolore magna aliqua

parsing that results in three `{ type, params, content }` objects:

```javascript
[{
    type: null,
    params: {},
    content: "lorem ipsum\ndolor sit amet"
}, {
    type: "formula",
    params: {
        caption: "mass-energy equivalence"
    },
    content: "E = mc^2"
}, {
    …
}]
```

each block can then be processed separately, e.g. rendering via different markup
languages


Getting Started
---------------

*   `npm install lampenfieber`
*   usage:

    ```javascript
    let txtParse = require("lampenfieber");

    let blocks = txtParse("…", { delimiter: "~~~" });
    ```


Contributing
------------

* ensure [Node](http://nodejs.org) is installed
* `npm install` downloads dependencies
* `npm test` runs the test suite and checks code for stylistic consistency
