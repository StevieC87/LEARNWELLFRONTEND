'use client';

import { useEffect, useState } from 'react';
import { formatNumber } from '../useful/utilites';
import Image from 'next/image';

export default function TopDevices({ devicedata, uniquevisitors }) {

  const [devicepercentage, setdevicePercentage] = useState(0);
  const [updatedDeviceData, setUpdatedDeviceData] = useState([]);

  useEffect(() => {
    if (!devicedata) {
      return;
    }

    //calcualte percentage of each browser
    const totalVisitors = uniquevisitors || 0; // Use uniquevisitors prop or default to 0
    if (totalVisitors === 0) {
      setdevicePercentage(0);
      return;
    }
    console.log(devicedata, 'devicedata');
    const updatedData = devicedata.map(device => ({
      ...device,
      percentage: ((device.unique_visitors / totalVisitors) * 100).toFixed(2),
    }));
    setUpdatedDeviceData(updatedData);
    console.log(updatedData, 'browserdata222');

  }


    , [devicedata, uniquevisitors]);

  const deviceType = (type) => {
    switch (type) {
      case 'Mobile':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-phone" viewBox="0 0 16 16">
          < path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
        </svg >
      case 'Tablet':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tablet" viewBox="0 0 16 16">
          <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
        </svg>
      case 'Desktop':
        return <Image src="/images/iconsdash/device/desktop.png" alt="Desktop Icon" width={16} height={16} className="desktop-icon" />


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
        {updatedDeviceData && updatedDeviceData.map((device, index) => (
          <div
            key={index}
            className={`topvisitedpage-item ${index % 2 === 0 ? 'even' : 'odd'}`}
          >

            <div className="topvisitedpage-name flex flex-row gap-3 items-center">{deviceType(device.device_type)}<span >{device.device_type}</span></div>
            <div className="topvisitedpage-visits text-center " ><span >{formatNumber(device.unique_visitors)}</span>
            </div>
            <div className="topvisitedpage-percentage text-center" ><span >{device.percentage}</span>
            </div>
          </div>
        ))}
      </div>


    </>
  );
}