const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")

const {
	initialize,
	generateOrder,
	getOrderFiles,
	deleteOrderFile,
	createCar,
	findCar,
} = require("./functions/index")

const db = initialize()

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	})

	mainWindow.loadFile(path.join(__dirname, "..", "public", "index.html"))
	mainWindow.maximize()
	mainWindow.webContents.openDevTools()
}

ipcMain.handle("create-order", async (event, payload) => {
	createCar(db, {
		plate: payload.carPlate,
		color: payload.carColor,
		model: payload.carModel,
		brand: payload.carBrand,
		ownerName: payload.clientName,
		ownerAddress: payload.clientAddress,
		ownerDni: payload.clientDni,
		ownerRuc: payload.clientRuc,
	}).catch((err) => console.error(err))
	let filePath = await generateOrder(payload)
	return filePath
})

ipcMain.handle("get-files", async (event, payload) => {
	let fileList = await getOrderFiles()
	return fileList
})

ipcMain.handle("delete-file", async (event, payload) => {
	let deletedPath = await deleteOrderFile(payload)
	return deletedPath
})

ipcMain.handle("find-car", async (event, payload) => {
	try {
		let car = await findCar(db, payload)
		return car
	} catch (error) {
		console.log(error)
		return undefined
	}
})

app.on("ready", createWindow)
app.on("window-all-closed", () => {
	db.close()
	app.quit()
})
