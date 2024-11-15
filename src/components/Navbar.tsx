'use client'
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router=useRouter();

   function handleSignOut(){
    signOut();
    router.push('/sign-in');
  }

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
          Issue Tracker
        </Link>
        
        {/* Welcome Message */}
        {user && <p className="text-gray-300">Welcome, {user.username}</p>}
        
        {/* Session Buttons */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {session ? (
            <>
              <Link href="/issue-form">
                <Button className="bg-slate-100 text-black" variant="outline">
                  Create Issue
                </Button>
              </Link>
              <Link href="/assigned-issue">
                <Button className="bg-slate-100 text-black" variant="outline">
                  Assigned Issues
                </Button>
              </Link>
              <Button onClick={handleSignOut} className="bg-slate-100 text-black" variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button className="w-full md:w-auto bg-slate-100 text-black" variant="outline">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="w-full md:w-auto bg-slate-100 text-black" variant="outline">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
