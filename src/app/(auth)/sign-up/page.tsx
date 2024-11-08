"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from 'axios';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the validation schema
const signUpSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function ProfileForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post('/api/sign-up', values);
      toast({
        title: 'Sign up successful',
        description: 'You have been signed up successfully',
      });
      router.push(`/verify/${values.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast({
        title: 'Error',
        description: axiosError?.response?.data.message || "Error Signing Up",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-700 to-black">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md shadow-white">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Create Your Account</h2>
        <p className="mb-4 text-center text-gray-600">Join us and start tracking your issues.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} className="border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-gray-500" />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} className="border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-gray-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} className="border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-gray-500" />
                  </FormControl>
                  <FormDescription>
                    Your password must be at least 8 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full py-3 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700' disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
