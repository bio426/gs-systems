const JSONdb = require("simple-json-db")
const path = require("path")
const fs = require("fs")

const ordersPath = path.join(__dirname, "..", "..", "storage", "orders")
const dbFolder = path.join(__dirname, "..", "..", "storage", "database")
const dbPath = path.join(dbFolder, "data.json")

module.exports = function () {
	fs.mkdir(dbFolder, (err) => {
		if (err && err.code != "EEXIST") throw err
	})
	fs.mkdir(ordersPath, (err) => {
		if (err && err.code != "EEXIST") throw err
	})

	const db = new JSONdb(dbPath, { jsonSpaces: 2 })
	return db
}
