'use client';
import '../analytics.css'
import { useEffect, useState } from 'react';
import { formatNumber } from '../useful/utilites.js'; // Import formatNumber function

export default function TopEntryPages({ mostenteredpages }) {

  useEffect(() => {
    console.log(mostenteredpages, 'mostenteredpages in TopEntryPages');
  }, [mostenteredpages]);

  return (
    <>
      <div className="exitedpages">
        <div className="exitedpagestitles">

          <span className="exitedpages-url">Url</span>
          <span className="exitedpages-exitcount">Entry Count</span>
          <span className="exitedpages-exitrate">Entry Rate %</span>
          {/*           <span className="referrer-visits">Returning visits</span>
          <span className="referrer-visits">New visits</span> */}
        </div>
        <div className="referralstuff">
          {mostenteredpages && mostenteredpages.map((mostenteredpage, index) => (
            <div key={index}
              className={`referrer-item ${index % 2 === 0 ? 'even' : 'odd'}`}>

              <span className="exitedpages-url">{mostenteredpage.url}</span>
              <span className="exitedpages-exitcount">{formatNumber(mostenteredpage.entry_count)}</span>

              <span className="exitedpages-exitrate">{mostenteredpage.entry_rate_percent} %</span>
            </div>
          ))}
        </div>

      </div>
    </>
  )

}