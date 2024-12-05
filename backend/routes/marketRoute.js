const express = require("express")
const fileUpload = require('express-fileupload')

const imageUpload = require('../middlewares/imageUpload')
const { protect } = require('../middlewares/auth')
const { getItems, addItem, updateItem, deleteItems, updateItems } = require("../controllers/marketController")

const router = express.Router()


router.get("/", protect, getItems)
router.post("/", protect, fileUpload(), imageUpload(['.png', '.svg', '.jpg']), addItem)
router.delete("/", protect, deleteItems)

router.put("/update", protect, fileUpload(), imageUpload(['.png', '.svg', '.jpg']), updateItems)
router.put("/:itemId", protect, fileUpload(), imageUpload(['.png', '.svg', '.jpg']), updateItem)


module.exports = router;