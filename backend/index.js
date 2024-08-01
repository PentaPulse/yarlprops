const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

// Replace with your MongoDB Atlas connection string
const uri = "mongodb+srv://Cluster33761:X2dxeXpaUktf@cluster33761.q1ofbfy.mongodb.net/yarlprops?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db("yarlprops");
    const collection = database.collection("users");

    app.get("/data", async (req, res) => {
      try {
        const documents = await collection.find().toArray();
        console.log(documents)
        res.json(documents);
      } catch (error) {
        res.status(500).send("Error fetching data");
      }
    });

    app.listen(5000, () => {
      console.log(`Server running at http://localhost:${5000}`);
    });

  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

main();
