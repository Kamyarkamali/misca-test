"use client";

import Image from "next/image";
import { FiMoreVertical } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const DEFAULT_IMAGE = "/images/default.webp";

export type ProductImage = {
  id: string;
  imageUrl: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  finalPrice?: number;
  images?: ProductImage[];
};

type ProductCardProps = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
};

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-3 text-center relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute cursor-pointer top-2 right-2 p-0 w-8 h-8 flex items-center justify-center border border-dashed rounded-md hover:bg-gray-100 transition-colors">
            <FiMoreVertical size={20} className="text-gray-600" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="z-50 w-40">
          <DropdownMenuItem onClick={() => onEdit(product)}>
            ویرایش
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => onDelete(product.id)}
          >
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-24 relative mb-2">
        <Image
          src={product.images?.[0]?.imageUrl || DEFAULT_IMAGE}
          alt={product.name || "product"}
          fill
          className="object-cover rounded"
        />
      </div>

      <p className="text-sm font-medium">{product.name}</p>
      <p className="text-xs text-gray-500">
        {(product.finalPrice ?? product.price).toLocaleString()} تومان
      </p>
    </div>
  );
}
