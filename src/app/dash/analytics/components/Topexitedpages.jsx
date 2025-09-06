'use client';
import '../analytics.css'
import { useEffect, useState } from 'react';
import { formatNumber } from '../useful/utilites.js'; // Import formatNumber function

export default function Topexitedpages({ mostexitedpages }) {


  useEffect(() => {

  }, [mostexitedpages]);

  return (
    <>
      <div className="exitedpages">
        <div className="exitedpagestitles">

          <span className="exitedpages-url">Url</span>
          <span className="exitedpages-exitcount">Exit Count</span>
          <span className="exitedpages-totalvisits">Total visits</span>
          <span className="exitedpages-exitrate">Exit Rate %</span>
          {/*           <span className="referrer-visits">Returning visits</span>
          <span className="referrer-visits">New visits</span> */}
        </div>
        <div className="referralstuff">
          {mostexitedpages && mostexitedpages.map((mostexitedpage, index) => (
            <div key={index}
              className={`referrer-item ${index % 2 === 0 ? 'even' : 'odd'}`}>

              <span className="exitedpages-url">{mostexitedpage.url}</span>
              <span className="exitedpages-exitcount">{formatNumber(mostexitedpage.exit_count)}</span>
              <span className="exitedpages-totalvisits">{formatNumber(mostexitedpage.total_views)}</span>
              <span className="exitedpages-exitrate">{mostexitedpage.exit_rate_percent} %</span>
            </div>
          ))}
        </div>

      </div>
    </>
  )

}