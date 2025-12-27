"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { FiInbox } from "react-icons/fi";
import FormCreateCategory from "./FormCreateCategory";
import UiLoader from "../ui/UiLoader";
import { Categorys } from "../types/types";
import SortableCategory from "./SortableCategory";
import {
  getProductsInPanelMenu,
  deleteCategory,
  updateCategoryOrders,
  updateCategoryTitle,
} from "../services/request";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CategoryManager() {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug ?? "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const [categories, setCategories] = useState<Categorys[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState(searchQuery);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<Categorys | null>(
    null
  );
  const [editTitle, setEditTitle] = useState("");
  const [editDisplayOrder, setEditDisplayOrder] = useState<number>(0);
  const [editLoading, setEditLoading] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchCategories();
  }, [slug]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getProductsInPanelMenu({ slug });
      setCategories(res.categories || []);
    } catch {
      toast.error("خطا در دریافت دسته‌بندی‌ها");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    return categories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(search) ||
        cat.products.some((p) => p.name.toLowerCase().includes(search))
    );
  }, [categories, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(window.location.search);
    value ? params.set("q", value) : params.delete("q");
    router.replace(`?${params.toString()}`);
  };

  const handleEditCategory = (cat: Categorys) => {
    setEditingCategory(cat);
    setEditTitle(cat.title);
    setEditDisplayOrder(cat.displayOrder || 0);
    setIsEditCategoryOpen(true);
    setActiveMenu(null);
  };

  const handleSaveCategoryEdit = async () => {
    if (!editingCategory || !slug) return;
    setEditLoading(true);
    try {
      await updateCategoryTitle(editingCategory.id, editTitle, slug);
      toast.success("دسته‌بندی بروزرسانی شد");
      fetchCategories();
      setIsEditCategoryOpen(false);
    } catch {
      toast.error("خطا در بروزرسانی دسته‌بندی");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;

    if (cat.products.length > 0) {
      toast.error(
        "ابتدا محصولات این دسته‌بندی را حذف یا به دسته دیگری منتقل کنید"
      );
      return;
    }

    try {
      await deleteCategory(id, slug);
      toast.success("دسته‌بندی با موفقیت حذف شد");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("خطا در حذف دسته‌بندی:", err);
      toast.error("خطا در حذف دسته‌بندی");
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const newCategories = Array.from(categories);
    const [moved] = newCategories.splice(oldIndex, 1);
    newCategories.splice(newIndex, 0, moved);

    // update displayOrder based on new index
    const updatedCategories = newCategories.map((cat, index) => ({
      ...cat,
      displayOrder: index,
    }));

    setCategories(updatedCategories);

    try {
      await updateCategoryOrders(
        updatedCategories.map((c) => ({
          id: c.id,
          displayOrder: c.displayOrder,
        })),
        slug
      );
      toast.success("ترتیب دسته‌بندی‌ها بروزرسانی شد");
    } catch {
      toast.error("خطا در بروزرسانی ترتیب دسته‌بندی‌ها");
      fetchCategories();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
          <Input
            placeholder="جستجو..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-56"
          />
        </div>
        <div className="flex items-center gap-3">
          <FormCreateCategory onSuccess={fetchCategories} />
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex justify-center">
          <UiLoader />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-32 text-center text-gray-500">
          <FiInbox size={48} className="mx-auto mb-4" />
          موردی یافت نشد
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredCategories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {filteredCategories.map((cat) => (
                <SortableCategory
                  key={cat.id}
                  cat={cat}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                  slug={slug}
                  fetchCategories={fetchCategories}
                  handleEditCategory={handleEditCategory}
                  handleDeleteCategory={handleDeleteCategory}
                />
              ))}
            </Accordion>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="عنوان"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Input
            type="number"
            placeholder="ترتیب نمایش"
            value={editDisplayOrder}
            onChange={(e) => setEditDisplayOrder(+e.target.value)}
          />

          <DialogFooter>
            <Button onClick={handleSaveCategoryEdit} disabled={editLoading}>
              ذخیره
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
