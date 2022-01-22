const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")

const OrderService = require("./services/OrderService")
const StorageService = require("./services/StorageService")

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
	// mainWindow.webContents.openDevTools()
}

ipcMain.handle("create-order", async (event, payload) => {
	let filePath = await OrderService.generateJobOrder(payload)
	return filePath
})

ipcMain.handle("get-files", async (event, payload) => {
	let fileList = await StorageService.getFiles()
	return fileList
})

ipcMain.handle("delete-file", async (event, payload) => {
	let deletedPath = await StorageService.deleteFile(payload)
	return deletedPath
})

ipcMain.handle("get-file-path", async (event, payload) => {
	let path = StorageService.getFilePath(payload)
	return path
})

ipcMain.handle("get-base-file",async(event,payload)=>{
	return StorageService.getBaseFile()
})

app.on("ready", createWindow)
app.on("window-all-closed", () => {
	app.quit()
})
