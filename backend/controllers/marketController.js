const Market = require('../models/marketModel')
const ApiError = require('../utils/apiError')
const getMarketItemUID = require('../utils/generateUID')

// @desc    Gets All Items
// @route   GET /api/market
// @access  Private
async function getItems(req, res, next) {
    try {
        
        const items = await Market.find({ userId: req.user.id}).select("-userId")
        res.send({
            success: true,
            items
        })
    } catch(err) {
        next(new ApiError(err.message, 400))
    }
}

// @desc    Add Item
// @route   POST /api/market
// @access  Private
async function addItem(req, res, next) {
    try {
        const { name, price, stowage, icon } = req.body

        if (!name || !price || !icon || !stowage) {
            throw new Error("Please Fill All Required Fields")
        }

        let localId = getMarketItemUID()
        let ifExist = true;

        while (ifExist) {
            const item = await Market.find({ localId })
            if (item.length === 0) ifExist = false;
        }

        const item = await Market.create({
            userId: req.user.id,
            localId,
            name,
            price,
            icon,
            stowage
        })

        res.status(201).send({
            id: item.id,
            localId: item.localId,
            name,
            price,
            icon,
            stowage
        })
        
    } catch(err) {
        next(new ApiError(err.message, 400))
    }
}

// @desc    Update Item
// @route   PUT /api/market/:itemId
// @access  Private
async function updateItem(req, res, next) {
    try {

        if (Object.keys(req.body).length < 1) {
            throw new Error("Must send at least one property to update")
        }
        const item = await Market.findOneAndUpdate({_id: req.params.itemId, userId: req.user.id}, {...req.body}, {new: true}).select("-userId")
        if (!item) throw new Error('Something went wrong');
        res.send(item);
        
    } catch(err) {
        next(new ApiError(err.message, 400))
    }
}

// @desc    Update Item
// @route   PUT /api/market/update
// @access  Private
async function updateItems(req, res, next) {

    const { updatedItems } = req.body
    
    try {
        
        let counter = 0;
        
        for (let i = 0;i < updatedItems.length;i++) {
            
            let body = {...updatedItems[i]};
            delete body.id;
            let item = await Market.updateOne({_id: updatedItems[i].id, userId: req.user.id}, body)
            
            if (item.acknowledged && item.modifiedCount === 1) counter++;
            
        }
        
        
        res.send({message: counter === updatedItems.length ? "Items Updated Successfully" : `${counter} Item Updated Successfully`});
        
    } catch(err) {
        next(new ApiError(err.message, 400))
    }
}

// @desc    Delete Many Item
// @route   DELETE /api/market/
// @access  Private
async function deleteItems(req, res, next) {

    const { deletedItemsIds } = req.body

    try {
        const acc = await Market.deleteMany({_id: { $in: deletedItemsIds }, userId: req.user.id}) 
        
        if (acc.deletedCount > 0) res.send({message: `${req.params.itemId} Items Deleted Successfully`});
        else res.status(500).send({message: `Error While Deleting The Items`});
    } catch(err) {
        next(new ApiError(err.message, 400))
    }
}


module.exports = { getItems, addItem, updateItem, updateItems, deleteItems }