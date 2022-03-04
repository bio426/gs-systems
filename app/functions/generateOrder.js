const pdfkit = require("pdfkit")
const path = require("path")
const fs = require("fs")

const RUC = "10092915447"
const ordersPath = path.join(__dirname, "..", "..", "storage", "orders")

function getFormatedDate() {
	let today = new Date()
	return `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
}

function generateOrderDestination(carPlate) {
	let today = new Date()
	let day = today.getDate()
	if (day < 10) {
		day = "0" + day.toString()
	} else {
		day = day.toString()
	}
	let month = today.getMonth() + 1
	if (month < 10) {
		month = "0" + month.toString()
	} else {
		month = month.toString()
	}
	let fileDate = `${day}${month}${today.getFullYear()}`

	return path.join(ordersPath, `${fileDate}_${carPlate}.pdf`)
}

function writeProducts(doc, products) {
	doc.fontSize(10)
	const firstRow = 310
	const maxDescriptionWidth = 270
	let lastHeight = 0
	if (products == undefined) products = []
	products.forEach((product) => {
		let yPos = firstRow + lastHeight
		let descriptionHeight = doc.heightOfString(product.description, {
			width: maxDescriptionWidth,
		})
		lastHeight += descriptionHeight + 5

		doc.text(product.code, 20, yPos)
		doc.text(product.quantity, 85, yPos)
		doc.text(product.description, 165, yPos, { width: maxDescriptionWidth })
		doc.text(product.price, 440, yPos)
		doc.text(product.total, 525, yPos)
	})
	doc.fontSize(12)
}

const orderDataDefaults = {
	id: "A000-000000",
	clientName: "",
	clientAddress: "",
	clientRuc: "",
	clientDni: "",
	date: "00-00-0000",
	carBrand: "",
	carModel: "",
	carColor: "",
	carPlate: "AAA-000",
	carMileage: "0",
	products: [],
	subTotal: "00.00",
	igv: "00.00",
	total: "00.00",
	observation: "",
}

module.exports = function (orderData) {
	// Set defaul orderData values
	let data = { ...orderDataDefaults, date: getFormatedDate() }
	Object.assign(data, orderData)

	// Initialize pdf writing
	let doc = new pdfkit({ autoFirstPage: false })
	doc.addPage({ size: "A4", margin: 0 })

	let template = path.join(ordersPath, "..", "A4-v3.png")
	doc.image(template, 0, 0, { scale: 0.5 })

	doc.text(RUC, 480, 30)
	doc.font("Helvetica-Bold")
	// doc.text(this.type.toUpperCase(), 432, 55, { width: 140, align: "center" })
	doc.text("ORDEN DE TRABAJO", 432, 55, { width: 140, align: "center" })
	doc.font("Helvetica")
	doc.text(data.id.toUpperCase(), 460, 95)
	if (data.clientName.length > 25) {
		doc.fontSize(10)
		doc.text(data.clientName.toUpperCase(), 90, 145, {
			width: 205,
			height: 25,
		})
		doc.fontSize(12)
	} else {
		doc.text(data.clientName.toUpperCase(), 90, 150)
	}

	if (data.clientAddress.length > 24) {
		doc.fontSize(10)
		doc.text(data.clientAddress.toUpperCase(), 100, 165, {
			width: 190,
			height: 25,
		})
		doc.fontSize(12)
	} else {
		doc.text(data.clientAddress.toUpperCase(), 100, 170)
	}

	doc.text(data.clientDni.toUpperCase(), 63, 190)
	doc.text(data.clientRuc.toUpperCase(), 65, 210)
	doc.text(data.date.toUpperCase(), 125, 230)
	doc.text(data.carBrand.toUpperCase(), 350, 150)
	doc.text(data.carModel.toUpperCase(), 360, 170)
	doc.text(data.carColor.toUpperCase(), 350, 190)
	doc.text(data.carPlate.toUpperCase(), 350, 210)
	doc.text(data.carMileage.toUpperCase().concat(" KM"), 390, 230)
	writeProducts(doc, data.products)
	doc.text("S/. " + data.subTotal, 500, 680)
	doc.text("S/. " + data.igv, 500, 700)
	doc.text("S/. " + data.total, 500, 760)
	doc.fontSize(10)
	doc.text(data.observation, 30, 700, {
		width: 240,
	})
	doc.fontSize(12)

	// Finish pdf writing
	let orderDestination = generateOrderDestination(data.carPlate)
	let stream = fs.createWriteStream(orderDestination)
	doc.pipe(stream)
	doc.end()
	return new Promise((resolve, reject) => {
		stream.on("finish", () => resolve(orderDestination))
		stream.on("error", (err) => reject(err))
	})
}
