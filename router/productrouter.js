const express = require("express")
const router = express.Router()

const {createProduct,  getproduct} = require('../controller/product_controller')

router.post("/create", createProduct )


module.exports= router;