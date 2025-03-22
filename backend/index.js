const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());




// mongodb connection


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@pg.ut5xl.mongodb.net/?appName=PG`;


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
        console.log("Connected to MongoDB successfully!");


        //create a database and collections

        const database = client.db("PG-Managment");
        const usersCollection = database.collection("users");
        const pgsCollection = database.collection("pgs");

        app.post("/new-Pg",async(req,res) =>{
            const newPg = req.body;

            const result = await pgsCollection.insertOne(newPg);
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
    res.send('Hello World!!!23456789!!!!!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})