"use client";

import CRSProducts from "@/components/CLS/CRSProducts";
import ProductHeader from "./Header";
import React, { useEffect, useState } from "react";
import ProductDetail from "./productDetail";
import RotateImage from "@/components/Effect/RotateImage";

export default function Products() {
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <div className="w-full  bg-gray-700 py-10">
      <div className="flex justify-center  lg:w-full mb-5">
        <ProductHeader isLoading={isLoading} />
      </div>
      {/* for the product */}
      <RotateImage/>
      <div className="px-5 lg:flex grid lg:gap-4  my-5">
        <ProductDetail isLoading={isLoading} />
        <div className="lg:px-10 flex justify-center px-4 py-5 bg-gray-600 w-full  rounded-lg  ">
          <CRSProducts isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
