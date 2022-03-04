module.exports = function (db, plate) {
	return new Promise((resolve, reject) => {
		db.get(
			"SELECT * FROM cars WHERE plate=$carPlate",
			{ $carPlate: plate },
			(err, row) => {
				if (err || row == undefined) {
					reject(new Error("Car plate wasn't found"))
				}
				resolve(row)
			}
		)
	})
}
