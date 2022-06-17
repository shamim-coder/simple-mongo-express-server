const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const PORT = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

// db user: my-first-db
// db password:q2wi3d2dnuMcEPwJ

const uri = "mongodb+srv://my-first-db:q2wi3d2dnuMcEPwJ@testcluster.itw4vnf.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const ridersCollection = client.db("foodPoint").collection("riders");

        // Get User from database | Find Operation | Read
        app.get("/riders", async (req, res) => {
            const query = {};
            const cursor = ridersCollection.find(query);
            const riders = await cursor.toArray();
            res.send(riders);
        });

        // Post User | add a new user to Database | Create

        app.post("/riders", async (req, res) => {
            const newRider = req.body;
            const result = await ridersCollection.insertOne(newRider);

            res.send(result);
        });

        // Edit/Update User / Update

        app.put("/rider/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedUser = req.body;
            const options = { upsert: false };
            const updatedDoc = {
                $set: updatedUser,
            };
            const result = await ridersCollection.updateOne(filter, updatedDoc, options);

            res.send(result);
        });

        // Delete User

        app.delete("/rider/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ridersCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }
            res.send(result);
        });

        // const result = await ridersCollection.insertOne(rider);
        // console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

// client.connect((err) => {
//     console.log("Database Connected");
//     const collection = client.db("foodPoint").collection("riders");
//     // perform actions on the collection object
//     client.close();
// });

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log("CURD Server is Running!");
});
