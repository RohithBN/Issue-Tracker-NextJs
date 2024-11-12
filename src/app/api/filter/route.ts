import IssueModel from "@/model/Issue";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { filter } = await request.json();

    try {
        let filteredIssue;

        if (filter === 'OPEN' || filter === 'CLOSED') {
            filteredIssue = await IssueModel.find({ status: filter });
        } else if (filter === 'OLDEST') {
            filteredIssue = await IssueModel.find().sort({ createdAt: 1 }); // Oldest first
        } else {
            filteredIssue = await IssueModel.find().sort({ createdAt: -1 }); // Default to newest first
        }

        if (filteredIssue.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No issues found",
            }, {
                status: 404
            });
        }

        return NextResponse.json({
            success: true,
            message: "Issues retrieved successfully",
            filteredIssue,
        });

    } catch (error:any) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Error retrieving issues",
            error: error.message,
        }, {
            status: 500
        });
    }
}
