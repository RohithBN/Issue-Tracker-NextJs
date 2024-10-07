import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth'{
    interface User{
        _id:string
        username:string,
        isVerified?:boolean,
    }
    interface Session{
        user:{
            _id:string
            username:string,
            isVerified?:boolean,
        }
    }
}
declare module 'next-auth/jwt'{
    interface JWT{
        _id:string
        username:string,
        isVerified?:boolean,
    }}