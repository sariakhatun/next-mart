 //import { MongoClient, ServerApiVersion } from 'mongodb'
// function dbConnect(collectionName: string){
//     const uri =process.env.MONGODB_URI!;
//     const dbName = process.env.DB_NAME!;
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// return client.db(dbName).collection(collectionName)

// }
import { MongoClient, ServerApiVersion } from 'mongodb';

export async function dbConnect(collectionName: string) {
  const uri = process.env.NEXT_PUBLIC_MONGODB_URI!;
  const dbName = process.env.DB_NAME!;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    //await client.connect();
    console.log('✅ MongoDB successfully connected!');

    const db = client.db(dbName);
    return db.collection(collectionName);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  } finally {
    
    // await client.close();
  }
}
