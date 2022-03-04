const JSONdb = require("simple-json-db")
const path = require("path")

const jsonPath = path.join(__dirname, "..", "storage", "database", "data.json")

const db = new JSONdb(jsonPath, { jsonSpaces: 2 })

db.set("plate-num", {
	foo: 3,
	bar: "text",
	baz: [true, false],
	qux: {
		name: "jhon",
	},
})
