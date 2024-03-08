import express, {Express, Request, Response} from 'express'
import 'dotenv/config'
import productRoutes from "./router/productRouter"

const app: Express = express()

const port = process.env.PORT || 3000
app.use(express.json())

app.use('/api/v1', productRoutes)


app.listen(port, ()=>{
    console.log(`server started on port ${port}`)
})
