'use client'
import MapAnalyticsComponent from "./Map";
import { useEffect, useState } from "react";

export default function Analytics() {
  const [countriesdata, setCountriesData] = useState(null);

  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const response = await fetch('http://localhost:3000/testanalytics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          console.log('fetchnotok');
          return;
        }

        const data = await response.json();
        console.log(data, 'data');
        console.log(data.data, 'data.data');
        setCountriesData(data.data || {}); // Use data.data if it exists, 
        console.log(typeof countriesdata, 'typeof data.message');

      } catch (error) {
        console.error('Error fetching countries data:', error);
      }
    };

    fetchCountriesData();

  }, []);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Analytics</h1>
      <p className="text-lg">This is the analytics page.</p>
      <div className="mt-8 fade-in mapsdiv">
        {countriesdata && Object.keys(countriesdata).length > 0 ? (
          <MapAnalyticsComponent countriesdata={countriesdata} />
        ) : (
          <div className="text-red-500">
            No data available for the map.
          </div>
        )}

      </div>
    </div>
  );
}