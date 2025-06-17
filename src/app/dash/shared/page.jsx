'use client';
import { useState, useEffect } from 'react';

export default function Shared() {

  useEffect(() => {
    const fetchSharedSchemas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shared/getschemas`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data, "Shared Schemas Data");
      } catch (error) {
        console.error('Error fetching shared schemas:', error);
      }
    };

    fetchSharedSchemas();

  }, []);


  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Shared Components</h1>
      <p className="text-gray-600">
        This section allows you to manage shared settings across your application.
      </p>
      {/* Add more shared settings components here */}
    </div>
  );
}