
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel"
connect()
export async function GET(request, { params }) {  
  
  const { productId } = params;

  const products = await Product.findOne({ productId: productId });

  return NextResponse.json( products, { status: 200 });
}

export async function PUT(request, { params }) {
  const { productId } = params;
  const { newStatus: status} = await request.json();
  await Product.findOneAndUpdate({productId:productId} , {status});
  return NextResponse.json({ message: "Product updated" }, { status: 200 });
}

