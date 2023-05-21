const express = require('express')
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
  // client.connect();

    const toysCollection = client.db('toysDB').collection('toys');


     // Creating index on two fields
     const indexKeys = { ToyName: 1 }; // Replace field1 and field2 with your actual field names
     const indexOptions = { name: "toyName" }; // Replace index_name with the desired index name

    //  const result = await toysCollection.createIndex(indexKeys, indexOptions);
    // console.log(result);


    // search operation 

    app.get("/toySearchByName/:text", async (req, res) => {
      const searchText = req.params.text;
      const result = await toysCollection
        .find({
          $or: [
            { ToyName: { $regex: searchText, $options: "i" } }
          
          ],
        })
        .toArray();
      res.send(result);
    });



    app.get('/toys', async(req, res) => {
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await toysCollection.find(query).limit(20).sort({createdAt: -1}).toArray();
      res.send(result)
    })


    app.post('/toys', async(req, res) => {
      const toy =req.body;
      toy.createdAt = new Date();
      console.log('new toy', toy);
      const result = await toysCollection.insertOne(toy);
      res.send(result);
  })



    app.get('/toys/:text', async(req, res) =>{
      console.log(req.params.text)
      if(req.params.text == "regular" || req.params.text == "sports" || req.params.text == "police" || req.params.text == "truck"){
        //  const cursor =toysCollection.find({SubCategory: req.params.text})
      const result = await toysCollection.find({SubCategory: req.params.text}).sort({createdAt: -1}).toArray();
     return res.send(result);
      }else {
        // const cursor =toysCollection.find({})
        const result = await toysCollection.find({}).sort({createdAt: -1}).toArray();

        res.send(result);
      }
     
    })

    // app.get('/toys', async(req, res) =>{
    //   const cursor =toysCollection.find()
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })


 
  // delete operation

  app.delete('/toys/:id', async(req, res) => {
    const id = req.params.id;
    console.log('Please delete' , id);
    const query = {_id: new ObjectId(id) }
    const result = await toysCollection.deleteOne(query);
    res.send(result)
  })

  app.get('/toysUpdate/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id) }
    const result = await toysCollection.findOne(query);
    res.send(result)
  })

// update operation
  
  app.put('/toysUpdate/:id', async(req, res) => {
    const id = req.params.id;
      const body = req.body;
      console.log(id, body);
     
      const filter = {_id: new ObjectId(id)}
      const updateDoc = {
            $set: {
              ToyName: body.ToyName,
              SubCategory: body.SubCategory,
              Price: body.Price,
              AvailableQuantity: body.AvailableQuantity,
              Pictureurl: body.Pictureurl,
              Details: body.Details,
            },
          };
          const result = await toysCollection.updateOne(filter, updateDoc);
          res.send(result);


  })




  // app.put('/toysUpdate/:id', async(req, res) => {
  //   const id = req.params.id;
  //     const body = req.body;
  //     console.log(id, body);
     
  //     const filter = {_id: new ObjectId(id)}
  //     const options = {upsert: true}
  //     const updateDoc = {
  //         $set: {
  //           ToyName: body.ToyName,
  //           SubCategory: body.SubCategory,
  //           Price: body.Price,
  //           AvailableQuantity: body.AvailableQuantity,
  //           Pictureurl: body.Pictureurl,
  //           Details: body.Details,
  //         }
  //     }


  //     const result = await toysCollection.updateOne(filter, updateDoc, options );
  //     res.send(result);


  // })




  app.get('/toys/details/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId (id)}
    const result = await toysCollection.findOne(query);
    res.send(result);
  })


  // app.put("/updateToy/:id", async (req, res) => {
  //   const id = req.params.id;
  //   const body = req.body;
  //   console.log(body);
  //   const filter = { _id: new ObjectId(id) };
  //   const updateDoc = {
  //     $set: {
  //       ToyName: body.ToyName,
  //       SubCategory: body.SubCategory,
  //       Price: body.Price,
  //       AvailableQuantity: body.AvailableQuantity,
  //       Pictureurl: body.Pictureurl,
  //       Details: body.Details,
  //     },
  //   };
  //   const result = await toysCollection.updateOne(filter, updateDoc);
  //   res.send(result);
  // });


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
