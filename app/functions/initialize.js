const sqlite = require("sqlite3")
const path = require("path")
const fs = require("fs")

const ordersPath = path.join(__dirname, "..", "..", "storage", "orders")
const dbFolder = path.join(__dirname, "..", "..", "storage", "database")
const dbPath = path.join(
	__dirname,
	"..",
	"..",
	"storage",
	"database",
	"main.db"
)

module.exports = function () {
	fs.mkdir(dbFolder, (err) => {
		if (err && err.code != "EEXIST") throw err
	})
	fs.mkdir(ordersPath, (err) => {
		if (err && err.code != "EEXIST") throw err
	})

	let db = new sqlite.Database(dbPath)
	db.run(
		"CREATE TABLE IF NOT EXISTS cars (plate TEXT UNIQUE,color TEXT NOT NULL,brand TEXT NOT NULL,model TEXT NOT NULL,ownerName TEXT,ownerAddress TEXT,ownerDni TEXT,ownerRuc TEXT)"
	)

	return db
}
