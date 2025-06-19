'use client'
import MapAnalyticsComponent from "./Map";
import { useEffect, useState } from "react";
import Datepicker from './datepicker/Datepicker.jsx';
// 
import './datepicker/Datepicker.css'
export default function Analytics() {
  const [countriesdata, setCountriesData] = useState(null);

  //. FOR DATEPICKER ----------------------
  const [multiple, setMultiple] = useState('range'); //yes or range for range or  empty string for single date selection
  const [selecteddate, setSelecteddate] = useState('');
  const [selecteddatesMulti, setSelecteddatesMulti] = useState([]);
  const handleDateChange = (newdate) => {
    console.log('newdate in handleDateChange', newdate)
    console.log(typeof newdate, 'typeof newdate')
    if (typeof newdate === 'object') {
      console.log('newdate is object');
      //  alert('newdate is object')
      //setSelecteddate(newdate);
      //setSelecteddatesMulti(prevState => [...prevState, newdate]);
      setSelecteddatesMulti(newdate);
    }
    else {
      //  alert('newdate is string');
      console.log(newdate, 'newdate in handleDateChange');
      //setDatepropDatepicker(newdate);
      setSelecteddate(newdate);
    }
  }
  //. -------------------------------------
  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/testanalytics`, {
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
    <div className="flex flex-col items-center  h-screen">
      <h1 className="text-4xl font-bold mb-4">Analytics</h1>
      <Datepicker onDateChange={handleDateChange}
        dateprop={multiple == 'yes' ? selecteddatesMulti : selecteddate}
        multiple={multiple} /* format="MMDDYYYY" */ format="DDMMYYYY"
        displaya=""
      />
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