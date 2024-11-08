'use client'
import IssueCard from '@/components/IssueCard'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaSyncAlt } from 'react-icons/fa' // Refresh icon from react-icons
import { Separator } from "@/components/ui/separator"


interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
}

const Page = () => {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setIsRefreshing] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const fetchIssues = async () => {
      setIsFetching(true)
      setError(null)  // Reset error state before each fetch
      try {
        const response = await axios.get('/api/getIssue')
        setIssues(response.data.issues)
        toast({
          title: 'Success',
          description: 'Issues fetched successfully',
        })
      } catch (error: any) {
        setError(error.message)
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',  // Optional, to show a destructive variant for errors
        })
      } finally {
        setIsFetching(false)
        setIsRefreshing(false) // Reset refreshing state after fetch
      }
    }

    // Call the fetch function when the component mounts or when refreshing changes
    if (refreshing || issues.length === 0) {
      fetchIssues()
    }
  }, [refreshing]) // Only re-fetch when refreshing state changes

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Issues</h1>
          <button
            onClick={() => setIsRefreshing(true)}
            disabled={isFetching}
            className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-colors duration-200"
          >
            <FaSyncAlt className="text-xl" />
          </button>
        </div>
        <Separator />


        {/* Loading/No Issues/Error Messages */}
        {isFetching && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {error && (
          <p className="text-center text-red-500">{`Error: ${error}`}</p>
        )}

        {issues.length === 0 && !isFetching && !error && (
          <p className="text-center text-gray-500">No issues available.</p>
        )}

        {/* Render Issues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          ) : (
            <p className="text-center text-gray-500">No issues to display.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
