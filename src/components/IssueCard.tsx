import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import dayjs from 'dayjs';
import { Badge } from "@/components/ui/badge";
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';

// Define the structure for the issue prop
interface IssueCardProps {
  issue: {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
    closedBy:string
    assignedTo:string
  };
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const { data: session } = useSession();
  const user = session?.user as User;

  const { toast } = useToast();
  const [issueDisabled, setIssueDisabled] = useState(false);
  const [isIssueClosed, setIsIssueClosed] = useState(false);

  const onIssueClosing = async (issueId: string) => {
    if (!issueId) {
      console.error("Issue ID is undefined");
      return;
    }

    try {
      const data = { username: user.username };
      const response = await axios.post(`/api/close-issue?issueId=${issueId}`, data);
      toast({
        title: "Issue closed",
        description: "Issue has been closed successfully",
      });
      setIssueDisabled(true);
      setIsIssueClosed(true);
    } catch (error) {
      console.error("Failed to close the issue:", error);
      toast({
        title: "Error",
        description: "Failed to close the issue. Please try again.",
      });
    }
  };

  return (
    <Card className="card-bordered transition-all transform hover:scale-105 hover:shadow-lg hover:brightness-105">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{issue.title}</CardTitle>
          <Badge
            className={`${
              issue.status === "OPEN"
                ? "bg-green-700 text-black hover:bg-green-600"
                : "bg-red-600 text-black hover:bg-red-500"
            }`}
            onClick={
              !issueDisabled && issue.status === "OPEN" && session?.user.username === issue.assignedTo
                ? () => onIssueClosing(issue._id)
                : undefined
            }
            style={{
              cursor: issue.status === "CLOSED" || session?.user.username !== issue.assignedTo ? 'not-allowed' : 'pointer',
            }}
          >
            {issue.status}
          </Badge>
        </div>
        <div className="text-sm">{dayjs(issue.createdAt).format('MMM D, YYYY h:mm A')}</div>
      </CardHeader>
      <CardContent>
        <p>{issue.description}</p>
      </CardContent>
      <CardFooter>
        {issue.closedBy ? (
          <p>Issue closed by: {issue.closedBy}</p>
        ) : (
          <p>Issue Assigned to: {issue.assignedTo}</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default IssueCard;
