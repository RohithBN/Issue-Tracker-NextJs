import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcryptjs from 'bcryptjs'

export async function POST(request:Request){
    function generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
      }
    await dbConnect();
    const {username,email,password}=await request.json();
    try {
        const exisitingUser=await UserModel.findOne({
            username,
            isVerified:true
        })
        if(exisitingUser){
            return Response.json({
                message:"User already exists",
                success:false
            },{
                status:400
            })   
    }
    const verifyCode=generateOTP()

    const existingUserByEmail=await UserModel.findOne({
        email
    })
   if(existingUserByEmail){
    if(existingUserByEmail.isVerified){
        return Response.json({
            success:false,
            message:"Email already exists"
            },{
                status:400
            },
        )}
        else{
            const hashedPassword=await bcryptjs.hash(password,10)
            existingUserByEmail.password=hashedPassword;
            existingUserByEmail.verifyCode=verifyCode;
            existingUserByEmail.verifyCodeExpiry=new Date(Date.now() + 3600000); 
            await existingUserByEmail.save();
        }}
        else{
            const hashedPassword=await bcryptjs.hash(password,10)
            const newUser=new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode:verifyCode,
                verifyCodeExpiry:new Date(Date.now() + 3600000)

            })
            const savedUser=await newUser.save();
            console.log("saved user:",savedUser)
            return Response.json({
                success:true,
                message:"User created successfully",
                data:savedUser
                },{
                    status:201
                    }
            )

        }

    }

    catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"Error creating user"
            },{
                status:500
                },
                )
        
    }

}