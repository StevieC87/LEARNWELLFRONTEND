'use client';
import Link from 'next/link';

export default function GoogleLoginButton() {

  return (
    <>
      <Link href={`${process.env.NEXT_PUBLIC_API_URL}/users/googleauth`}>
        Login with Google2
      </Link>
    </>
  );

}