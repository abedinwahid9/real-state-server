const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.os721gq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const propertiseCollection = client
      .db("propertiseDB")
      .collection("propertiseCollection");

    app.get("/propertise", async (req, res) => {
      const query = { status: "verify" };

      const result = await propertiseCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/allpropertise", async (req, res) => {
      const result = await propertiseCollection.find().toArray();
      res.send(result);
    });

    app.get("/propertise/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await propertiseCollection.findOne(query);
      res.send(result);
    });

    app.get("/myaddedproperties/:email", async (req, res) => {
      const email = req.params.email;

      const query = { agentEmail: email };

      const result = await propertiseCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.post("/addpropertise", async (req, res) => {
      const newPropertise = req.body;

      const result = await propertiseCollection.insertOne(newPropertise);
      res.send(result);
    });

    // update status

    app.put("/statusupdate/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateStatus = req.body;

      const status = {
        $set: {
          status: updateStatus.status,
        },
      };
      const result = await propertiseCollection.updateOne(
        filter,
        status,
        options
      );

      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatePropertise = req.body;

      const cart = {
        $set: {
          agentName: updatePropertise.agentName,
          agentEmail: updatePropertise.agentEmail,
          bathroom: updatePropertise.bathroom,
          bed: updatePropertise.bed,
          maxPrice: updatePropertise.maxPrice,
          minPrice: updatePropertise.minPrice,
          propertyLocation: updatePropertise.propertyLocation,
          propertyTitle: updatePropertise.propertyTitle,
          squareFeet: updatePropertise.squareFeet,
          propertiseDescription: updatePropertise.propertiseDescription,
        },
      };

      const result = await propertiseCollection.updateOne(
        filter,
        cart,
        options
      );

      res.send(result);
    });

    app.delete("/propertise/:id", async (req, res) => {
      const id = req.params.id;

      console.log(id);

      const query = { _id: new ObjectId(id) };

      const result = await propertiseCollection.deleteOne(query);

      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("real state server running");
});

app.listen(port, () => {
  console.log(`real state server running ${port}`);
});
