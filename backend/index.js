import express from 'express'
import db from './db.js';

const app = express();
const port = 5000;

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

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
