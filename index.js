const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kx4dtgt.mongodb.net/?retryWrites=true&w=majority`;

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

    const toysCollection = client.db('toysDB').collection('toys');



    app.get('/toys', async(req, res) => {
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result)
    })


    app.get('/toys/:text', async(req, res) =>{
      console.log(req.params.text)
      if(req.params.text == "regular" || req.params.text == "sports" || req.params.text == "police" || req.params.text == "truck"){
        //  const cursor =toysCollection.find({SubCategory: req.params.text})
      const result = await toysCollection.find({SubCategory: req.params.text}).toArray();
     return res.send(result);
      }else {
        // const cursor =toysCollection.find({})
        const result = await toysCollection.find({}).toArray();
        res.send(result);
      }
     
    })

    // app.get('/toys', async(req, res) =>{
    //   const cursor =toysCollection.find()
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })


    app.post('/toys', async(req, res) => {
      const toy =req.body;
      console.log('new toy', toy);
      const result = await toysCollection.insertOne(toy);
      res.send(result);
  })


  app.get('/toys/details/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId (id)}
    const result = await toysCollection.findOne(query);
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


app.get('/', (req, res) => {
  res.send('Toy car zone server is running!')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
