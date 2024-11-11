import mongoose from 'mongoose';
import IssueModel from "@/model/Issue";
import UserModel from "@/model/User";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { username } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Since the `assignedIssues` are stored as ObjectId strings in the database, 
    // you can use them directly in the query without needing to convert them to ObjectId manually.
    const assignedIssueIds = user.assignedIssues;

    // Find issues with the provided ObjectIds
    const assignedIssues = await IssueModel.find({
      _id: { $in: assignedIssueIds }
    });
    console.log(assignedIssues)
    return new Response(JSON.stringify({
      assignedIssueIds,
      assignedIssues
    }), { status: 200 });

  } catch (error) {
    console.error("Error fetching issues:", error);
    return new Response("Error", { status: 500 });
  }
}
