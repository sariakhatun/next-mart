
import { ObjectId } from 'mongodb';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  discount?: number;
  rating?: number;
  featured?: boolean;
}


export interface ProductDocument {
  _id: ObjectId;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  discount?: number;
  rating?: number;
  featured?: boolean;
}
