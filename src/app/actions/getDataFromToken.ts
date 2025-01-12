
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

interface DecodedToken {
  id: string; 
  iat?: number; 
  exp?: number; 
}

export const getDataFromToken = (request: NextRequest): string => {
  try {

    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      throw new Error("Token not found");
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as DecodedToken;


    return decodedToken.id;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};