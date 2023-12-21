const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 3000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middelware
app.use(cors());
app.use(express.json());


//mongoDB Connections


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jz0ivtr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    
    app.get('/coffee', async(req,res) =>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/updateCoffee/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.post('/coffee', async(req,res) =>{
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })

    app.put('/updateCoffee/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const options = {upsert: true}
      console.log(req.body)
      const updatedCoffee = req.body;

      const coffee = {
        $set: {
          Name: updatedCoffee.Name,
          Quantity: updatedCoffee.Quantity,
          Supplier: updatedCoffee.Supplier,
          Category: updatedCoffee.Category,
          Taste: updatedCoffee.Taste,
          Details: updatedCoffee.Details,
          Photo: updatedCoffee.Photo
        }
      }

      const result = await coffeeCollection.updateOne(query, coffee, options)
      res.send(result);
    })

    app.delete('/coffee/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Coffe Store Server is Running!!!');
})

app.listen(port, ()=>{
    console.log('Coffe Store is running on Port ',port);
})