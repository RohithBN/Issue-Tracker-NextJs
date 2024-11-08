'use client'
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import Link from 'next/link'; // Use next/link for routing

export  function Navbar () {
  const { data: session } = useSession();
  const user = session?.user as User;
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
          Issue Tracker
        </Link>
        {user?(<p>Welcome {user.username}</p>):(null)}
        {session ? (
          <div className="flex items-center">

            <Link href="/issue-form">
            <Button className="bg-slate-100 text-black" variant="outline">
              Create Issue
            </Button>
          </Link>
            
            <Button onClick={() => signOut()} className="bg-slate-100 text-black ml-4" variant="outline">
              Logout
            </Button>
          </div>
        ) : (<>
          <Link href="/sign-in">
            <Button className="bg-slate-100 text-black" variant="outline">
              Login
            </Button>
          </Link>
          <Link href="/sign-up">
          <Button className="bg-slate-100 text-black" variant="outline">
            SignUp
          </Button>
        </Link>
        </>
        )}
      </div>
    </nav>
  );
};


