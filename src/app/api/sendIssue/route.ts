import IssueModel from "@/model/Issue";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function POST(request: Request) {
    // Ensure the database connection is established
    await dbConnect(); // Make sure to await dbConnect for proper connection handling

    // Parse the incoming request body
    const { title, description } = await request.json();

    try {

        if (!title || !description) {
            return Response.json(
                {
                    success: false,
                    message: "Title and description are required",
                },
                {
                    status: 400,
                }
            );
        }
        
        // Create a new issue instance
        const issue = new IssueModel({
            _id:new mongoose.Types.ObjectId().toString(),
            title: title,
            description: description,
            status: "OPEN",
            createdAt: Date.now(),
            closedBy:null
        });

        // Validate issue object before saving
        

        // Save the issue to the database
        await issue.save();

        return Response.json(
            {
                success: true,
                message: "Issue created successfully",
                issue, // Optionally return the created issue
            },

            {
                status: 201,
            }
        );
        
    } catch (error) {
        console.error(error); // Use console.error for error logging
        return Response.json(
            {
                success: false,
                message: "Error creating an issue",
            },
            {
                status: 500,
            }
        );
    }
}
