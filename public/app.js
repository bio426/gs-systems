import { createApp } from "https://unpkg.com/petite-vue?module"

createApp({
	pdfPath: "",
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
		quantity: "",
		description: "",
		price: "",
		total: "",
	},
	files: [],
	addProduct() {
		let product = {
			code: this.newProd.code,
			quantity: this.newProd.quantity,
			description: this.newProd.description,
			price: this.newProd.price,
			total: this.newProd.total,
		}
		this.products.push(product)

		this.newProd.code = ""
		this.newProd.quantity = ""
		this.newProd.description = ""
		this.newProd.price = ""
		this.newProd.total = ""
	},
	deleteProduct(index) {
		this.products.splice(index, 1)
	},
	deleteAllProducts() {
		this.products = []
	},
	async generateDocument() {
		let rawProducts = JSON.parse(JSON.stringify(this.products))
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
		}

		let documentPath = await window.api.genOrder(data)
		this.pdfPath = documentPath
	},
	async getBaseFile() {
		let basePdf = await window.api.getBaseFile()
		this.pdfPath = basePdf
	},
	onMounted() {
		this.getBaseFile()
	},
}).mount()
