"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FiMoreVertical } from "react-icons/fi";
import ProductManager from "./ProductManager";
import { Categorys } from "../types/types";

interface SortableCategoryProps {
  cat: Categorys;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  slug: string;
  fetchCategories: () => void;
  handleEditCategory: (cat: Categorys) => void;
  handleDeleteCategory: (id: string) => void;
}

export default function SortableCategory({
  cat,
  activeMenu,
  setActiveMenu,
  slug,
  fetchCategories,
  handleEditCategory,
  handleDeleteCategory,
}: SortableCategoryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? "0 8px 20px rgba(0,0,0,0.25)" : "none",
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <AccordionItem value={cat.id}>
      <AccordionTrigger
        ref={setNodeRef}
        style={dragStyle}
        className="relative flex flex-row-reverse justify-between bg-white p-4 rounded-xl shadow w-full"
      >
        {/* عنوان دسته */}
        <span className="flex-1 text-right cursor-pointer">{cat.title}</span>

        {/* منوی عملیات */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveMenu(activeMenu === cat.id ? null : cat.id);
          }}
          className="p-1 rounded hover:bg-gray-100 ml-2"
        >
          <FiMoreVertical />
        </button>

        {/* آیکون Drag */}
        <div
          {...attributes}
          {...listeners}
          className="p-2 ml-2 cursor-grab bg-gray-200 rounded"
          onClick={(e) => e.stopPropagation()} // جلوگیری از باز شدن آکاردئون
        >
          ⇅
        </div>

        {activeMenu === cat.id && (
          <div className="absolute top-12 right-0 bg-white shadow rounded-md text-sm z-10 w-40">
            <button
              className="block px-4 py-2 hover:bg-gray-100 w-full text-right"
              onClick={() => handleEditCategory(cat)}
            >
              ویرایش
            </button>
            <button
              className="block px-4 py-2 hover:bg-red-50 text-red-600 w-full text-right"
              onClick={() => handleDeleteCategory(cat.id)}
            >
              حذف
            </button>
          </div>
        )}
      </AccordionTrigger>

      <AccordionContent className="space-y-4">
        <ProductManager
          categoryId={cat.id}
          slug={slug}
          products={cat.products}
          fetchCategories={fetchCategories}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
