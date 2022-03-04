const { initialize, createCar } = require("../app/functions/index")

const db = initialize()

createCar(db, {
	plate: "TEST-322",
	color: "blanco",
	model: "nissan",
	// brand: "cargo",
	ownerName: "jhon",
	ownerAddress: "av mexico",
	ownerDni: "12332112",
	ownerRuc: "001012332112",
})
	.then((res) => {
		console.log(res)
	})
	.catch((err) => {
    console.error(err)
  })
