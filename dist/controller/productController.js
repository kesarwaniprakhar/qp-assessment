"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductByIdController = exports.updateProductByIdController = exports.createProductController = exports.getAllProductsController = void 0;
const db_1 = require("../db/db");
// 1. Admin Responsibilities:
//    - Add new grocery items to the system
//    - View existing grocery items
//    - Remove grocery items from the system
//    - Update details (e.g., name, price) of existing grocery items
//    - Manage inventory levels of grocery items
// 2. User Responsibilities:
//    - View the list of available grocery items
//    - Ability to book multiple grocery items in a single order
//get-all-products-> /api/v1/products
let getAllProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield db_1.pool.connect();
        const data = yield client.query('SELECT * FROM products');
        res.status(200).json({ data: { rows: data === null || data === void 0 ? void 0 : data.rows, totalCount: data === null || data === void 0 ? void 0 : data.rowCount } });
    }
    catch (e) {
        console.log("some error occurred inside getAllProductsController");
        res.status(400).json({ error: e, success: false });
    }
    finally {
        if (client)
            client.release();
    }
});
exports.getAllProductsController = getAllProductsController;
//create-new-product-> /api/v1/admin/products
let createProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        if (!req.body) {
            throw new Error("Request body is empty");
        }
        let products = req.body;
        let sql = `INSERT INTO products (name, description, price, stock_items) values `;
        for (let i = 0; i < products.length; i++) {
            sql += `(\'${products[i].name}\', \'${products[i].description}\', ${products[i].price}, ${products[i].stock_items})`;
            if (i !== products.length - 1) {
                sql += ',';
            }
        }
        // console.log("sql", sql)
        client = yield db_1.pool.connect();
        const res_db = yield client.query(sql);
        return res.status(200).json({ result: res_db });
    }
    catch (e) {
        return res.status(400).send({ success: false, message: "Erorr while createProductController", error: e });
    }
    finally {
        if (client)
            client.release();
    }
});
exports.createProductController = createProductController;
//update-product-by-id -< api/v1/product/update/:id
const updateProductByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id))
            throw new Error("Id not provided");
        const { id } = req.params;
        const prod = req.body;
        let sql = '';
        const values = [id];
        Object.keys(prod).map((item, index) => {
            const key = item;
            sql += ` ${item} = $${index + 2}`;
            if (index < Object.keys(prod).length - 1) {
                sql += ',';
            }
            values.push(prod[key]);
        });
        // Update the product in the database
        const query = 'UPDATE products SET' + sql + ' WHERE id = $1 RETURNING *';
        // console.log("update query", query)
        const { rows } = yield db_1.pool.query(query, values);
        if (rows.length === 0) {
            return res.status(404).send({ message: "Product not found" });
        }
        const product = rows[0];
        return res.status(200).send({ product });
    }
    catch (e) {
        console.error("An error occurred while updating product by Id:", e);
        return res.status(400).send({ message: "Couldn't update product details" });
    }
});
exports.updateProductByIdController = updateProductByIdController;
//delete-product-by-id -< api/v1/product/delete/:id
const deleteProductByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10); // Assuming id is a number
        if (isNaN(id))
            throw new Error('Invalid id');
        const query = 'DELETE FROM products WHERE id = $1';
        const values = [id];
        const result = yield db_1.pool.query(query, values);
        if (result.rowCount === 1) {
            return res.status(200).json({ message: 'Product deleted successfully' });
        }
        else {
            return res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.deleteProductByIdController = deleteProductByIdController;
