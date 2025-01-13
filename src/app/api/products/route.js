import { connect } from "@/dbConfig/dbConfig";
import Product from "../../../models/productModel";
import { NextResponse } from "next/server";

connect();
export async function POST(request) {
  const { productId, productPassword, productType, productPath, status } =
    await request.json();

  await Product.create({
    productId,
    productPassword,
    productType,
    productPath,
    status,
  });
  return NextResponse.json({ message: "Products Created" }, { status: 201 });
}

export async function GET() {
  const products = await Product.find();
  return NextResponse.json(products);
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ message: "Products deleted" }, { status: 200 });
}
