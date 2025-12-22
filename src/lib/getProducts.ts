import { dbConnect } from '@/src/lib/dbConnect';
import { Product, ProductDocument,  } from '@/src/types/product';

export async function getProducts(): Promise<Product[]> {
  const collection = await dbConnect('product_services');

  const docs = await collection
    .find<ProductDocument>({})
    .toArray();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    price: doc.price,
    stock: doc.stock,
    category: doc.category,
    image: doc.image,
    images: doc.images,
    description: doc.description,
    discount: doc.discount,
    rating: doc.rating,
    featured: doc.featured,
  }));
}
