import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/db';

let bookOrdersController = async (req: Request, res: Response) => {
    try {
        
        const { user_id, items } = req.body;

        if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const client = await pool.connect();
        try {
            // Insert order into orders table
            const orderInsertQuery = 'INSERT INTO orders (user_id, products_ordered, status) VALUES ($1, $2, $3) RETURNING id';
            const orderResult = await client.query(orderInsertQuery, [user_id, JSON.stringify(items), 'BOOKED']);
            const orderId = orderResult.rows[0].id;


            await client.query('COMMIT');

            return res.status(201).json({ success: true, orderId });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'e', message: "Erorr inside bookOrdersController" });
    }
}

export {
    bookOrdersController
}