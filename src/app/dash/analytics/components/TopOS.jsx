'use client';

import { useEffect, useState } from 'react';
import { formatNumber } from '../useful/utilites.js'; // Import formatNumber function
import Image from 'next/image';


export default function TopOS({ osdata, uniquevisitors }) {

  const [ospercentage, setosPercentage] = useState(0);
  const [updatedOSData, setUpdatedOSdata] = useState([]);

  useEffect(() => {
    if (!osdata) {
      return;
    }

    //calcualte percentage of each browser
    const totalVisitors = uniquevisitors || 0; // Use uniquevisitors prop or default to 0
    if (totalVisitors === 0) {
      setosPercentage(0);
      return;
    }
    console.log(osdata, 'osdata');
    const updatedData = osdata.map(os => ({
      ...os,
      percentage: ((os.unique_visitors / totalVisitors) * 100).toFixed(2),
    }));
    setUpdatedOSdata(updatedData);
    console.log(updatedData, 'browserdata222');

  }


    , [osdata, uniquevisitors]);

  const osType = (type) => {
    switch (type) {
      case 'Windows':
        return <Image src="/images/iconsdash/os/windows.png" alt="Windows" width={16} height={16} />;
      case 'Mac OS':
        return <Image src="/images/iconsdash/os/macos.png" alt="macOS" width={16} height={16} />;
      case 'Linux':
        return <Image src="/images/iconsdash/os/linux.png" alt="Linux" width={16} height={16} />;
      case 'Android':
        return <Image src="/images/iconsdash/os/android.png" alt="Android" width={16} height={16} />;
      case 'iOS':
        return <Image src="/images/iconsdash/os/ios.png" alt="iOS" width={16} height={16} />;
      default:
        return '';
    }
    return '';
  }


  return (
    <>
      <div className="topvistedpagesouterdiv">
        <div className="topvisitedpagestitles">
          <span className="topvisitedpage-name"></span>
          <span className="topvisitedpage-visits text-center">Unique Visitors</span>
          <span className="topvisitedpage-percentage text-center">%</span>
        </div>
        {updatedOSData && updatedOSData.map((os, index) => (
          <div
            key={index}
            className={`topvisitedpage-item ${index % 2 === 0 ? 'even' : 'odd'} items-center m`}
          >
            <div className="topvisitedpage-icon mr-2">
              {osType(os.os)}
            </div>
            <div className="topvisitedpage-name flex flex-row gap-3 items-center"><span >{os.os}</span></div>
            <div className="topvisitedpage-visits text-center " ><span >{formatNumber(os.unique_visitors)}</span>
            </div>
            <div className="topvisitedpage-percentage text-center" ><span >{os.percentage}</span>
            </div>
          </div>
        ))}
      </div>


    </>
  );
}