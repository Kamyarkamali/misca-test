import { Product } from "./interfaces";

export type LoginState = {
  error?: string;
  success?: boolean;
};

export type CreateProductForm = {
  name: string;
  price: number;
  isAvailable: boolean;
  calories?: number | null;
  averagePreparationMinutes?: number | null;
};

export type UploadedImage = {
  id: string;
  url: string;
};

export type Props = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export type ProductImage = { id: string; imageUrl: string };

export type Product = {
  id: string;
  name: string;
  price: number;
  finalPrice: number;
  isAvailable: boolean;
  calories: number | null;
  averagePreparationMinutes: number | null;
  categoryId: string;
  imageId?: string | null;
  images: ProductImage[];
};

export type Category = {
  id: string;
  title: string;
  displayOrder?: number;
  products: Product[];
};

export type Products = {
  id: string;
  name: string;
  price: number;
  finalPrice: number;
  isAvailable: boolean;
  calories: number | null;
  averagePreparationMinutes: number | null;
  categoryId: string;
  imageId?: string | null;
};

export type Categorys = {
  id: string;
  title: string;
  displayOrder?: number;
  products: Products[];
};

// types/product.ts
export interface ProductImages {
  id: string;
  imageUrl: string;
  alt?: string;
}

export interface Productss {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  calories: number | null;
  averagePreparationMinutes: number | null;
  categoryId: string;
  images: ProductImage[];
  onEdit: any;
}
