module.exports = function (db, plate) {
	return new Promise((resolve, reject) => {
		let res = db.get(plate.toUpperCase())
		if (res == undefined) {
			return reject(new Error("Car plate wasn't found"))
		}
		resolve(res)
	})
}
