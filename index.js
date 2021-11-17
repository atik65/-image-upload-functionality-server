const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPass}@cluster0.tx5hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("imageUpload");
    const imageCollection = database.collection("images");

    app.post("/imageupload", async (req, res) => {
      const imageData = req.files.image.data;
      const encodedImage = imageData.toString("base64");
      const imageBuffer = Buffer.from(encodedImage, "base64");

      const result = await imageCollection.insertOne({ image: imageBuffer });
      res.json(result);
    });

    app.get("/images", async (req, res) => {
      const cursor = imageCollection.find({});
      const images = await cursor.toArray();
      res.json(images);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello form Image upload Server");
});

app.listen(port, () => {
  console.log("Listening to port = ", port);
});

// app.post("/imageupload", async (req, res) => {
//   const imageData = req.files.image.data;

//   const encodedImage = imageData.toString("base64");
//   const image = Buffer.from(encodedImage, "base64");

//   const result = await imageCollection.insertOne({ image: image });
//   res.json(result);
// });
