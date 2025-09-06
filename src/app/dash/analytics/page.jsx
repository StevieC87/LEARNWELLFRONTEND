'use client'
import MapAnalyticsComponent from "./components/Map.jsx";
import { useEffect, useState, useRef } from "react";
import Datepicker from './datepicker/Datepicker.jsx';
import ChartVisitsFilter from "./ChartVisitsFilter.jsx";
import './datepicker/Datepicker.css'
import './analytics.css';
import { set } from "react-hook-form";
import TopReferrers from "./components/Topreferrers.jsx";
import { useSelector } from 'react-redux';
// import SiteSelection from '@/app/dash/sites/SiteSelection.jsx'; // 

import { formatNumber } from './useful/utilites.js'; // Import formatNumber function
import HoursandWeeks from './components/HoursAndWeekdays.jsx'
import TopPagesCombo from './components/TopPagesCombo.jsx'; // Import TopPagesCombo component
import TopDeviceCombo from './components/TopDeviceCombo.jsx'; // Import TopDeviceCombo component
import CountryFilter from "./useful/FilterChip.jsx";

export default function Analytics() {


  //. FOR DATEPICKER ----------------------
  const [multiple, setMultiple] = useState('range'); //yes or range for range or  empty string for single date selection
  const [selecteddate, setSelecteddate] = useState('');
  const [selecteddatesMulti, setSelecteddatesMulti] = useState([]);
  const [startdate, setStartDate] = useState(new Date(Date.now())); // Ensure UTC time
  const [enddate, setEndDate] = useState('');
  const [countriesdata, setCountriesData] = useState([]); // Initialize countriesdata state
  const [bouncerate, setBounceRate] = useState(0);
  const [solodate, setSoloDate] = useState(false); // For single date selection
  const [solodatedate, setSoloDateDate] = useState(''); // For single date selection
  const [customdates, setCustomDates] = useState(false); // For custom date range selection
  //newstuff
  const [totalpageviews, setTotalPageViews] = useState(0);
  const [totaluniquevisitorscount, setTotalUniqueVisitorsCount] = useState(0);
  const [totalvisitscount, setTotalVisitsCount] = useState(0);
  const [pagespervisit, setPagesPerVisit] = useState(0); // For pages per visit
  const [getaveragevisitduration, setGetAverageVisitDuration] = useState(0); // For average visit duration

  const [linecharttotalusers, setLineChartTotalUsers] = useState([]); // For line chart total users data
  const [referrals, setReferrals] = useState([]); // For referrals data
  const [mostvisitedpages, setMostVisitedPages] = useState([]); // For most visited pages data
  const [opendatepickercustom, setOpenDatePickerCustom] = useState(false);
  const [selectedValue, setSelectedValue] = useState("7days");
  const [activevisitors, setActiveVisitors] = useState([]); // For active visitors data

  const [arraysitesobject, setArraySitesObject] = useState([]); // For storing user sites list
  //const [selectedsite, setSelectedSite] = useState(''); // For selected site
  // const currentsiteid = useSelector((state) => state.AnalyticsSlice.currentsiteid);
  const currentsiteid = 1;
  const [mostexitedpages, setMostExitedPages] = useState([]); // For most exited pages data
  const [browserdata, setBrowserData] = useState(''); // For browser data
  const [osdata, setOSData] = useState(''); // For OS data
  const [devicedata, setDeviceData] = useState(''); // For device data
  const [weekdaystraffic, setWeekdaysTraffic] = useState([]); // For weekdays traffic data
  const [hoursofdaytraffic, setHoursofDayTraffic] = useState([]); // For hours of day traffic dataS


  const [totalpageviewschart, setTotalPageViewsChart] = useState([]); // For total page views chart data

  const [linechartmetric, setLineChartMetric] = useState('uniquevisitors'); // For line chart metric selection
  const [linechartdata, setLineChartData] = useState([]); // For line chart data
  const [linechartjustoneday, setLineChartJustOneDay] = useState(false); // For line chart single day mode
  const [mostenteredpages, setMostEnteredPages] = useState([]); // For most entered pages data

  const countryfilter = useSelector((state) => state.AnalyticsSlice.countryfilter); // Get country filter from Redux store

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

  const handleDateChange = (newdate) => {
    console.log('newdate in handleDateChange', newdate)
    console.log(typeof newdate, 'typeof newdate')
    setCustomDates(true); // Reset custom dates state

    if (typeof newdate === 'object') {
      console.log('newdate is object');
      //  alert('newdate is object')
      //setSelecteddate(newdate);
      //setSelecteddatesMulti(prevState => [...prevState, newdate]);
      if (newdate.length === 1) {

        setSoloDate(true); // Set solo date mode
        setSoloDateDate(newdate[0]); // Set the solo date
      }
      setSelecteddatesMulti(newdate);
    }
    else {
      //  alert('newdate is string');
      console.log(newdate, 'newdate in handleDateChange');
      //setDatepropDatepicker(newdate);
      setSelecteddate(newdate);
    }
  }

  useEffect(() => {

    const today = new Date(Date.now()); // Ensure UTC time
    const sevenDaysAgo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 7));
    setStartDate(sevenDaysAgo); // Set start date to 7 days ago
    setEndDate(today); // Set end date to today

    let geteverydaybetweenandincluding = [];
    let i = 0;
    for (i == 0; i <= 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const formattedDate = d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      geteverydaybetweenandincluding.push(formattedDate);
    }
    console.log(geteverydaybetweenandincluding, 'geteverydaybetweenandincluding');
    setSelecteddatesMulti(geteverydaybetweenandincluding); // Set the initial state with the last 7 days




  }, []);

  useEffect(() => {

    const fetchCountriesData = async () => {
      if (!selecteddatesMulti || selecteddatesMulti.length === 0) {
        return
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/getanalyticsaw`, {
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
            countryfilter: countryfilter, // Use country filter from Redux store
          }),
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          console.log('fetchnotok');
          return;
        }

        const data = await response.json();
        console.log(data, 'data');
        //         setCountriesData(data.data)
        // totalvisitspercountry: totalvisitspercountry,
        // uniquevisitspercountry: uniquevisitspercountry,
        setTotalPageViews(data.totalpageviews || 0); // Use data.totalpageviews if it exists
        setTotalUniqueVisitorsCount(data.totaluniquevisitors || 0); // Use data.totaluniquevisitors if it exists
        setTotalVisitsCount(data.totalvisits || 0); // Use data.totalvisits if it exists
        console.log(data.countriesdata, 'data.countriesdata');
        setCountriesData(data.countriesdata || []); // Use data.totalvisitspercountry if it exists
        setPagesPerVisit(data.pagespervisit || 0); // Use data.pagespervisit if it exists
        console.log(data.bouncerate, 'data.bouncerate');
        setBounceRate(data.bouncerate || 0);
        setGetAverageVisitDuration(data.getaveragevisitduration || 0); // Use data.getaveragevisitduration if it exists

        //  setLineChartTotalUsers(data.totalvisitslinechartdata || []);
        //setLineChartData(data.totalvisitslinechartdata || []); // Use data.linechartdata if it exists
        console.log(data.getreferrers, 'data.getreferrers11111111');
        setReferrals(data.getreferrers || []); // Use data.getreferrers if it exists
        console.log(data.topvisitedpages, 'mostvisitedpages');
        setMostVisitedPages(data.topvisitedpages)
        setMostExitedPages(data.mostexitedpages || []); // Use data.mostexitedpages if it exists
        console.log(data.mostexitedpages, 'mostexitedpages');
        setBrowserData(data.getbrowserdata || ''); // Use data.browserdata if it exists
        setOSData(data.getosdata || ''); // Use data.osdata if it exists
        console.log(data.getdevicedata, 'getdevicedata');
        setDeviceData(data.getdevicedata || ''); // Use data.devicedata if it exists
        console.log(data, 'data from fetchCountriesData');
        setWeekdaysTraffic(data.getdaysofweek || []); // Use data.getdaysofweek if it exists
        console.log(data.getdaysofweek, 'getdaysofweek');
        setHoursofDayTraffic(data.gethoursofday || []); // Use data.gethoursofday if it exists
        console.log(data.gethoursofday, 'gethoursofday');

        setMostEnteredPages(data.getmostenteredpages || []); // Use data.getmostenteredpages if it exists

      } catch (error) {
        console.log('Error fetching countries data:', error);
      }
    };
    if (currentsiteid) {
      fetchCountriesData();
    }
  }, [selecteddatesMulti, currentsiteid, countryfilter]);




  const selectchangefilterdates = (e) => {
    const value = e.target.value;
    console.log(value, 'value in selectchangefilterdates');

    if (value === '7days') {
      setCustomDates(false);
      const today = new Date(Date.now()); // Ensure UTC time
      const sevenDaysAgo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 7));
      setStartDate(sevenDaysAgo);
      setEndDate(today);
      //get dates in between
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
      setSelectedValue('7days'); // Update selected value
    }
    //today yesterday  14days 60days 90days
    else if (value === 'yesterday') {
      setCustomDates(false);
      const today = new Date(Date.now()); // Ensure UTC time
      const yesterday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 1));
      setStartDate(yesterday);
      setEndDate(yesterday);
      setSelecteddatesMulti([yesterday.toISOString().split('T')[0]]);
      setSelectedValue('yesterday'); // Update selected value
    }
    else if (value === 'today') {
      setCustomDates(false);
      const today = new Date(Date.now()); // Ensure UTC time
      setStartDate(today);
      setEndDate(today);
      setSelecteddatesMulti([today.toISOString().split('T')[0]]);
      setSelectedValue('today'); // Update selected value
    }
    else if (value === '14days') {
      setCustomDates(false);

      const today = new Date(Date.now()); // Ensure UTC time
      const fourteenDaysAgo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 14));
      setStartDate(fourteenDaysAgo);
      setEndDate(today);
      //get dates in between
      let geteverydaybetweenandincluding = [];
      let i = 0;
      for (i == 0; i <= 14; i++) {
        const d = new Date(fourteenDaysAgo);
        d.setDate(d.getDate() + i);
        console.log(d, 'dddd  dddddddddddddddddddddddd222');
        const formattedDate = d.toISOString().split('T')[0]; // Format as YYYY  -MM-DD  
        geteverydaybetweenandincluding.push(formattedDate);
      }
      console.log(geteverydaybetweenandincluding, 'geteverydaybetweenandincluding');
      setSelecteddatesMulti(geteverydaybetweenandincluding);
      setSelectedValue('14days'); // Update selected value
    }
    else if (value === '60days') {
      setCustomDates(false);

      const today = new Date(Date.now());

      const sixtyDaysAgo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 60));
      setStartDate(sixtyDaysAgo);
      setEndDate(today);
      //get dates in between
      let geteverydaybetweenandincluding = [];
      let i = 0;
      for (i == 0; i <= 60; i++) {
        const d = new Date(sixtyDaysAgo);
        d.setDate(d.getDate() + i);
        console.log(d, 'dddddddddddddddddddddddd222');
        const formattedDate = d.toISOString().split('T')[0];
        // Format as YYYY-MM-DD
        geteverydaybetweenandincluding.push(formattedDate);
      }
      console.log(geteverydaybetweenandincluding, 'geteverydaybetweenandincluding');
      setSelecteddatesMulti(geteverydaybetweenandincluding);
      setSelectedValue('60days'); // Update selected value
    }
    else if (value === '90days') {
      setCustomDates(false);

      const today = new Date(Date.now());
      const ninetyDaysAgo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 90));
      setStartDate(ninetyDaysAgo);
      setEndDate(today);
      //get dates in between
      let geteverydaybetweenandincluding = [];
      let i = 0;
      for (i == 0; i <= 90; i++) {
        const d = new Date(ninetyDaysAgo);
        d.setDate(d.getDate() + i);
        console.log(d, 'dddddddddddddddddddddddd222');
        const formattedDate = d.toISOString().split('T')[0];
        // Format as YYYY-MM-DD
        geteverydaybetweenandincluding.push(formattedDate);
      }
      console.log(geteverydaybetweenandincluding, 'geteverydaybetweenandincluding');
      setSelecteddatesMulti(geteverydaybetweenandincluding);
      setSelectedValue('90days'); // Update selected value
    }
    else if (value === '30days') {
      setCustomDates(false);

      const today = new Date(Date.now());
      const thirtyDaysAgo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 30));
      setStartDate(thirtyDaysAgo);
      setEndDate(today);
      //get dates in between
      let geteverydaybetweenandincluding = [];
      let i = 0;
      for (i == 0; i <= 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(d.getDate() + i);
        console.log(d, 'dddddddddddddddddddddddd222');
        const formattedDate = d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        geteverydaybetweenandincluding.push(formattedDate);
      }
      console.log(geteverydaybetweenandincluding, 'geteverydaybetweenandincluding');
      setSelecteddatesMulti(geteverydaybetweenandincluding); // Set the initial state with the last 30 days
      setSelectedValue('30days'); // Update selected value
    }
    else if (value === '180days') {
      setCustomDates(false);

      const today = new Date(Date.now());
      const sixMonthsAgo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 180));
      setStartDate(sixMonthsAgo);
      setEndDate(today);
      //get dates in between
      let geteverydaybetweenandincluding = [];
      let i = 0;
      for (i == 0; i <= 180; i++) {
        const d = new Date(sixMonthsAgo);
        d.setDate(d.getDate() + i);
        console.log(d, 'dddddddddddddddddddddddd222');
        const formattedDate = d.toISOString().split('T')[0];
        // Format as YYYY-MM-DD
        geteverydaybetweenandincluding.push(formattedDate);
      }
      console.log(geteverydaybetweenandincluding, 'geteverydaybetweenandincluding');
      setSelecteddatesMulti(geteverydaybetweenandincluding);
      setSelectedValue('180days'); // Update selected value
    }
    else if (value === 'thisyear') {
      setCustomDates(false);
      const today = new Date(Date.now());
      console.log(today, 'today1111111111111');
      const startOfYear = new Date(Date.UTC(today.getUTCFullYear(), 0, 1)); // First day of the current year in UTC
      console.log(startOfYear, 'startOfYear1111111');
      setStartDate(startOfYear);
      setEndDate(today);

      // Generate dates between startOfYear and today (UTC)
      let geteverydaybetweenandincluding = [];
      const daysInYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)); // Calculate days difference

      console.log(daysInYear, 'daysInYear111111111');
      for (let i = 0; i <= daysInYear; i++) {
        const d = new Date(startOfYear.getTime());
        d.setUTCDate(d.getUTCDate() + i); // Increment the new Date object in UTC
        const formattedDate = d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        geteverydaybetweenandincluding.push(formattedDate);
      }


      console.log(geteverydaybetweenandincluding, 'geteverydaybetweenandincluding');
      setSelecteddatesMulti(geteverydaybetweenandincluding);
      setSelectedValue('thisyear'); // Update selected value
    }

    else if (value === 'alltime') {
      setCustomDates(false);
      let startdatealltime = new Date(Date.UTC(2025, 0, 1)); // Ensure UTC time for all-time start date
      let enddate = new Date(); // Set end date to today
      let geteverydaybetweenandincluding = [];
      //let countday today since startdate 
      let daysdifference = Math.floor((enddate - startdatealltime) / (1000 * 60 * 60 * 24));
      let i = 0;
      for (i == 0; i <= daysdifference; i++) {
        const d = new Date(startdatealltime);
        d.setDate(d.getDate() + i);
        console.log(d, 'dddddddddddddddddddddddd222');
        const formattedDate = d.toISOString().split('T')[0];
        // Format as YYYY-MM-DD
        geteverydaybetweenandincluding.push(formattedDate);
      }
      console.log(geteverydaybetweenandincluding, 'geteverydaybetweenandincluding');
      setSelecteddatesMulti(geteverydaybetweenandincluding);
      setStartDate(startdatealltime);
      setEndDate(enddate);
      setSelectedValue('alltime'); // Update selected value
    }
    else if (value === 'custom') {
      //open modal
      console.log('open custom date range modal');
      setOpenDatePickerCustom(true);
      setCustomDates(true); // Set custom dates state to true

    }
  }

  //,for fetchign active users
  const fetchActiveUsers = useRef(() => { });
  fetchActiveUsers.current = async () => {
    let fetchactive = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/activevisitors?siteid=${currentsiteid}&country=${countryfilter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    });

    console.log(fetchactive, 'fetchactive in fetchActiveUsers');
    if (!fetchactive.ok) {
      console.log('fetchactive not ok');
      return;
    }
    let data = await fetchactive.json();
    console.log(data, 'data from fetchActiveUsers');
    setActiveVisitors(data.activeVisitors || []); // Use data.activevisitors if it exists
    // Fetch active users from the API
  }


  useEffect(() => {
    if (!currentsiteid) {
      return;
    }
    fetchActiveUsers.current(); // Initial fetch
    const id = setInterval(() => {
      fetchActiveUsers.current();
    }, 30000); // 30 seconds
    return () => clearInterval(id);
  }, [currentsiteid, countryfilter]);


  useEffect(() => {
    const asyncfetchlinechartdata = async () => {
      console.log(selecteddatesMulti, 'selecteddatesMultiinasyncfetchlinechartdata');
      //   const fetchlinechartdatadepends = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/linechartdata`, {
      const fetchlinechartdatadepends = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Include CSRF token in the request headers
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({
          siteid: currentsiteid,
          metric: linechartmetric,
          daterange: selecteddatesMulti,
          solodate: solodate,
          solodatedate: solodatedate,
          selectedsite: currentsiteid || '', // Use selectedsite state
        })
      });
      if (!fetchlinechartdatadepends.ok) {
        console.log('fetchlinechartdatadepends not ok');
        return;
      }
      const data = await fetchlinechartdatadepends.json();
      console.log(data, 'data from fetchlinechartdatadepends');
      if (data) {
        setLineChartData(data || []); // Use data.linechartdata if it exists

      }
    }
    if (!currentsiteid) {
      return;
    }
    asyncfetchlinechartdata();
    if (selecteddatesMulti.length === 1) {
      setLineChartJustOneDay(true); // Set to true if only one date is selected
    }
    else if (selecteddatesMulti.length > 1) {
      setLineChartJustOneDay(false); // Set to false if multiple dates are selected
    }

  }, [linechartmetric, selecteddatesMulti, currentsiteid]);

  return (
    <>

      <div className="analyticsoutderflexdiv">

        <h1 className="text-4xl font-bold mb-4">Analytics</h1>
        <div className="datecontrols " >

          {/*   <SiteSelection /> */}
          <Datepicker onDateChange={handleDateChange}
            dateprop={(multiple === 'yes' || multiple === 'range') ? selecteddatesMulti : selecteddate}
            multipleprop={multiple} format="DDMMYYYY"
            displaya=""
            weekstartssunday={false}
            open={opendatepickercustom}
          />

          <select name="" id="" onChange={(e) => selectchangefilterdates(e)}
            value={customdates ? "custom" : selectedValue}
            className="datefilterselect"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days" >Last 7 days</option>
            <option value="14days">Last 14 days</option>
            <option value="30days">Last 30 days</option>
            <option value="60days">Last 60 days</option>
            <option value="90days">Last 90 days</option>
            <option value="180days">Last 6 months</option>
            <option value="thisyear">This year</option>
            <option value="alltime">All time</option>
            <option value="custom">Custom Date Range</option>
          </select>
          <div>{activevisitors === '0' ? (
            <span>{activevisitors} active visitors</span>
          ) : activevisitors === '1' ? (
            <span className="text-green-500">{formatNumber(activevisitors)} active visitor</span>
          ) : (
            <span className="text-green-500">{formatNumber(activevisitors)} active visitors</span>
          )}
          </div>
          <CountryFilter country={countryfilter} />

        </div>
        {/*   const { selecteddatesMulti, solodate, solodatedate, currentsiteid } = props; */}


        <ChartVisitsFilter data={linechartdata} metric={linechartmetric}
          linechartjustoneday={linechartjustoneday}
        />
        <div id="analyticsquickdatadiv card analyticscard" className="analyticsquickdatadiv">
          <div className="analyticsquickdataboxes flex flex-row gap-4 card">
            <div className="analyticsquickdatabox flex flex-col cursor-pointer" onClick={() => {
              setLineChartMetric('uniquevisitors');
            }}>
              <span className={`${linechartmetric == 'uniquevisitors' ? 'activecharttext' : 'inactivecharttext'} analyticsquickdataboxlabel`}>Unique Visitors</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">
                {formatNumber(totaluniquevisitorscount)}</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col cursor-pointer" onClick={() => {
              setLineChartMetric('totalvisits');
            }}>
              <span className={`${linechartmetric == 'totalvisits' ? 'activecharttext' : 'inactivecharttext'} analyticsquickdataboxlabel`}>Visits</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{formatNumber(totalvisitscount)}</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col  cursor-pointer" onClick={() => {
              setLineChartMetric('totalpageviews');
            }}>
              <span className={`${linechartmetric == 'totalpageviews' ? 'activecharttext' : 'inactivecharttext'} analyticsquickdataboxlabel`}>Pageviews</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{formatNumber(totalpageviews)}</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col  cursor-pointer" onClick={() => {
              setLineChartMetric('averagevisitduration');
            }}>
              <span className={`${linechartmetric == 'averagevisitduration' ? 'activecharttext' : 'inactivecharttext'} analyticsquickdataboxlabel`}>Avg. Session Duration</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{getaveragevisitduration}</span>
            </div>

            <div className="analyticsquickdatabox flex flex-col  cursor-pointer" onClick={() => {
              setLineChartMetric('bouncerate');
            }}>
              <span className={`${linechartmetric == 'bouncerate' ? 'activecharttext' : 'inactivecharttext'} analyticsquickdataboxlabel`}>Bounce Rate</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold
">{bouncerate}%</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col  cursor-pointer" onClick={() => {
              setLineChartMetric('pagespervisit');
            }}>
              <span className={`${linechartmetric == 'pagespervisit' ? 'activecharttext' : 'inactivecharttext'} analyticsquickdataboxlabel`}>Pages / Visits</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{pagespervisit}</span>
            </div>
          </div>
          <div className="analyticsquickdataboxpie flex flex-col  cursor-pointer">
          </div>
        </div>

        <div className="fade-in mapsdiv analyticscard">
          {countriesdata && Object.keys(countriesdata).length > 0 ? (
            <>
              <MapAnalyticsComponent countriesdata={countriesdata} />
            </>
          ) : (
            <div className="text-red-500">
              No data available for the map.
            </div>
          )}
        </div>
        <HoursandWeeks hoursofdaytraffic={hoursofdaytraffic} weekdaystraffic={weekdaystraffic} selecteddatesMulti={selecteddatesMulti} />

        <div className="topreferrersouterdiv card analyticscard">
          <TopReferrers referrals={referrals} selecteddatesMulti={selecteddatesMulti || []} solodate={solodate || false} solodatedate={solodatedate || ''} currentsiteid={currentsiteid} />

        </div>

        <div className="card analyticscard">
          <TopPagesCombo mostvisitedpages={mostvisitedpages}
            mostexitedpages={mostexitedpages} mostenteredpages={mostenteredpages} />
        </div>


        <div className="card  flex-1 bottomcard analyticscard" >
          <TopDeviceCombo devicedata={devicedata} osdata={osdata} browserdata={browserdata}
            uniquevisitors={totaluniquevisitorscount} />
        </div>




      </div >


    </>

  );
}
