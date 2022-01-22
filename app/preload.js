const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
	genOrder: async (data) => {
		let filePath = await ipcRenderer.invoke("create-order", data)
		return filePath
	},
	getFiles: async () => {
		let res = await ipcRenderer.invoke("get-files")
		return res
	},
	deleteFile: async (fileName) => {
		let res = await ipcRenderer.invoke("delete-file",fileName)
		return res
	},
	getFilePath:async(fileName)=>{
		return await ipcRenderer.invoke("get-file-path",fileName)
	},
	getBaseFile:async()=>{
		return await ipcRenderer.invoke("get-base-file")
	}
})
