import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from 'bcryptjs'
import { NextAuthOptions } from "next-auth";

export const authOptions:NextAuthOptions={
providers: [
  CredentialsProvider({
    name: "Credentials",
   
    credentials: {
      identifier: { label: "Username/Email", type: "text"},
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials:any, req):Promise<any>{
        dbConnect();
        try {
            const user = await UserModel.findOne({
                $or: [
                  { email: credentials.identifier },
                  { username: credentials.identifier },
                ],
              });           
    
              if (!user) {
                throw new Error('Invalid email or password');
            }
            if(!user.isVerified){
                throw new Error("Verify your email")
            }
    
            const isValid=await bcryptjs.compare(credentials?.password,user.password)
            if(!isValid) {
                if (!isValid) {
                    throw new Error('Invalid email or password');
                    }
                    console.log("sign in user:",user)
                    return user;
        } 
        } catch (error:any) {
            throw new Error(error)
            
        }
      
    }
  })
    ]
    ,callbacks:{
        async jwt({ token,user}){
            if(user){
                token.username=user?.username  
                token._id=user?._id.toString();
                token.isVerified=user?.isVerified  
            }
            return token
        },
        async session({session,token}){
            if(token){
                session.user._id=token._id,
                session.user.username=token.username,
                session.user.isVerified=token.isVerified
            }
            return session
        }
    },
    pages:{
        signIn:"/sign-in"
    },
    session:{
    strategy:"jwt"
    },
    secret:process.env.NEXT_AUTH_SECRET_KEY!,

}
