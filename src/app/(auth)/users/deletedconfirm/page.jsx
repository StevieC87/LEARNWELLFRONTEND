'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileDeleted() {
  const router = useRouter();

  useEffect(() => {

    console.log(process.env.NEXT_PUBLIC_FRONTENDURL, 'NEXT_PUBLIC_FRONTENDURL in profile deleted');

    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'csrfTokenNew=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';


  }, []);


  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Profile Deleted
        </h1>
        <div className="text-xxl text-center mt-5">
          <p >Your profile has been successfully deleted.</p>
          <p >Thank you for using our service.</p>
          <strong>Remember to remove the Javascript Snippet from your website</strong>
          <p >If you have any questions, please contact support. </p>

          <button
            className="ui-btn ui-btn-primary mt-4"
            onClick={() => router.push('/')}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </>
  );

}