const path = require("path")
const fs = require("fs")

class StorageService {
	storagePath = path.join(__dirname,"..","..","storage")
	ordersPath = path.join(this.storagePath,"orders")

	constructor(){
		fs.mkdir(this.ordersPath,(err)=>{
			if(err && err.code != "EEXIST") console.error("error creando order storage")
		})
	}

	getFiles() {
		return new Promise((resolve, reject) => {
			// fs.readdir(this.storagePath, (err, files) => {
			// 	if (err) reject(new Error(err))
			// 	resolve(files)
			// })
			resolve(["123","qwe","zxc"])
		})
	}

	deleteFile(fileName) {
		let fullPath = path.join(this.ordersPath, fileName)
		return new Promise((resolve, reject) => {
			fs.rm(fullPath, (err) => {
				if (err) reject(new Error(err))
				resolve(fullPath)
			})
		})
	}

	getFilePath(fileName){
		return path.join(this.storagePath,fileName)
	}

	getBaseFile(){
		return path.join(this.storagePath,"blankOrder.pdf")
	}
}

module.exports = new StorageService()
