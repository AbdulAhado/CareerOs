const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://ahadrana:0125@cluster0.zxdyxe1.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
  } finally {
    await client.close();
  }
}
run();
