import 'server-only';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import { dbConnect } from '@/src/lib/dbConnect';
import { Product, ProductDocument } from '@/src/types/product';

export async function getProductById(id: string): Promise<Product> {
 
  if (!ObjectId.isValid(id)) {
    notFound(); 
  }

  const collection = await dbConnect('product_services');

  const document = await collection.findOne<ProductDocument>({
    _id: new ObjectId(id),
  });

  if (!document) {
    notFound(); 
  }

  return {
    id: document._id.toString(),
    name: document.name,
    price: document.price,
    stock: document.stock,
    category: document.category,
    image: document.image,
    images: document.images,
    description: document.description,
    discount: document.discount,
    rating: document.rating,
    featured: document.featured,
  };
}
