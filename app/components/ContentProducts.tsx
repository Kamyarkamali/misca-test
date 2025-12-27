"use client";

import { FC } from "react";
import { UpdatedContentProductsProps } from "../types/interfaces";
import { PiFireDuotone } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";
import Image from "next/image";
import Percentage from "./Percentage";
import AddressComponents from "./AddressComponents";

const ContentProducts: FC<UpdatedContentProductsProps> = ({
  menuData,
  addToRefs,
}) => {
  const categories = menuData.categories ?? [];
  const businessItems = menuData.business ?? [];
  const getProductImage = (product: any) => {
    const image = product.images?.[0]?.imageUrl;

    if (!image) return "/images/default.webp";

    if (image.startsWith("https:/") && !image.startsWith("https://")) {
      return image.replace("https:/", "https://");
    }

    if (!image.startsWith("http")) {
      return `https://misca.ir/assets/images/products/${image}`;
    }

    return image;
  };

  return (
    <div className="space-y-16 max-w-252.75 mx-auto">
      {categories.map((category, index) => (
        <section
          key={category.id}
          ref={(el) => addToRefs && addToRefs(el, index)}
          className="space-y-6"
        >
          <h2
            className={`${
              category.products.length ? "block" : "hidden"
            } text-xl sm:text-2xl font-bold text-[#344e7c] pb-2`}
          >
            {category.title}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {category.products.map((product) => {
              return (
                <div
                  key={product.id}
                  className="bg-[#ECE1D8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-[#d6c9be]"
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 40vw"
                      className="object-cover rounded-3xl p-2"
                    />
                  </div>

                  <div className="p-3 sm:p-4 space-y-2 flex flex-col justify-between">
                    <h3 className="text-sm sm:text-[15px] h-10.5 font-semibold text-body line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 text-xs sm:text-sm text-muted">
                        {product.averagePreparationMinutes !== null && (
                          <div className="whitespace-nowrap flex gap-0.5 items-center">
                            <GiSandsOfTime size={15} />
                            {product.averagePreparationMinutes}m
                          </div>
                        )}
                        {product.averagePreparationMinutes !== null && (
                          <div className="whitespace-nowrap flex gap-0.5 items-center">
                            <PiFireDuotone size={15} />
                            {product.calories}
                          </div>
                        )}
                      </div>
                      <p className="text-sm sm:text-[15.5px] text-body font-bold">
                        {product.finalPrice.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* نمایش درصد مالیات */}
      <section>
        <Percentage menuData={businessItems} />
      </section>
      {businessItems.businessLocation &&
        businessItems.businessLocation.latitude != null &&
        businessItems.businessLocation.longitude != null &&
        businessItems.businessLocation.postalAddress && (
          <section>
            <AddressComponents menuData={businessItems} />
          </section>
        )}
    </div>
  );
};

export default ContentProducts;
