'use client';
import { useEffect, useState, useRef } from "react"
import QRCode from 'qrcode'
import { set } from "react-hook-form";

export default function TwoFactorPage() {
  const qrRef = useRef()
  //HERE WE FETCH THE AUTH CODE, QR STUFF ETC 
  const [manualEntryKey, setManualEntryKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [otp, setOtp] = useState(''); // State to hold the OTP input
  const [otpverifysuccess, setOtpVerifySuccess] = useState(''); // State to hold OTP verification success

  useEffect(() => {

    function getCsrfToken() {
      if (typeof document !== 'undefined') {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith('csrfToken='))
          ?.split('=')[1];
      }
      return null; // Return null if running on the server
    }

    // Usage:
    const csrfToken = getCsrfToken();
    console.log(object)

    const fetchfetch = async () => {
      const fetch2factor = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/generatetwofactor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRF-Token": csrfToken
        },
        credentials: 'include', // Include cookies for authenticationj
      });

      if (!fetch2factor.ok) {
        console.log('Failed to fetch two-factor authentication data');
        return;
      }
      const data = await fetch2factor.json();
      console.log('Two-factor authentication data:', data);
      qrRef.current && QRCode.toCanvas(qrRef.current, data.qr, { errorCorrectionLevel: 'H' })
      setManualEntryKey(data.manualEntryKey); // Assuming data.manualEntryKey contains the manual entry key

    }
    fetchfetch();

  }, [])


  const verifyOTP = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const fetchpostverify = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verifyotp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({ otp: otp }),
    });
    if (!fetchpostverify.ok) {
      console.log('Failed to verify OTP');
      setOtpVerifySuccess('false');
      return;
    }
    const data = await fetchpostverify.json();
    console.log('OTP verification response:', data);
    if (data.verified === true) {
      setOtpVerifySuccess('true');

    }
  }

  return (
    <div className="m-5">
      <h1 className="pb-10">Instructions for setup</h1>
      <div className="mt-6">
        <strong>1) Download an authentication app if you don't have one installed</strong>
      </div>
      <div className="mt-6">  <strong>2) Scan this QR code or copy the key</strong>

        <p>Scan this QR code in the authentication app or copy the key and paste it in the authentication app</p>
        <div className="flex justify-center mt-3"><canvas ref={qrRef}></canvas></div>
        <div className="break-word"><strong>Key: </strong>{manualEntryKey}</div>
        <div className="flex justify-center">
          <strong onClick={() => {
            setCopied(true);
            navigator.clipboard.writeText(manualEntryKey);
            setTimeout(() => {
              setCopied(false);
            }, 2000); // Reset copied state after 2 seconds

          }} className="button button-outline button-thin">    {copied ? 'Copied' : 'Copy key'}</strong>
        </div>
      </div>
      <div className="mt-6">
        <strong >3) Copy and enter 6-digit code</strong>
        <p>After the barcode/QR code has been scanned or the key has been entered, the authentication app will generate a 6-digit code. Enter this code in the input field below to complete the setup.</p>
      </div>

      <div className="flex flex-row justify-center mt-6 gap-4">

        <input
          type="text"
          placeholder="Enter 6-digit code"
          className="input input-bordered sixdigitinput"

          onChange={(e) => setOtp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              verifyOTP(e);
            }
          }}
        />
        <button onClick={(e) => verifyOTP(e)} className="button button-primary">Verify</button>


      </div>
      <div>{otpverifysuccess === 'true' && (
        <span className="text-green-500">OTP Verified</span>
      )}
        {otpverifysuccess === 'false' && (
          <span className="text-red-500">OTP Verification Failed</span>
        )}
      </div>

    </div >
  )
}