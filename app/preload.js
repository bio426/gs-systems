const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
	genOrder: async (data) => await ipcRenderer.invoke("create-order", data),
	getFiles: async () => await ipcRenderer.invoke("get-files"),
	deleteFile: async (fileName) =>
		await ipcRenderer.invoke("delete-file", fileName),
	findCar: async (plate) => await ipcRenderer.invoke("find-car", plate),
})
