'use client';

import { useEffect } from "react";

export default async function FetchPreview(props) {
  const { lang, pagesslugwithlang } = props;
  let data;

  useEffect(() => {

    const fetchdata = async () => {
      const response = await fetch(`http://localhost:3001/api/proxy?slugpath=${pagesslugwithlang}&language=${lang}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensures fresh data on each request
        credentials: 'include', // Include credentials for cross-origin requests if needed
      });
      if (!response.ok) {
        console.log("Failed to fetch page data");
        //throw new Error("Failed to fetch page data");
      }
      else if (response.ok) {
        console.log('data fetched successfully');
        data = await response.json();
        console.log("Fetchedpagedata:", data);
      }
    }
    fetchdata();


  }, [lang, pagesslugwithlang]);

  return data;
}  