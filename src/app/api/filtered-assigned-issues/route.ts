import IssueModel from "@/model/Issue";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { username, filter } = await request.json();
    try {
        let filteredIssues;

        if (filter === "OPEN" || filter === "CLOSED") {
            // Filter by status
            filteredIssues = await IssueModel.find({ assignedTo: username, status: filter });
        } else if (filter === "OLDEST") {
            // Sort oldest first
            filteredIssues = await IssueModel.find({ assignedTo: username }).sort({ createdAt: 1 });
        } else if (filter === "NEWEST") {
            // Sort newest first
            filteredIssues = await IssueModel.find({ assignedTo: username }).sort({ createdAt: -1 });
        } else if (filter === "LAST SEVEN DAYS") {
            // Issues created within the last 7 days
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            filteredIssues = await IssueModel.find({
                createdAt: { $gt: sevenDaysAgo },
                assignedTo: username,
            }).sort({ createdAt: -1 });
        } else {
            // Default case: return all issues assigned to the user
            filteredIssues = await IssueModel.find({ assignedTo: username }).sort({ createdAt: -1 });
        }

        return NextResponse.json(
            {
                filteredIssues,
                message: "Issues retrieved successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
