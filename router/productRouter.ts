import express, { Router, Request, Response, NextFunction } from 'express';
const router: Router = express.Router();

import { getAllProductsController, createProductController, updateProductByIdController, deleteProductByIdController } from '../controller/productController';
import { bookOrdersController } from '../controller/orderController';


router.post('/orders', bookOrdersController);
router.get('/products', getAllProductsController);

//middleware to check user role to limit access.
router.use((req: Request, res: Response, next: NextFunction)=>{
    try{
        const {user_role} = req.query
        if(user_role !== 'admin') throw new Error('Permission denied')
        else next()
    }catch(e){
        console.log("Permission denied")
        res.status(400).json({message: "Permission Denied", success: false})
    }    
})

router.post('/products', createProductController);
router.put('/product/update/:id', updateProductByIdController);
router.delete('/product/delete/:id', deleteProductByIdController);



export default router;
