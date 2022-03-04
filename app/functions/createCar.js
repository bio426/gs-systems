module.exports = function (db, car) {
	let query = db.prepare(
		"INSERT INTO cars (plate,color,brand,model,ownerName,ownerAddress,ownerDni,ownerRuc) VALUES ($plate,$color,$brand,$model,$ownerName,$ownerAddress,$ownerDni,$ownerRuc)"
	)

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
		query.run(
			{
				$plate: car.plate.toLowerCase(),
				$color: car.color,
				$brand: car.brand,
				$model: car.model,
				$ownerName: car.ownerName,
				$ownerAddress: car.ownerAddress,
				$ownerDni: car.ownerDni,
				$ownerRuc: car.ownerRuc,
			},
			(err) => {
				if (err) reject(err)
				resolve({ created: car })
			}
		)
	})
}
