'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatNumber } from '../useful/utilites.js'; // Import formatNumber function
import Image from 'next/image';

export default function TopBrowsers({ browserdata, uniquevisitors }) {

  const [browserpercentage, setBrowserPercentage] = useState(0);
  const [updatedBrowserData, setUpdatedBrowserData] = useState([]);

  useEffect(() => {
    if (!browserdata) {
      return;
    }

    //calcualte percentage of each browser
    const totalVisitors = uniquevisitors || 0; // Use uniquevisitors prop or default to 0
    if (totalVisitors === 0) {
      setBrowserPercentage(0);
      return;
    }
    console.log(browserdata, 'browserdata');
    const updatedData = browserdata.map(browser => ({
      ...browser,
      percentage: ((browser.unique_visitors / totalVisitors) * 100).toFixed(2),
    }));
    setUpdatedBrowserData(updatedData);
    console.log(updatedData, 'browserdata222');
  }


    , [browserdata, uniquevisitors]);

  const browserIcon = (browser) => {
    switch (browser) {
      case 'Chrome':
        return <Image src="/images/iconsdash/browser/chrome.png" alt="Chrome" width={16} height={16} />;
      case 'Firefox':
        return <Image src="/images/iconsdash/browser/firefox.png" alt="Firefox" width={16} height={16} />;
      case 'Safari':
        return <Image src="/images/iconsdash/browser/safari.png" alt="Safari" width={16} height={16} />;
      case 'Edge':
        return <Image src="/images/iconsdash/browser/edge.png" alt="Edge" width={16} height={16} />;
      case 'Opera':
        return <Image src="/images/iconsdash/browser/opera.png" alt="Opera" width={16} height={16} />;
      default:

    }
  }



  return (
    <>
      <div className="topvistedpagesouterdiv">
        <div className="topvisitedpagestitles">
          <span className="topvisitedpage-name"></span>
          <span className="topvisitedpage-visits text-center">Unique Visitors</span>
          <span className="topvisitedpage-percentage text-center">%</span>
        </div>
        {updatedBrowserData && updatedBrowserData.map((browser, index) => (
          <div
            key={index}
            className={`topvisitedpage-item ${index % 2 === 0 ? 'even' : 'odd'} items-center`}
          >
            <span className="topvisitedpage-icon mr-2">
              {browserIcon(browser.browser)}
            </span>
            <span className="topvisitedpage-name">{browser.browser}</span>
            <span className="topvisitedpage-visits text-center">{formatNumber(browser.unique_visitors)}</span>
            <span className="topvisitedpage-percentage text-center">{browser.percentage}</span>
          </div>
        ))}
      </div>


    </>
  );
}