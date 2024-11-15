"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { User } from "next-auth"

// Schema for form validation
const issueformSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters long",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters long",
  }),
  assignIssue: z.string()
})

type Username={
  _id:string,
  username: string
}

export default function Page() {
  const [users, setUsers] = useState<Username[]>([]) // Using the `Username` type
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      const getUsers = async () => {
        try {
          setIsFetching(true)
          const response = await axios.get("/api/getUsers")
          // Filter out the current user's username after fetching
          const filteredUsers = response.data.usernames.filter(
            (user:any) => user.username !== session?.user.username
          )
          console.log(filteredUsers)
          if(filteredUsers.length===1){
            setUsers([
              {_id:'0',
              username:"NONE"}])
          }
          setUsers(filteredUsers)
        } catch (error) {
          console.error("Failed to fetch users:", error)
        } finally {
          setIsFetching(false)
        }
      }
      getUsers()
    }
  }, [session]) // Re-fetch when session changes

  async function onSubmit(values: z.infer<typeof issueformSchema>) {
    setIsSubmitting(true)
    try {
      const response = await axios.post("/api/sendIssue", values)
      toast({
        title: "Issue sent successfully",
        description: "Your issue has been sent to the developers",
      })
      router.push("/dashboard")
    } catch (error) {
      const axiosError = error as AxiosError<any>
      toast({
        title: "Error sending issue",
        description: axiosError.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
    console.log(values)
  }

  const form = useForm<z.infer<typeof issueformSchema>>({
    resolver: zodResolver(issueformSchema),
    defaultValues: {
      title: "",
      description: "",
      assignIssue: ""
    },
  })

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter issue title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter issue details here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Issue to:</FormLabel>
                  <FormControl>
                    <Select
                    
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
  <SelectGroup>
    {users.map((user) => (
      <SelectItem key={user._id} value={user.username}>  {/* Access the 'username' property here */}
        {user.username}  {/* Render the 'username' */}
      </SelectItem>
    ))}
  </SelectGroup>
</SelectContent>

                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
