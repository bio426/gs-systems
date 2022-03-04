const path = require("path")
const fs = require("fs")

const ORDERS_PATH = path.join(__dirname, "..", "..", "storage", "orders")

module.exports = function (fileName) {
	let filePath = path.join(ORDERS_PATH,fileName)
	return new Promise((resolve, reject) => {
		fs.rm(filePath, (err) => {
			if (err) reject(err)
			resolve(filePath)
		})
	})
}
