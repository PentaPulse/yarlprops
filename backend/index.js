const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({
    origin:'https://192.168.8.165:3000',
}));

app.get(('/api/data'),(req,res)=>{
    res.json({message:"Hello from backend"})
})

const port = 3000;
app.listen(port,()=>{
    console.log(`Backend port: ${port}`)
})