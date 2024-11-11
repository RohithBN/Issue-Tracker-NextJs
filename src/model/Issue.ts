import mongoose,{Schema,Document}  from 'mongoose';

export interface Issue extends Document{
    _id:string,
    title:string,
    description:string,
    status:string,
    createdAt:Date,
    closedBy:string
    assignedTo:string
}

export const IssueSchema:Schema<Issue>=new Schema({
    _id:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    closedBy:{
        type:String,
        default:null
    },
    assignedTo:{
        type:String,
        default:null
    }
})

const IssueModel=(mongoose.models.Issue as mongoose.Model<Issue>)|| mongoose.model<Issue>('Issue',IssueSchema);
export default IssueModel;
