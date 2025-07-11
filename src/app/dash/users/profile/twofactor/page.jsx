'use client';
import { useEffect } from "react"

export default function TwoFactorPage() {

  //HERE WE FETCH THE AUTH CODE, QR STUFF ETC 

  useEffect(() => {
    const fetchfetch = async () => {
      const fetch2factor = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/generatetwofactor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authenticationj
      });

      if (!fetch2factor.ok) {
        console.error('Failed to fetch two-factor authentication data');
        return;
      }
      const data = await fetch2factor.json();
      console.log('Two-factor authentication data:', data);

    }
    fetchfetch();

  }, [])

  return (
    <div>
      <h1>Instructions for setup</h1>
      <p>1) Download an authentication app if you don't have one installed</p>
      <p>2) Scan this barcode/QR code or copy the key</p>


      <p>3) Copy and enter 6-digit code</p>
      <p>After the barcode/QR code has been scanned or the key has been entered, the authentication app will generate a 6-digit code. Enter this code in the input field below to complete the setup.</p>


    </div>
  )
}