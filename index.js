require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()


const port = process.env.PORT || 6008;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Is Running");
});



const uri = `mongodb+srv://${process.env.CRAFT_USER}:${process.env.CRAFT_PASS}@cluster0.7olulz0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const craftCollection = client.db('craftDB').collection('craftCollection');
    // const shirtCollection = client.db('shirtDB').collection('shirtCollection');
    // const pantCollection = client.db('pantDB').collection()

    app.get('/addProduct', async(req,res)=>{
        const showProduct = craftCollection.find()
        const result = await showProduct.toArray()
        res.send(result)
    })

    app.post('/addProduct', async(req,res)=>{
      const addCraft = req.body;
      console.log(addCraft)
      const craftResult = await craftCollection.insertOne(addCraft);
      res.send(craftResult)
      console.log(craftResult)
    })

    app.get('/addProduct/:id', async(req,res)=>{
      const id =  req.params.id
      const queryId = {_id: new ObjectId(id)}
      const resultId = await craftCollection.findOne(queryId)
      res.send(resultId)
    })

    app.put('/addProduct/:id', async(req,res)=>{
        const id = req.params.id 
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true}

        const updateProduct = req.body
        const update1 = {
          $set: {
            user_displayName: updateProduct.user_displayName,
            user_email: updateProduct.user_email,
            craft_name: updateProduct.craft_name,
            category: updateProduct.category,
            stock_status: updateProduct.stock_status,
            processing_time: updateProduct.processing_time,
            image_url: updateProduct.image_url,
            description: updateProduct.description,
            rating: updateProduct.rating,
            price: updateProduct.price

          }
        }
        const updateResult = await craftCollection.updateOne(filter, update1, options)
        res.send(updateResult)
        console.log('Update Result', updateResult)
    })

    app.delete('/addProduct/:id', async(req,res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const deleteResult = await craftCollection.deleteOne(query)
      res.send(deleteResult)
      console.log('Product is Deleted', deleteResult)
    })

    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server is Running, Port is ${port}`);
});

