"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const productController_1 = require("../controller/productController");
const orderController_1 = require("../controller/orderController");
router.post('/orders', orderController_1.bookOrdersController);
router.get('/products', productController_1.getAllProductsController);
//middleware to check user role to limit access.
router.use((req, res, next) => {
    try {
        const { user_role } = req.query;
        if (user_role !== 'admin')
            throw new Error('Permission denied');
        else
            next();
    }
    catch (e) {
        console.log("Permission denied");
        res.status(400).json({ message: "Permission Denied", success: false });
    }
});
router.post('/products', productController_1.createProductController);
router.put('/product/update/:id', productController_1.updateProductByIdController);
router.delete('/product/delete/:id', productController_1.deleteProductByIdController);
exports.default = router;
