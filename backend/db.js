import {MongoClient,ServerApiVersion} from 'mongodb'

const uri = "mongodb+srv://Cluster33761:X2dxeXpaUktf@cluster33761.q1ofbfy.mongodb.net/yarlprops?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },useNewUrlParser: true, useUnifiedTopology: true
});

const db = client.db("yarlprops")

export default db;