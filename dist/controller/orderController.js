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
exports.bookOrdersController = void 0;
const db_1 = require("../db/db");
let bookOrdersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, items } = req.body;
        if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        const client = yield db_1.pool.connect();
        try {
            // Insert order into orders table
            const orderInsertQuery = 'INSERT INTO orders (user_id, products_ordered, status) VALUES ($1, $2, $3) RETURNING id';
            const orderResult = yield client.query(orderInsertQuery, [user_id, JSON.stringify(items), 'BOOKED']);
            const orderId = orderResult.rows[0].id;
            yield client.query('COMMIT');
            return res.status(201).json({ success: true, orderId });
        }
        catch (error) {
            yield client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'e', message: "Erorr inside bookOrdersController" });
    }
});
exports.bookOrdersController = bookOrdersController;
