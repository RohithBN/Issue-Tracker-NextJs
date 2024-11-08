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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// Define the validation schema
const signInSchema = z.object({
  identifier: z.string().min(2, {
    message: "Identifier must be at least 2 characters long.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

export default function SignInForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await signIn('credentials', {
        redirect: false,
        identifier: values.identifier,
        password: values.password,
      });
      console.log("SignIn Result:", result); // Log the result for debugging
  
      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sign In Successful',
          description: 'You have signed in successfully.',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast({
        title: 'Error',
        description: "Error signing in.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-700 to-black">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md shadow-white">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Sign In to Your Account</h2>
        <p className="mb-4 text-center text-gray-600">Join us and start tracking your issues. <a href="/sign-up">Sign-up</a></p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username or email" {...field} className="border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-gray-500" />
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
              {isSubmitting ? 'Please wait...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
