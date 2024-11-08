import mongoose,{Schema,Document} from  'mongoose';

export interface User extends Document{
   
    username:string,
    email:string,
    password:string,
    isVerified:boolean,
    verifyCode:string,
    verifyCodeExpiry:Date
}

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true,"Please enter username"],
        unique:true,
        match:[/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:[3,"Should be longer than 3 characters"]
    },
    isVerified:{
        type:Boolean,
        default:false

    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
})

const UserModel=(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>('User',UserSchema);
export default UserModel;
