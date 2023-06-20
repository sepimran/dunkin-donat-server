const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send("Dunkin Donat Server is running ")
})


const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w3iaiou.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection

        const foodCollection = client.db('foodDb').collection('food');

        app.get('/foods', async(req, res)=>{
            const cursor = foodCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/foods' , async(req, res) => {
            const newFood = req.body;
            console.log(newFood);

            // send data to mongoDB database
            const result = await foodCollection.insertOne(newFood);
            res.send(result);
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, ()=>{
    console.log(`Dunkin Donat is running ${port}`)
})