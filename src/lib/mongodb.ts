import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing MONGODB_URI');

const client = new MongoClient(uri);

if (!global._mongoClientPromise) {
  global._mongoClientPromise = client.connect();
}


const clientPromise = global._mongoClientPromise;

export default clientPromise;
