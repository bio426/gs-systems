import { createApp } from "https://unpkg.com/petite-vue?module"

const basePdf = new URL("base.pdf", import.meta.url)

function DocumentGenerator(props) {
	return {
		pdfPath: basePdf.href,
		clientName: "",
		clientAddress: "",
		clientDni: "",
		clientRuc: "",
		carBrand: "",
		carModel: "",
		carColor: "",
		carPlate: "",
		carMileage: "",
		products: [],
		observation: "",
		newProd: {
			code: "",
			quantity: 1,
			description: "",
			price: null,
		},
		addProduct() {
			let product = {
				code: this.newProd.code,
				quantity: this.newProd.quantity,
				description: this.newProd.description,
				price: this.newProd.price,
				total: this.newProd.quantity * this.newProd.price,
			}
			this.products.push(product)

			this.newProd.code = ""
			this.newProd.quantity = 1
			this.newProd.description = ""
			this.newProd.price = null
		},
		deleteProduct(index) {
			this.products.splice(index, 1)
		},
		deleteAllProducts() {
			this.products = []

			this.newProd.code = ""
			this.newProd.quantity = 1
			this.newProd.description = ""
			this.newProd.price = null
		},
		clearFields() {
			this.clientName = ""
			this.clientAddress = ""
			this.clientDni = ""
			this.clientRuc = ""
			this.carBrand = ""
			this.carModel = ""
			this.carColor = ""
			this.carPlate = ""
			this.carMileage = ""
			this.observation = ""
		},
		deleteAll() {
			this.clearFields()
			this.deleteAllProducts()
		},
		async generateDocument() {
			let rawProducts = JSON.parse(JSON.stringify(this.products))
			let totalPrice = 0
			rawProducts.forEach((prod) => {
				let price = prod.quantity * prod.price
				totalPrice += price
			})
			let data = {
				clientName: this.clientName,
				clientAddress: this.clientAddress,
				clientDni: this.clientDni,
				clientRuc: this.clientRuc,
				carBrand: this.carBrand,
				carModel: this.carModel,
				carColor: this.carColor,
				carPlate: this.carPlate,
				carMileage: this.carMileage,
				products: rawProducts,
				observation: this.observation,
				subTotal: totalPrice.toFixed(2),
				total: totalPrice.toFixed(2),
			}

			let documentPath = await window.api.genOrder(data)
			this.pdfPath = documentPath

			this.clearFields()
			this.deleteAllProducts()
		},
		async getCarData() {
			try {
				let carData = await window.api.findCar(this.carPlate)
				if (carData == undefined) {
					throw new Error("No se encontro registros de la placa")
				}
				this.carBrand = carData.brand
				this.carModel = carData.model
				this.carColor = carData.color
				this.clientName = carData.ownerName
				this.clientAddress = carData.ownerAddress
				this.clientDni = carData.ownerDni
				this.clientRuc = carData.ownerRuc
			} catch (error) {
				console.log(error)
				// alert("No se encontro la placa en los registros")
			}
		},
		onMounted() {},
	}
}

function FileManager(props) {
	return {
		pdfPath: basePdf.href,
		filterInput: "",
		files: [],
		async getFiles() {
			let filePaths = await window.api.getFiles()
			let list = []
			filePaths.map((path) => {
				let nameStart = path.lastIndexOf("_") - 8
				let name = path.substring(nameStart, path.length)
				list.push({
					name,
					path,
				})
			})
			this.files = list
			this.filterInput = ""
		},
		async deleteFile(fileName) {
			await window.api.deleteFile(fileName)
			this.pdfPath = basePdf.href
			this.getFiles()
		},
		async showFile(filePath) {
			this.pdfPath = filePath
		},
		filterFiles() {
			this.files = this.files.filter((file) =>
				file.name.includes(this.filterInput)
			)
		},
		onMounted() {
			this.getFiles()
		},
	}
}

createApp({
	DocumentGenerator,
	FileManager,
}).mount()
