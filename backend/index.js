const express = require('express');
const userRouter = require('./routes/users')
const mongoose = require('mongoose')
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors())
const port = 5000;

mongoose.connect("mongodb+srv://Cluster33761:X2dxeXpaUktf@cluster33761.q1ofbfy.mongodb.net/yarlprops?retryWrites=true&w=majority");

/*
  try {
    const collection = db.collection("users");

    app.get("/data", async (req, res) => {
      try {
        const documents = await collection.find().toArray();
        console.log(documents)
        res.json(documents);
      } catch (error) {
        res.status(500).send("Error fetching data");
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
*/


app.use('/api',userRouter)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

