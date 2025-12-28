"use client";

import { useState } from "react";
import Image from "next/image";
import { FiMoreVertical } from "react-icons/fi";
import { FaFire, FaClock } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProductPrice } from "../services/request";
import { useParams } from "next/navigation";
import { FloatingInput } from "@/components/floating-input";

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
  averagePreparationMinutes?: number;
  calories?: number;
  productIngredients?: string | null;
  images?: any;
  isAvailable?: boolean;
};

type ProductCardProps = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
};

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [openModal, setOpenModal] = useState(false);
  const [newPrice, setNewPrice] = useState(product.finalPrice ?? product.price);
  const [displayPrice, setDisplayPrice] = useState(
    product.finalPrice ?? product.price
  );

  const params = useParams();

  const handleSavePrice = async () => {
    try {
      setDisplayPrice(newPrice);

      await updateProductPrice(params.slug as string, {
        id: product.id,
        price: newPrice,
      });

      setOpenModal(false);
    } catch (error) {
      setDisplayPrice(product.finalPrice ?? product.price);
      console.error("خطا در آپدیت قیمت:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-3 text-center relative flex flex-col">
      {/* دکمه منو */}
      <DropdownMenu>
        <DropdownMenuTrigger className="z-999" asChild>
          <button className="absolute cursor-pointer top-2 right-2 p-0 w-8 h-8 flex items-center justify-center rounded-md transition-colors">
            <FiMoreVertical
              size={30}
              className="text-gray-300 hover:bg-orange-100 hover:text-black rounded-md p-1 transition-colors"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="z-50 w-40 text-right">
          <DropdownMenuItem onClick={() => onEdit(product)}>
            ویرایش
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenModal(true)}>
            ویرایش قیمت
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => onDelete(product.id)}
          >
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-full aspect-square relative mb-3">
        <Image
          src={product.images?.[0]?.imageUrl || DEFAULT_IMAGE}
          alt={product.name || "product"}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 100px"
        />
      </div>

      {/* نام و قیمت */}
      <p className="font-medium text-base">{product.name}</p>
      <p className="text-sm text-gray-500 mb-2">
        {displayPrice.toLocaleString()} تومان
      </p>

      {/* اطلاعات جزئی به صورت ردیفی */}
      <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
        {product.calories !== undefined && (
          <div className="flex items-center gap-1">
            <FaFire size={12} />
            <span>{product.calories}</span>
          </div>
        )}
        {product.averagePreparationMinutes !== undefined && (
          <div className="flex items-center gap-1">
            <FaClock size={12} />
            <span>{product.averagePreparationMinutes} دقیقه</span>
          </div>
        )}
      </div>

      {/* Modal ویرایش قیمت */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش قیمت محصول</DialogTitle>
          </DialogHeader>

          <div>
            <label>قیمت فعلی</label>
            <Input
              className="text-left"
              value={product.finalPrice ?? product.price}
              disabled
            />
          </div>

          <div>
            <FloatingInput
              label="قیمت جدید"
              type="number"
              value={newPrice}
              className="text-left ltr"
              onChange={(e) => setNewPrice(Number(e.target.value))}
            />
          </div>

          <DialogFooter>
            <Button
              className="bg-red-500 hover:bg-red-600 transition text-white cursor-pointer"
              onClick={() => setOpenModal(false)}
            >
              لغو
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 transition text-white cursor-pointer"
              onClick={handleSavePrice}
            >
              ذخیره
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
