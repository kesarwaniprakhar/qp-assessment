import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/db';

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
let getAllProductsController = async (req: Request, res: Response) => {

        let client;

        try {
                client = await pool.connect();

                const data = await client.query('SELECT * FROM products');

                res.status(200).json({ data: { rows: data?.rows, totalCount: data?.rowCount } })

        } catch (e) {
                console.log("some error occurred inside getAllProductsController")
                res.status(400).json({ error: e, success: false })
        } finally {
                if (client) client.release();
        }

}

//create-new-product-> /api/v1/admin/products
let createProductController = async (req: Request, res: Response) => {
        let client;
        try {
                if (!req.body) {
                        throw new Error("Request body is empty")
                }

                interface Product {
                        name: string;
                        description: string;
                        price: number;
                        stock_items: number
                }

                let products: Product[] = req.body
                let sql: string = `INSERT INTO products (name, description, price, stock_items) values `


                for (let i: number = 0; i < products.length; i++) {
                        sql += `(\'${products[i].name}\', \'${products[i].description}\', ${products[i].price}, ${products[i].stock_items})`

                        if (i !== products.length - 1) {
                                sql += ','
                        }
                }
                // console.log("sql", sql)

                client = await pool.connect()

                const res_db = await client.query(sql)
                return res.status(200).json({ result: res_db })

        } catch (e) {
                return res.status(400).send({ success: false, message: "Erorr while createProductController", error: e })
        } finally {
                if (client) client.release();
        }
}

//update-product-by-id -< api/v1/product/update/:id
const updateProductByIdController = async (req: Request, res: Response) => {
        try {
                if (!req?.params?.id) throw new Error("Id not provided");

                const { id } = req.params;
                
                interface Product {
                        name: string;
                        description: string;
                        price: number;
                        stock_items: number
                }

                const prod: Product = req.body;

                let sql = ''
                const values: any[] = [id]
                
                Object.keys(prod).map((item, index)=>{
                        const key = item as keyof Product;
                        sql += ` ${item} = $${index + 2}`

                        if(index < Object.keys(prod).length - 1){
                                sql += ','
                        }
                        values.push(prod[key])
                })

                // Update the product in the database
                const query = 'UPDATE products SET' + sql + ' WHERE id = $1 RETURNING *';
                // console.log("update query", query)
                const { rows } = await pool.query(query, values);

                if (rows.length === 0) {
                        return res.status(404).send({ message: "Product not found" });
                }

                const product = rows[0];
                return res.status(200).send({ product });
        } catch (e) {
                console.error("An error occurred while updating product by Id:", e);
                return res.status(400).send({ message: "Couldn't update product details" });
        }
}

//delete-product-by-id -< api/v1/product/delete/:id
const deleteProductByIdController = async (req: Request, res: Response) => {
        try {
                const id = parseInt(req.params.id, 10); // Assuming id is a number
                if (isNaN(id)) throw new Error('Invalid id');
        
                const query = 'DELETE FROM products WHERE id = $1';
                const values = [id];
        
                const result = await pool.query(query, values);
        
                if (result.rowCount === 1) {
                    return res.status(200).json({ message: 'Product deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'Product not found' });
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
}

export {
        getAllProductsController,
        createProductController,
        updateProductByIdController,
        deleteProductByIdController
}