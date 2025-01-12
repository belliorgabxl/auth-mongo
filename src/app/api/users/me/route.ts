import { getDataFromToken } from "@/app/actions/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";


connect()


export async function GET(request:NextRequest) {
    try{

        const userId  = await  getDataFromToken(request);

        const user = await User.findOne({_id:userId});

        return NextResponse.json({
            message: "User found",
            data:user
        })
        
    }catch(error){
        throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
}