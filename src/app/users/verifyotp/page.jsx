'use client';
import { useState } from 'react';

export default function VerifyOTP() {

  const [otp, setOtp] = useState(''); // State to hold the OTP input
  const [otpverifysuccess, setOtpVerifySuccess] = useState(false); // State to hold OTP verification success

  const verifyOTP = async (e) => {
    const fetchpostverify = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verifyotplogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({ otp: otp }),

    }
    );

  }


  return (
    <div className="cardouterdiv">
      <div className="card flex flex-col items-center justify-center bg-gray-100" >

        <div className="">
          <h2 className="text-2xl font-bold pb-7 ">Verify OTP</h2>
          <form onSubmit={() => verifyOTP()} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your OTP"
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