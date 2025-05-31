'use client'; //FOR NOW QUICKLY
import { useEffect } from 'react';
export default function Dash() {


  /*   useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3000/testcsrf', {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          //   const data = await response.json();
          //  console.log(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
  
    }, []) */


  return (
    <div>
      I am the dash, you are logged in
    </div>
  )

}

