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
import { useParams, useRouter } from "next/navigation";

// Define the validation schema
const verifySchema = z.object({
  verifyCode: z.string().min(6, {
    message: "Verification code must be 6 digits",
  }),
});

export default function ProfileForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const param = useParams<{ username: string }>();

  const onSubmit = async (values: z.infer<typeof verifySchema>) => {
    try {
      setIsSubmitting(true);
      const data = { username: param.username, code: values.verifyCode };
      const response = await axios.post('/api/verify-code', data);
      toast({
        title: 'Verification successful',
        description: 'You have been verified successfully',
      });
      router.push("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast({
        title: 'Error',
        description: axiosError?.response?.data.message || "Error verifying code",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verifyCode: "",
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-700 to-black">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Verify Your Account</h2>
        <p className="mb-4 text-center text-gray-600">Please enter the verification code sent to your email.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the verification code" {...field} className="border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-gray-500" />
                  </FormControl>
                  <FormDescription>
                    The verification code is 6 digits long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full py-3 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700' disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : 'Verify Code'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
