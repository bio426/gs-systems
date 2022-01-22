const pdfkit = require("pdfkit")
const fs = require("fs")
const path = require("path")

class OrderService {
	ruc = "10092915447"
	type = "orden de trabajo"
	blankField = "----------"
	lorem =
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "

	lastSavedFile = ""

	ordersPath = path.join(__dirname, "..", "..", "storage", "orders")

	generateJobOrder(data) {
		let today = new Date()
		let orderDate = `${today.getDate()}-${
			today.getMonth() + 1
		}-${today.getFullYear()}`

		data.id ||= "T001-000000"
		data.clientName ||= this.blankField
		data.clientAddress ||= this.blankField
		data.clientDni ||= this.blankField
		data.clientRuc ||= this.blankField
		data.date ||= orderDate
		data.carBrand ||= this.blankField
		data.carModel ||= this.blankField
		data.carColor ||= this.blankField
		data.carPlate ||= "AAA-000"
		data.carMileage ||= this.blankField
		data.products ||= []
		data.subTotal ||= "00000.00"
		// data.taxedOp ||= "00000.00"
		data.igv ||= "00000.00"
		data.total ||= "00000.00"
		// calculando precios
		let calcTotal = 0
		data.products.map((product) => {
			calcTotal += parseFloat(product.total)
		})
		data.subTotal = calcTotal.toFixed(2)
		data.total = calcTotal.toFixed(2)
		// --
		data.observation ||= this.lorem

		let doc = new pdfkit({ autoFirstPage: false })
		doc.addPage({ size: "A4", margin: 0 })

		let template = path.join(this.ordersPath, "..", "plantilla.png")
		doc.image(template, 0, 0, { scale: 0.5 })

		doc.text(this.ruc.toUpperCase(), 480, 30)
		doc.font("Helvetica-Bold")
		doc.text(this.type.toUpperCase(), 432, 55, { width: 140, align: "center" })
		doc.font("Helvetica")
		doc.text(data.id.toUpperCase(), 460, 95)
		doc.text(data.clientName.toUpperCase(), 90, 150)
		doc.text(data.clientAddress.toUpperCase(), 100, 170)
		doc.text(data.clientDni.toUpperCase(), 63, 190)
		doc.text(data.clientRuc.toUpperCase(), 65, 210)
		doc.text(data.date.toUpperCase(), 125, 230)
		doc.text(data.carBrand.toUpperCase(), 350, 150)
		doc.text(data.carModel.toUpperCase(), 360, 170)
		doc.text(data.carColor.toUpperCase(), 350, 190)
		doc.text(data.carPlate.toUpperCase(), 350, 210)
		doc.text(data.carMileage.toUpperCase().concat(" KM"), 390, 230)
		// products
		doc.fontSize(10)
		let firstRow = 310
		let maxDescriptionWidth = 270
		let lastHeight = 0
		if (data.products == undefined) data.products = this.dummyProducts
		data.products.forEach((product) => {
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
		//--
		doc.text("S/. " + data.subTotal, 500, 680)
		// doc.text("S/. " + data.taxedOp, 500, 700)
		doc.text("S/. " + data.igv, 500, 700)
		doc.text("S/. " + data.total, 500, 760)
		doc.fontSize(10)
		doc.text(data.observation, 30, 700, {
			width: 240,
		})
		doc.fontSize(12)

		let month = today.getMonth() + 1
		let fileDate = `${today.getDate()}${
			month > 10 ? month : "0" + month.toString()
		}${today.getFullYear()}`
		let orderFileName = `${fileDate}_${data.carPlate}.pdf`
		// let destination = path.join(
		// 	__dirname,
		// 	`./../../storage/orders/${orderFileName}.pdf`
		// )
		let destination = path.join(
			// __dirname,
			// `./../../storage/orders/${orderFileName}.pdf`
			this.ordersPath,
			orderFileName
		)

		let stream = fs.createWriteStream(destination)
		doc.pipe(stream)
		doc.end()
		return new Promise((resolve, reject) => {
			stream.on("finish", () => {
				this.lastSavedFile = destination
				resolve(destination)
			})
		})
	}
}

module.exports = new OrderService()
