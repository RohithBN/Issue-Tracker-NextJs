import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    await dbConnect();
    try {

        const usernames=await UserModel.find({},"username")
        console.log("usernames:",usernames)
        return NextResponse.json({
            usernames,
            sucess:true,
            message:"Users retreived successfully"
        })
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success:false,
            message: "Error fetching Users",
        },{
            status:500
        })
        
    }
}