import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import dayjs from 'dayjs'
import { Badge } from "@/components/ui/badge"
// Define the structure for the issue prop
interface IssueCardProps {
  issue: {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
  }
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    return (
        <Card className="card-bordered">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{issue.title}</CardTitle>
              <Badge className='bg-green-600 text-black'>{issue.status}</Badge>
        </div>
        <div className="text-sm">
          {dayjs(issue.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent>
        <p>{issue.description}</p>
      </CardContent>
    </Card>
  );
}

export default IssueCard
