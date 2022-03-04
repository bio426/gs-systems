const path = require("path")
const fs = require("fs")

const ORDERS_PATH = path.join(__dirname, "..", "..", "storage","orders")

module.exports = function (){
  return new Promise((resolve,reject)=>{
    fs.readdir(ORDERS_PATH,(err,files)=>{
      if(err)reject(err)
      let fullFiles = files.map(file=>path.join(ORDERS_PATH,file))
      resolve(fullFiles)
    })
  })
}