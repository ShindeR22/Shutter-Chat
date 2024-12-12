import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://rushikesh22:T1KHFGws6Dosu0Ec@cluster0.desf8.mongodb.net/chats?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    return client.db("chats");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // process.exit(1);
  }
}

let db;

connectToDatabase().then((database) => {
  db = database;
});

app.post("/messages", async (req, res) => {
  try {
    const { Sender } = req.body;
    const { text } = req.body;
    const result = await db
      .collection("messages")

      .insertOne({ text, timestamp: new Date(), Sender });
    res.status(201).json({ id: result.insertedId, text, Sender });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await db
      .collection("messages")
      .find()
      .sort({ timestamp: 1 })
      .toArray();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch me ssages" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
