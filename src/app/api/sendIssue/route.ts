import IssueModel from "@/model/Issue";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const { title, description, assignIssue } = await request.json();

    try {
        if (!title || !description) {
            return new Response(JSON.stringify({
                success: false,
                message: "Title and description are required",
            }), { status: 400 });
        }

        if (!assignIssue) {
            return new Response(JSON.stringify({
                success: false,
                message: "Assign Issue is required",
            }), { status: 400 });
        }

        // Create a new issue instance
        const issue = new IssueModel({
            _id: new mongoose.Types.ObjectId().toString(),
            title: title,
            description: description,
            status: "OPEN",
            createdAt: Date.now(),
            closedBy: null,
            assignedTo: assignIssue,
        });

        // Find the user by username
        const user = await UserModel.findOne({ username: assignIssue });

        if (user) {
            // Push the new issue ID to the user's assignedIssues array
            user.assignedIssues.push(issue._id);
            await user.save();
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found",
            }), { status: 404 });
        }

        // Save the issue to the database
        await issue.save();

        return new Response(JSON.stringify({
            success: true,
            message: "Issue created successfully",
            issue,
        }), { status: 201 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error creating an issue",
        }), { status: 500 });
    }
}
