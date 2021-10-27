const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bonkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
   try{
      await client.connect();
      // console.log('connected to database');
      const database = client.db("geniousMechanic");
      const servicesCollection = database.collection("mechanicsData");

      // Post Api
      app.post('/services' , async(req , res) => {
      //   console.log('hit the post')
      //   res.send('post hitted');
      const service = req.body;
      // console.log("hit the post api", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
      });

      // Get api
      app.get('/services' , async(req , res)=>{
         const cursor = servicesCollection.find({});
         const services = await cursor.toArray();
         res.send(services);
      });

      // Get Single Service
      app.get('/services/:id' , async(req , res) => {
         const id = req.params.id;
         // console.log("Getting specific service " , id);
         const query = {_id:ObjectId(id)};
         const collection = await servicesCollection.findOne(query);
         res.json(collection);
      });

      // Delete Single Service
      app.delete('/services/:id' , async(req , res) => {
         const id = req.params.id;
         const query = {_id:ObjectId(id)};
         const result = await servicesCollection.deleteOne(query);
         res.json(result);
      })
   }
   finally{
      // await client.close();
   }
}
run().catch(console.dir);

app.get("/" , (req, res) => {
   res.send("Running genious server");
});

app.listen(port , () => {
   console.log("Running Server on port" , port);
});