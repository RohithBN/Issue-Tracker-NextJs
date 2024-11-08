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
    async authorize(credentials: any, req): Promise<any> {
        await dbConnect(); // Ensure you connect to the database
      
        try {
          // Check if credentials are provided
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error('Please enter both email/username and password.');
          }
      
          // Find the user by email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
      
          // If user not found, throw error
          if (!user) {
            throw new Error('Invalid email or password');
          }
      
          // Check if the user has verified their email
          if (!user.isVerified) {
            throw new Error('Please verify your email');
          }
      
          // Compare the provided password with the stored password
          const isValid = await bcryptjs.compare(credentials.password, user.password);
          
          // If password does not match, throw error
          if (!isValid) {
            throw new Error('Invalid email or password');
          }
      
          // Successful authorization
          console.log("User signed in:", user);
          return user; // Return user object on successful authentication
        } catch (error: any) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message); // Provide a clear error message
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
