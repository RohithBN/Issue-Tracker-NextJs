"use client";
import IssueCard from "@/components/IssueCard";
import { useToast } from "@/hooks/use-toast";
import { Issue } from "@/model/Issue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FaSyncAlt } from "react-icons/fa";

const Page = () => {
  const [assignedIssueIds, setAssignedIssueIds] = useState<Issue[]>([]);
  const [originalIssues, setOriginalIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const[filterOption,setFilterOption]=useState("")
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const {toast}=useToast();

  const handleSearchIssue = useCallback(
    (searchTerm: string) => {
      if (searchTerm.trim() === "") {
        setAssignedIssueIds(originalIssues); // Reset to the original issues list when search is empty
        return;
      }

      const searchRegex = new RegExp(searchTerm.split("").join(".*"), "i");
      const filterBySearch = originalIssues.filter((issue) =>
        searchRegex.test(issue.title)
      );

      setAssignedIssueIds(filterBySearch);
    },
    [originalIssues]
  );

  useEffect(() => {
    handleSearchIssue(searchTerm);
  }, [searchTerm, handleSearchIssue]);

  const fetchAssignedIssueIds = async () => {
    try {
      setIsFetching(true);
      const username = user?.username;
      const response = await axios.post("/api/assigned-issues-ids", { username });
      setAssignedIssueIds(response.data.assignedIssues);
      setOriginalIssues(response.data.assignedIssues);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
      setIsRefreshing(false); // Reset refreshing state
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchAssignedIssueIds();
    }
  }, [user]);

  // Trigger data fetch on refresh
  useEffect(() => {
    if (isRefreshing) {
      fetchAssignedIssueIds();
    }
  }, [isRefreshing]);
  const fetchFilteredIssues=async()=>{
    try {
      setIsFetching(true);
      const data={
        username:user.username,
        filter:filterOption
      }
      const response=await axios.post('api/filtered-assigned-issues',data);
      setAssignedIssueIds(response.data.filteredIssues);
      toast({
        title:response.data.message
      })
    } catch (error) {
      console.error(error);
      } finally {
        setIsFetching(false);
        }
        
      
    }   

  useEffect(() => {
    fetchFilteredIssues();
  }, [filterOption])
  

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Issues</h1>
          <div className="flex items-center space-x-4">
            {/* Search Box */}
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
            {/* Refresh Button */}
            <button
              onClick={() => setIsRefreshing(true)}
              disabled={isFetching}
              className={`flex items-center justify-center p-4 rounded-full shadow-md transition-colors duration-200 ${
                isFetching
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <FaSyncAlt
                className={`text-xl ${
                  isFetching ? "animate-spin text-gray-600" : "text-white"
                }`}
              />
            </button>
          </div>
        </div>

        <Separator />
        
        <div className="flex items-center space-x-4">
  {/* Filter Dropdown */}
  <Select
    value={filterOption} // Bind the current filter state
    onValueChange={(value) => setFilterOption(value)} // Directly update filter state
  >
    <SelectTrigger   className="w-[180px]">
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




        {/* Issues Grid */}
        {assignedIssueIds.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No issues to display.</p>
        ) : (

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-2">
            {assignedIssueIds.map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
