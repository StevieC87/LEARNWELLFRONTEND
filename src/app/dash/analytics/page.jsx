'use client'
import MapAnalyticsComponent from "./Map";
import { useEffect, useState } from "react";
import Datepicker from './datepicker/Datepicker.jsx';
import ChartVisitsFilter from "./ChartVisitsFilter.jsx";
import Pie from './PieChart.jsx';
import './datepicker/Datepicker.css'
import './analytics.css';
import { set } from "react-hook-form";
import TopReferrers from "./Topreferrers.jsx";
import TopVisitedPages from "./TopVisitedPages.jsx";

export default function Analytics() {

  //. FOR DATEPICKER ----------------------
  const [multiple, setMultiple] = useState('range'); //yes or range for range or  empty string for single date selection
  const [selecteddate, setSelecteddate] = useState('');
  const [selecteddatesMulti, setSelecteddatesMulti] = useState([]);
  const [usersbymonth, setUsersByMonth] = useState([]);

  const [startdate, setStartDate] = useState(new Date()); // Set initial start date to today
  const [enddate, setEndDate] = useState('');
  const [countriesdata, setCountriesData] = useState([]); // Initialize countriesdata state
  const [visitorsbycountry, setVisitorsByCountry] = useState([]);
  const [totalnumberofsessions, setTotalNumberOfSessions] = useState(0);
  const [totalnumberofpageviews, setTotalNumberOfPageViews] = useState(0);
  const [averagesessionduration, setAverageSessionDuration] = useState(0);
  const [pagespersession, setPagesPerSession] = useState(0);
  const [bouncerate, setBounceRate] = useState(0);

  const [newreturningtotalPie, setNewReturningTotalPie] = useState({});

  const [solodate, setSoloDate] = useState(false); // For single date selection
  const [solodatedate, setSoloDateDate] = useState(''); // For single date selection

  const [customdates, setCustomDates] = useState(false); // For custom date range selection

  const [referrals, setReferrals] = useState([]); // For referrals data


  //newstuff
  const [totalpageviews, setTotalPageViews] = useState(0);
  const [totaluniquevisitorscount, setTotalUniqueVisitorsCount] = useState(0);
  const [totalvisitscount, setTotalVisitsCount] = useState(0);

  const [pagespervisit, setPagesPerVisit] = useState(0); // For pages per visit
  const [getaveragevisitduration, setGetAverageVisitDuration] = useState(0); // For average visit duration

  const [linecharttotalusers, setLineChartTotalUsers] = useState([]); // For line chart total users data

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

  const [mapbackupcountries, setMapBackupCountries] = useState([]); // Initialize mapbackupcountries state


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
          },
          body: JSON.stringify({
            daterange: selecteddatesMulti,
            solodate: solodate,
            solodatedate: solodatedate,
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

        setLineChartTotalUsers(data.totalvisitslinechartdata || []);

        // Use data.bouncerate if it exists
        /*  setCountriesData(data.visitorsbycountry)
         console.log(data.visitorsbycountry, 'data.visitorsbycountry');
         console.log(data.data, 'data.dat1111a');
         setMapBackupCountries(data.data || []); // Use data.data if it exists
         //setVisitorsByCountry(data.visitorsbycountry || {}); // Use data.data if it exists
         console.log(data.visitorsbycountry, 'data.visitorsbycountry');
         setUsersByMonth(data.visitorseachday || []); // Use data.userByMonth if it exists
         console.log(data.visitorseachday, 'data.visitorseachday');
         setTotalUsersDataRange(data.visitorseachday || []); // Use data.visitorseachday if it exists
         setTotalNumberOfSessions(data.totalnumberofsessions || 0); // Use data.totalnumberofsessions if it exists
         setTotalNumberOfPageViews(data.totalnumberofpageviews || 0); // Use data.totalnumberofpageviews if it exists
         setAverageSessionDuration(data.averagesessionduration || 0); // Use data.averagesessionduration if it exists
         //
         let roundedpagespersessiontoTWOdecimals = Math.round((data.pagespersession || 0) * 100) / 100; // Round to two decimal places
         setPagesPerSession(roundedpagespersessiontoTWOdecimals || 0); // Use data.pagespersession if it exists
         console.log(data.bouncerate, 'data.bouncerate');
         setBounceRate(data.bouncerate || 0); // Use data.bouncerate if it exists
         setNewReturningTotalPie(data.totalvisitorsthatperiodv || {}); // Use data.newreturningtotalPie if it exists
         setReferrals(data.referrals || []); // Use data.referrals if it exists 
         setMostVisitedPages(data.mostvisitedpages || []); // Use data.mostvisitedpages if it exists */

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

  const [opendatepickercustom, setOpenDatePickerCustom] = useState(false);
  const [selectedValue, setSelectedValue] = useState("7days");

  const [mostvisitedpages, setMostVisitedPages] = useState([]);

  const selectchangefilterdates = (e) => {
    const value = e.target.value;
    console.log(value, 'value in selectchangefilterdates');

    if (value === '7days') {
      setCustomDates(false);
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
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
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      setStartDate(yesterday);
      setEndDate(yesterday);
      setSelecteddatesMulti([yesterday.toISOString().split('T')[0]]);
      setSelectedValue('yesterday'); // Update selected value
    }
    else if (value === 'today') {
      setCustomDates(false);
      const today = new Date();
      setStartDate(today);
      setEndDate(today);
      setSelecteddatesMulti([today.toISOString().split('T')[0]]);
      setSelectedValue('today'); // Update selected value
    }
    else if (value === '14days') {
      setCustomDates(false);

      const today = new Date();
      const fourteenDaysAgo = new Date(today);
      fourteenDaysAgo.setDate(today.getDate() - 14);
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

      const today = new Date();

      const sixtyDaysAgo = new Date(today);
      sixtyDaysAgo.setDate(today.getDate() - 60);
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

      const today = new Date();
      const ninetyDaysAgo = new Date(today);
      ninetyDaysAgo.setDate(today.getDate() - 90);
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

      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
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
    else if (value === 'alltime') {
      setCustomDates(false);
      let startdatealltime = new Date('2025-01-01');
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


  return (
    <>
      {/*    {selecteddatesMulti.map((date) => (
        <span key={date}>{date}</span>
      ))} */}
      <div className="flex flex-col h-screen">
        <h1 className="text-4xl font-bold mb-4">Analytics</h1>
        {/*   <div >
          <div className="formtabs flex flex-row">
            <button onClick={(e) => toggleTabs('pagecontent')} className={`${initialpage ? 'activetab' : ''} button button-outline tabbutton`}>Analytics</button>
            <button onClick={(e) => toggleTabs('seocontent')} className={`${secondtab ? 'activetab' : ''} button button-outline tabbutton`}>Charts</button>
            {(schematype === 'Blog' || schematype === 'Article') && (
              <button onClick={(e) => toggleTabs('jsonld')} className={`${jsonldvisible ? 'activetab' : ''} button button-outline tabbutton`}>More analytics</button>
            )}
          </div>

          <div id="pagecontent" className={`pagecontent ${initialpage ? 'visible' : 'hidden'}`}>
          </div>
        </div> */}
        <div className="datecontrols flex flex-row gap-2" >
          {/*     {selecteddatesMulti.length > 0 && ( */}
          <Datepicker onDateChange={handleDateChange}
            dateprop={(multiple === 'yes' || multiple === 'range') ? selecteddatesMulti : selecteddate}
            multipleprop={multiple} format="DDMMYYYY"
            displaya=""
            weekstartssunday={false}
            open={opendatepickercustom}

          />
          {/*     )} */}
          <select name="" id="" onChange={(e) => selectchangefilterdates(e)}

            value={customdates ? "custom" : selectedValue}
          >

            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days" >Last 7 days</option>
            <option value="14days">Last 14 days</option>

            {/* NEED TO SO THAT E.G. END DAY AND START DAY - midnight to midnight not beginning of the day */}
            <option value="30days">Last 30 days</option>
            <option value="60days">Last 60 days</option>
            <option value="90days">Last 90 days</option>
            <option value="alltime">All time</option>
            <option value="custom">Custom Date Range</option>
          </select>
          {/* <button className="button button-primary">Last 7 days</button>
          <button className="button button-outline">Last 30 days</button>
          <button className="button button-outline">All time</button> */}
        </div>

        <ChartVisitsFilter data={linecharttotalusers} />
        <div id="analyticsquickdatadiv card" className="analyticsquickdatadiv">
          <div className="analyticsquickdataboxes flex flex-row gap-4 card">
            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Unique Visitors</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{totaluniquevisitorscount}</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Total Visits</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{totalvisitscount}</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Total Pageviews</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{totalpageviews}</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Avg. Session Duration</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{getaveragevisitduration}</span>
            </div>

            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Bounce Rate</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold
">{bouncerate}%</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Pages / Session</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{pagespervisit}</span>
            </div>
          </div>
          <div className="analyticsquickdataboxpie flex flex-col">
            {/*  <Pie data={newreturningtotalPie} /> */}

          </div>


        </div>

        <div className="mt-8 fade-in mapsdiv">

          {countriesdata && Object.keys(countriesdata).length > 0 ? (
            <>
              <MapAnalyticsComponent countriesdata={countriesdata} />
            </> /* //totalvisitspercountry  uniquevisitspercountry */
          ) : (
            <div className="text-red-500">
              No data available for the map.
            </div>
          )}

        </div>

        <div className="topreferrersouterdiv mt-4 card">
          {/*    <TopReferrers referrals={referrals} /> */}
        </div>

        <div className="card mt-4">
          {/* <TopVisitedPages mostvisitedpages={mostvisitedpages} /> */}
        </div>
      </div>

    </>

  );
}