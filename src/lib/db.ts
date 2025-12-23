import clientPromise from './mongodb';
import { Collection, Document } from 'mongodb';

export async function getCollection<T extends Document>(
  collectionName: string
): Promise<Collection<T>> {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<T>(collectionName);
}
