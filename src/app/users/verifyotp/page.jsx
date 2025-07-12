'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function VerifyOTP() {
  const router = useRouter(); // Initialize the Next.js router for navigation
  const searchParams = useSearchParams(); // Get the search parameters from the URL]
  const verifyotp = searchParams.get('verifyotp'); // Get the 'verifyotp' parameter from the URL
  const [otp, setOtp] = useState(''); // State to hold the OTP input
  const [otpverifysuccess, setOtpVerifySuccess] = useState(false); // State to hold OTP verification success

  const verifyOTP = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const fetchpostverify = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verifyotplogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({ otp: otp }),
    }
    );
    if (!fetchpostverify.ok) {
      console.log('Failed to verify OTP');
      // setOtpVerifySuccess(false);
      return;
    }
    const data = await fetchpostverify.json();
    console.log('OTP verification response:', data);
    if (data.success === true) {
      // setOtpVerifySuccess('true');
      router.push('/dash'); // Redirect to the home page or any other page after successful verification
      // Optionally, redirect or perform other actions on successful verification
    } else {
      setOtpVerifySuccess('false');
    }

  }


  return (
    <div className="cardouterdiv">
      <div className="card flex flex-col items-center justify-center bg-gray-100" >

        <div className="">
          <h2 className="text-2xl font-bold pb-7 ">Verify OTP</h2>
          <form onSubmit={(e) => verifyOTP(e)} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your OTP from your Authenticator app"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full button button-primary"
            >
              Verify OTP
            </button>
          </form>
          {otpverifysuccess && (
            <p className={`mt-4 ${otpverifysuccess === 'true' ? 'text-green-500' : 'text-red-500'}`}>
              {otpverifysuccess === 'true' ? 'OTP verified successfully!' : 'OTP verification failed.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}