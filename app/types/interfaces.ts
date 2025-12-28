import { ButtonHTMLAttributes, ReactNode } from "react";
import { Products } from "./types";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface AccordionProps {
  title: ReactNode;
  icon?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  defaultOpen?: boolean;
}

// تایپ کراپ تصویر
export interface UploadResponse {
  data: {
    id: string;
    filePath: string;
  }[];
  isSuccess: boolean;
  messages: string[];
  errors: string[];
}

// تایپ ارسال فرم به بک اند
export interface CreateBusinessPayload {
  name: string;
  slug: string;
  logoId: string | null;
  logoTypographyId?: string | null;
  vatPercentage: number;
  roundingStrategy: 0 | 1 | 2;
  locationId: null;
  seoId: null;
}

export interface UploadedImage {
  id: string;
  url: string;
}

export interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GetBusinessesParams {
  Page?: number;
  PageSize?: number;
  Sort?: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  logoWordmarkUrl: string | null;
  vatPercentage: number;
  roundingStrategy: number;
  createdOn: number;
}

export interface BusinessesResponse {
  items: Business[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface GetWorksProps {
  initialData: any;
  token?: string;
}

// تایپ محصولات

export interface MenuImage {
  id: string;
  imageUrl: string;
  order: number;
}

export interface MenuProduct {
  id: string;
  name: string;
  price: number;
  finalPrice: number;
  calories: number | null;
  averagePreparationMinutes: number | null;
  productIngredients: string | null;
  images: MenuImage[];
}

export interface MenuCategory {
  id: string;
  title: string;
  products: MenuProduct[];
}

export interface businessLocation {
  latitude: number;
  longitude: number;
  postalAddress: string;
  logo: string;
  vatPercentage: number;
  name?: string;
  businessLocation?: any;
}

export interface ContentProductsProps {
  menuData: {
    categories: MenuCategory[];
    business: businessLocation;
  };
}

export interface BusinessItems {
  menuData: businessLocation;
}

export interface UpdatedContentProductsProps extends ContentProductsProps {
  addToRefs?: (el: HTMLElement | null, index: number) => void;
}

export interface MenuCategory {
  id: string;
  title: string;
  path?: string;
}

export interface CreateCategoryPayload {
  title: string;
  displayOrder: number;
  slug: string;
}

export interface FormCreateCategoryProps {
  onSuccess?: () => void;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  isAvailable: boolean;
  categoryId: string;
  imageId?: string | null;
  calories?: number | null;
  averagePreparationMinutes?: number | null;
}

export interface UpdateProductPayload {
  id: string;
  categoryId: string;
  name: string;
  isAvailable: boolean;
  calories?: number | null;
  averagePreparationMinutes?: number | null;
  imageId?: string | null;
  price: any;
}

export type ProductImage = {
  id: string;
  imageUrl: string;
};

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

export interface ProductCardProps {
  product: Products;
  onEdit: (product: Products) => void;
  onDelete: (id: string) => void;
}

export interface BusinessEvent {
  id: string;
  title: string;
  startAtUtc?: number;
  endAtUtc?: number;
  description?: string;
  image?: string | null;
  coverImage?: string | null;
  createdAtUtc?: number;
}

export interface BusinessPanelEventsProps {
  events: BusinessEvent[];
}

export interface Event {
  id: string;
  title: string;
  startAtUtc: number;
  endAtUtc: number;
  description: string;
  image: string | null;
  coverImage: string | null;
  createdAtUtc: number;
}

export interface BusinessPanelEventsProps {
  events1: Event[];
}

export interface CreateBusinessEventPayload {
  title: string;
  startAtUtc: number;
  endAtUtc: number;
  description?: string | null;
  image?: string | null;
  coverImage?: string | null;
  canReserve: boolean;
  reserveCapacity: number;
  cost?: number | null;
}
