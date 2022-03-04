module.exports = function (db, car) {
	return new Promise((resolve, reject) => {
		if (
			!car.plate ||
			!car.color ||
			!car.brand ||
			!car.model ||
			!car.ownerName ||
			!car.ownerAddress ||
			!car.ownerDni ||
			!car.ownerRuc
		) {
			return reject(new Error("Uncompleted field to create car"))
		}
		if (db.has(car.plate.toUpperCase())) {
			return reject(new Error("Car already exist in register"))
		}
		db.set(car.plate.toUpperCase(), car)
		resolve({ created: car })
	})
}
