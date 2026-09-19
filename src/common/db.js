import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const dbName = "cine-db";
let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("Conexión a MongoDB Atlas exitosa");
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    throw error;
  }
}

function getDB() {
  return db;
}

export { connectDB, getDB, client };