"use client"
import IssueCard from '@/components/IssueCard'
import { Issue } from '@/model/Issue'
import { Separator } from '@radix-ui/react-separator'
import axios from 'axios'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [assignedIssueIds, setAssignedIssueIds] = useState<Issue[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const { data: session } = useSession();
  const user: User = session?.user as User;

  useEffect(() => {
    const fetchAssignedIssueIds = async () => {
      try {
        setIsFetching(true)
        const username = user?.username
        const response = await axios.post('/api/assigned-issues-ids', { username })
        setAssignedIssueIds(response.data.assignedIssues)
      } catch (error) {
        console.error(error)
      } finally {
        setIsFetching(false)
      }
    }

    if (user?.username) {
      fetchAssignedIssueIds();
    }
  }, [user]) // Re-run the effect if the user changes

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Issues</h1>
        </div>

        <Separator />
        
        {assignedIssueIds.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No issues to display.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-2">
            {assignedIssueIds.map(issue => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
