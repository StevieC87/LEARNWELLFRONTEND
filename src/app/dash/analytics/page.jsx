'use client'
import MapAnalyticsComponent from "./Map";
import { useEffect, useState } from "react";
import Datepicker from './datepicker/Datepicker.jsx';
import ChartVisitsFilter from "./ChartVisitsFilter.jsx";
import './datepicker/Datepicker.css'
import './analytics.css';

export default function Analytics() {
  const [countriesdata, setCountriesData] = useState(null);

  //. FOR DATEPICKER ----------------------
  const [multiple, setMultiple] = useState('range'); //yes or range for range or  empty string for single date selection
  const [selecteddate, setSelecteddate] = useState('');
  const [selecteddatesMulti, setSelecteddatesMulti] = useState([]);
  const [usersbymonth, setUsersByMonth] = useState([]);

  const [startdate, setStartDate] = useState(new Date()); // Set initial start date to today
  const [enddate, setEndDate] = useState('');

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
  //set default dates (7 days)

  useEffect(() => {
    const today = new Date();

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(startdate.getDate() - 7);
    setStartDate(sevenDaysAgo); // Set start date to 7 days ago
    setEndDate(today); // Set end date to today

    let geteverydaybetweenandincluding = [];
    let i = 0;
    for (i == 0; i <= 7; i++) {
      const d = new Date(sevenDaysAgo);

      d.setDate(d.getDate() + i);
      console.log(d, 'dddddddddddddddddddddddd222');
      const formattedDate = d.toISOString().split('T')[0]; // Format as YYYY-MM-DD

      geteverydaybetweenandincluding.push(formattedDate);
    }
    console.log(geteverydaybetweenandincluding, 'geteverydaybetweenandincluding');
    setSelecteddatesMulti(geteverydaybetweenandincluding); // Set the initial state with the last 7 days

  }, []);


  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/testanalytics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            daterange: selecteddatesMulti
          }),
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
        setUsersByMonth(data.userByMonth || []); // Use data.userByMonth if it exists
        console.log(data.userByMonth, 'data.userByMonth');
        setTotalUsersDataRange(data.visitorseachday || []); // Use data.visitorseachday if it exists
      } catch (error) {
        console.error('Error fetching countries data:', error);
      }
    };

    fetchCountriesData();

  }, [selecteddatesMulti]);

  const [initialpage, setInitialpage] = useState(true);
  const [secondtab, setSecondtab] = useState(false);
  const [jsonldvisible, setJsonLdVisible] = useState(false);
  const [schematype, setSchemaType] = useState('Blog'); // Default schema type

  const [totalusersdatarange, setTotalUsersDataRange] = useState([]);

  return (
    <>
      {/*    {selecteddatesMulti.map((date) => (
        <span key={date}>{date}</span>
      ))} */}
      <div className="flex flex-col h-screen">
        <h1 className="text-4xl font-bold mb-4">Analytics</h1>
        <div /* className={`editpagecontainer fade-in2 `} */>
          <div className="formtabs flex flex-row">
            <button onClick={(e) => toggleTabs('pagecontent')} className={`${initialpage ? 'activetab' : ''} button button-outline tabbutton`}>Analytics</button>
            <button onClick={(e) => toggleTabs('seocontent')} className={`${secondtab ? 'activetab' : ''} button button-outline tabbutton`}>Charts</button>
            {(schematype === 'Blog' || schematype === 'Article') && (
              <button onClick={(e) => toggleTabs('jsonld')} className={`${jsonldvisible ? 'activetab' : ''} button button-outline tabbutton`}>More analytics</button>
            )}
          </div>

          <div id="pagecontent" className={`pagecontent ${initialpage ? 'visible' : 'hidden'}`}>
          </div>
        </div>
        <div className="datecontrols flex flex-row gap-2" >
          {/*     {selecteddatesMulti.length > 0 && ( */}
          <Datepicker onDateChange={handleDateChange}
            dateprop={(multiple === 'yes' || multiple === 'range') ? selecteddatesMulti : selecteddate}
            multipleprop={multiple} format="DDMMYYYY"
            displaya=""
            weekstartssunday={false}

          />
          {/*     )} */}
          <button className="button button-primary">Last 7 days</button>
          <button className="button button-outline">Last 30 days</button>
          <button className="button button-outline">All time</button>
        </div>
        <ChartVisitsFilter data={totalusersdatarange} />
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


    </>

  );
}