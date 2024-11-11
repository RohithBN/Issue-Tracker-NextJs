import mongoose, { Schema, Document } from 'mongoose';
import { Issue } from './Issue';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExpiry: Date;
    assignedIssues: mongoose.Types.ObjectId[]; // Or use `Issue[]` if you populated the types
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [3, "Password should be longer than 3 characters"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyCode: {
        type: String,
        required: true,
    },
    verifyCodeExpiry: {
        type: Date,
        required: true,
    },
    assignedIssues: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Issue',
            default: [], // Default to an empty array
        },
    ],
});

const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);
export default UserModel;
