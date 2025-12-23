"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getCategoriesPanel,
  //   deleteCategory,
  updateCategory,
} from "../services/request";
import { toast } from "react-hot-toast";
import FormCreateCategory from "./FormCreateCategory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UiLoader from "../ui/UiLoader";
import { FiInbox } from "react-icons/fi";

export default function CategoryManager() {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug ?? "";

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);

  // مودال ویرایش
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [editLoading, setEditLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategoriesPanel({
        page: 1,
        pageSize: 20,
        sort: "displayOrder",
        slug,
      });
      setCategories(res.items || []);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchCategories();
  }, [slug]);

  const handleDelete = async (id: string) => {
    try {
      setLoadingDelete(id);
      //   await deleteCategory(id);
      toast.success("دسته‌بندی حذف شد");
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "خطا در حذف");
    } finally {
      setLoadingDelete(null);
    }
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setEditTitle(category.title);
    setEditOrder(category.order);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    setEditLoading(true);
    try {
      await updateCategory(
        editingCategory.id,
        { title: editTitle, order: editOrder },
        slug
      );
      toast.success("دسته‌بندی بروزرسانی شد");
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "خطا در بروزرسانی");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          دسته‌بندی‌های
        </h1>
        <FormCreateCategory onSuccess={fetchCategories} />
      </div>

      {loading ? (
        <div className="flex flex-col items-center min-h-50 py-20">
          <UiLoader />
          <p className="text-[#73528b] mt-2 text-lg">درحال دریافت داده‌ها...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <FiInbox size={48} className="mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            هیچ دسته‌بندی وجود ندارد
          </h2>
          <p className="text-gray-400">
            هنوز دسته‌بندی‌ای ایجاد نشده است. برای شروع می‌توانید یک دسته‌بندی
            جدید اضافه کنید.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>عنوان دسته‌بندی</TableHead>
                <TableHead className="text-center">الویت</TableHead>
                <TableHead className="text-center">تعداد محصولات</TableHead>
                <TableHead className="text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>{item.title}</TableCell>
                  <TableCell className="text-center">{item.order}</TableCell>
                  <TableCell className="text-center">
                    {item.products.length}
                  </TableCell>
                  <TableCell className="text-center flex justify-center gap-2">
                    {/* ویرایش */}
                    <div className="relative group">
                      <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        onClick={() => openEditModal(item)}
                      >
                        ویرایش
                      </button>
                      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ویرایش دسته‌بندی
                      </span>
                    </div>

                    {/* حذف */}
                    <div className="relative group">
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
                        onClick={() => handleDelete(item.id)}
                        disabled={loadingDelete === item.id}
                      >
                        {loadingDelete === item.id ? (
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          "حذف"
                        )}
                      </button>
                      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        حذف دسته‌بندی
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* مودال ویرایش */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col gap-4 relative">
            <button
              onClick={() => setEditingCategory(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-center">ویرایش دسته‌بندی</h2>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="عنوان"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={editOrder}
              onChange={(e) => setEditOrder(Number(e.target.value))}
              placeholder="الویت"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                لغو
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                {editLoading && (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
