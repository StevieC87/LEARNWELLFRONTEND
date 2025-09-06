'use client';
import { useState, useEffect } from 'react';
import { formatNumber } from '../useful/utilites.js'; // Import formatNumber function

export default function TopSearchEngines(props) {

  const [datayestoshow, setDatayestoshow] = useState([]); // State to hold pie chart data 

  const { selecteddatesMulti, solodate, solodatedate, currentsiteid } = props;

  const [topsearchengines, setTopsearchengines] = useState([]); // State to hold referrals data
  //const [topsocialMedia, setTopsocialMedia] = useState([]); // State to hold social media data


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
    const csrfToken = getCsrfToken(); // Get CSRF token from cookies


    if (!currentsiteid || currentsiteid === '') {
      console.log('No site selected, skipping fetch');
      return;
    }
    if (!selecteddatesMulti || selecteddatesMulti.length === 0) {
      return
    }
    const fetchsearchengines = async () => {
      console.log('fetchsearchtraffic')

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/gettrafficsearchengine`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken, // Include CSRF token in the request headers
          },
          body: JSON.stringify({
            daterange: selecteddatesMulti,
            solodate: solodate,
            solodatedate: solodatedate,
            selectedsite: currentsiteid || '', // Use selectedsite state
            searchorsocial: 'search', // Specify that we want search engines data
          }),
          credentials: 'include', // Include cookies in the request
        });
        console.log(response, 'responsefromgettrafficsearchengine');
        if (!response.ok) {
          console.log('fetchnotok222111aaa');
          return;
        }
        console.log('fetchokokokokok')
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          console.log('No data received from the server');
          setDatayestoshow(false)
          return;
        }
        setDatayestoshow(true)
        console.log(data, 'searchenginesdata');
        //topsearchengines, setTopsearchengines  topsocialMedia, setTopsocialMedia
        setTopsearchengines(data.searchEnginestop || []);

      }
      catch (error) {
        console.log('Error fetching traffic sources:', error);
      }
    };

    fetchsearchengines();

  }, [selecteddatesMulti, solodate, solodatedate, currentsiteid]);

  return (
    <>
      <div className="referralsdiv">
        <div className="referralstitles">

          <span className="referrer-name">Url</span>
          <span className="referrer-visits">Total visits</span>
          {/*           <span className="referrer-visits">Returning visits</span>
          <span className="referrer-visits">New visits</span> */}
        </div>
        <div className="referralstuff">
          {topsearchengines && topsearchengines.map((referrer, index) => (
            <div key={index}
              className={`referrer-item ${index % 2 === 0 ? 'even' : 'odd'}`}>

              <span className="referrer-name">{referrer.referrer}</span>


              <span className="referrer-visits">{formatNumber(referrer.count)}</span>
            </div>
          ))}
        </div>

      </div>

    </>
  )


}