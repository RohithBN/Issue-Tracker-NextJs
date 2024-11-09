import dbConnect from "@/lib/dbConnect";
import IssueModel from "@/model/Issue";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const issueId = url.searchParams.get("issueId");
  console.log(issueId);
  const {username}=await request.json()

  await dbConnect();

  try {
    // Find the issue by ID
    const issue = await IssueModel.findById(issueId);
    console.log(issue);

    if (!issue) {
      return NextResponse.json(
        { message: "Issue not found" },
        { status: 404 }
      );
    }

    // Update issue status to 'CLOSED' and save
    issue.status = "CLOSED";
    issue.closedBy=username
    await issue.save();

    return NextResponse.json(
      { message: "Issue closed successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error closing issue:", error);
    return NextResponse.json(
      { message: "Error closing issue" },
      { status: 500 }
    );
  }
}
