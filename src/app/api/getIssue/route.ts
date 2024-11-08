import IssueModel from "@/model/Issue";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
    // Establish database connection
    await dbConnect();

    try {
        // Retrieve all issues from the database
        const issues = await IssueModel.aggregate([
            {
                $sort:{ createdAt:-1}
            }
        ]) // Use .lean() for a plain JavaScript object
        if (!issues){
            return Response.json({
                message: "No issues found",
                success:false
            },
        {
            status: 404,
        })
        }

        // Return the retrieved issues
        return Response.json(
            {
                success: true,
                message:"Issues  retrieved successfully",
                issues, // Return the issues array
                count: issues.length, // Include the count of issues for convenience
            },
            {
                status: 200,
            }
        );
        
    } catch (error:any) {
        console.error("Error retrieving issues:", error); // Log error with context
        return Response.json(
            {
                success: false,
                message: "Error retrieving issues",
                error: error.message, // Include error message for debugging
            },
            {
                status: 500,
            }
        );
    }
}
