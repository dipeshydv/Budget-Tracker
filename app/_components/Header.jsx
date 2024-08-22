"use client"
import { Button } from '@/components/ui/button'; // Check if this path is correct
import React from 'react';
import Image from 'next/image';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
      <div>
        {/* Replace 'src' with the actual URL to your logo image */}
        <Image src='/logo.svg' alt='logo' width={160} height={100} />
      </div>
      <div>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href='/sign-in'>
            <Button>Get started</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
