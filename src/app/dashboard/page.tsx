'use client'
import IssueCard from '@/components/IssueCard'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { FaSyncAlt } from 'react-icons/fa' // Refresh icon from react-icons
import { Separator } from "@/components/ui/separator"
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BsSearch } from 'react-icons/bs';


interface Issue {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  closedBy:string
  assignedTo:string
}

const Page = () => {
  const [issues, setIssues] = useState<Issue[]>([])
  const [originalIssues, setOriginalIssues] = useState<Issue[]>([]);
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setIsRefreshing] = useState(false)
  const[filterOption,setFilterOption]=useState("")
  const [searchTerm, setSearchTerm] = useState("");
  

  const { toast } = useToast()

  useEffect(() => {
    const handleFIlter=async()=>{
      if(filterOption){
      const filter=filterOption
      const data={filter:filter}
      const response=await axios.post("/api/filter",data)
      setIssues(response.data.filteredIssue)
      toast({
        title:response.data.message
      })
      }
      }
      handleFIlter();
  }, [filterOption])

  const handleSearchIssue = useCallback(
    (searchTerm:any) => {
      if (searchTerm.trim() === "") {
        setIssues(originalIssues); // Reset to the original issues list when search is empty
        return;
      }
  
      // Create a flexible regular expression for partial matches
      const searchRegex = new RegExp(searchTerm.split("").join(".*"), "i");
  
      const filterBySearch = originalIssues.filter((issue) =>
        searchRegex.test(issue.title)
      );
  
      setIssues(filterBySearch);
    },
    [originalIssues] // Dependencies array: this will recompute when `originalIssues` changes
  );
  
  useEffect(() => {
    handleSearchIssue(searchTerm);
  }, [searchTerm, handleSearchIssue]);

  

  useEffect(() => {
    const fetchIssues = async () => {
      setIsFetching(true)
      setError(null)  // Reset error state before each fetch
      try {
        const response = await axios.get('/api/getIssue')
        setIssues(response.data.issues)
        setOriginalIssues(response.data.issues)
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
        setIsRefreshing(false) 
        setFilterOption("")
        // Reset refreshing state after fetch
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
          <div className="flex items-center space-x-4">

  <div className="flex items-center border rounded-md shadow-sm px-3 py-1.5 w-full max-w-[240px] bg-white">
    <input
      type="text"
      placeholder="Search issues"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-grow focus:outline-none"
    />
    <BsSearch className="text-gray-500 cursor-pointer" />
  </div>
  <button
    onClick={() => setIsRefreshing(true)}
    disabled={isFetching}
    className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-colors duration-200"
  >
    <FaSyncAlt className="text-xl" />
  </button>
</div>

        </div>
        <Separator />


        {/* Loading/No Issues/Error Messages */}
        {isFetching && (
          <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </div>
        
        )}

        {error && (
          <p className="text-center text-red-500">{`Error: ${error}`}</p>
        )}

        {issues.length === 0 && !isFetching && !error && (
          <p className="text-center text-gray-500">No issues available.</p>
        )}
       <div className="flex items-center space-x-4">
  {/* Filter Dropdown */}
  <Select
    value={filterOption} // Bind the current filter state
    onValueChange={(value) => setFilterOption(value)} // Directly update filter state
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select Filter" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="OPEN">OPEN</SelectItem>
        <SelectItem value="CLOSED">CLOSED</SelectItem>
        <SelectItem value="OLDEST">OLDEST</SelectItem>
        <SelectItem value="NEWEST">NEWEST</SelectItem> 
       <SelectItem value="LAST SEVEN DAYS">LAST 7 DAYS</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>

  {/* Search Bar */}
  
</div>

            

        {/* Render Issues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 ">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <IssueCard key={issue._id} issue={issue}  />
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
