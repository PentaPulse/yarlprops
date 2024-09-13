const express = require('express')
const cors = require('cors')
const connectDB = require('./config/mongoDB')
const productRoutes = require('./routes/productRoutes')
//const rentalRoute= require('./routes/rentalRoutes')
const app = express()

app.use(cors({
    origin:'https://192.168.8.165:3000',
}));

connectDB()

app.use('/api/p',productRoutes)
//app.use('/api/r',rentalsRoute)

app.get(('/api/data'),(req,res)=>{
    res.json({message:"Hello from backend"})
})

const port = 3000;
app.listen(port,()=>{
    console.log(`Backend port: ${port}`)
})