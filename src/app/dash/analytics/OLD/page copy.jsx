'use client'
import MapAnalyticsComponent from "../Map.jsx";
import { useEffect, useState } from "react";
import Datepicker from '../datepicker/Datepicker.jsx';
import ChartVisitsFilter from "../ChartVisitsFilter.jsx";
import Pie from '../PieChart.jsx';
import './datepicker/Datepicker.css'
import './analytics.css';
import { set } from "react-hook-form";

export default function Analytics() {

  //. FOR DATEPICKER ----------------------
  const [multiple, setMultiple] = useState('range'); //yes or range for range or  empty string for single date selection
  const [selecteddate, setSelecteddate] = useState('');
  const [selecteddatesMulti, setSelecteddatesMulti] = useState([]);
  const [usersbymonth, setUsersByMonth] = useState([]);

  const [startdate, setStartDate] = useState(new Date()); // Set initial start date to today
  const [enddate, setEndDate] = useState('');
  const [visitorsbycountry, setVisitorsByCountry] = useState([]);
  const [totalnumberofsessions, setTotalNumberOfSessions] = useState(0);
  const [totalnumberofpageviews, setTotalNumberOfPageViews] = useState(0);
  const [averagesessionduration, setAverageSessionDuration] = useState(0);
  const [pagespersession, setPagesPerSession] = useState(0);
  const [bouncerate, setBounceRate] = useState(0);

  const [newreturningtotalPie, setNewReturningTotalPie] = useState({});

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
        setVisitorsByCountry(data.visitorsbycountry || {}); // Use data.data if it exists

        setUsersByMonth(data.visitorseachday || []); // Use data.userByMonth if it exists
        console.log(data.visitorseachday, 'data.visitorseachday');
        setTotalUsersDataRange(data.visitorseachday || []); // Use data.visitorseachday if it exists
        setTotalNumberOfSessions(data.totalnumberofsessions || 0); // Use data.totalnumberofsessions if it exists
        setTotalNumberOfPageViews(data.totalnumberofpageviews || 0); // Use data.totalnumberofpageviews if it exists
        setAverageSessionDuration(data.averagesessionduration || 0); // Use data.averagesessionduration if it exists
        //
        let roundedpagespersessiontoTWOdecimals = Math.round((data.pagespersession || 0) * 100) / 100; // Round to two decimal places
        setPagesPerSession(roundedpagespersessiontoTWOdecimals || 0); // Use data.pagespersession if it exists
        setBounceRate(data.bouncerate || 0); // Use data.bouncerate if it exists
        setNewReturningTotalPie(data.totalvisitorsthatperiodv || {}); // Use data.newreturningtotalPie if it exists
      } catch (error) {
        console.log('Error fetching countries data:', error);
      }
    };

    fetchCountriesData();

  }, [selecteddatesMulti]);

  const [initialpage, setInitialpage] = useState(true);
  const [secondtab, setSecondtab] = useState(false);
  const [jsonldvisible, setJsonLdVisible] = useState(false);
  const [schematype, setSchemaType] = useState('Blog'); // Default schema type

  const [totalusersdatarange, setTotalUsersDataRange] = useState([]);


  const selectchangefilterdates = (e) => {
    const value = e.target.value;
    console.log(value, 'value in selectchangefilterdates');
    if (value === '7days') {
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
    }
    else if (value === '30days') {
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
    }
    else if (value === 'alltime') {
      setStartDate(new Date('2000-01-01')); // Set a very old date for all time
      setEndDate(new Date());
    }
  }


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
          <select name="" id="" onChange={(e) => selectchangefilterdates(e)}>
            <option value="7days">7 days</option>
            <option value="30days">30 days</option>
            <option value="alltime">All time</option>
          </select>
          {/* <button className="button button-primary">Last 7 days</button>
          <button className="button button-outline">Last 30 days</button>
          <button className="button button-outline">All time</button> */}
        </div>

        <ChartVisitsFilter data={totalusersdatarange} />
        <div id="analyticsquickdatadiv" className="analyticsquickdatadiv">
          <div className="analyticsquickdataboxes flex flex-row gap-4">
            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Sessions</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{totalnumberofsessions}</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Page Views</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{totalnumberofpageviews}</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Avg. Session Duration</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{averagesessionduration} sec</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Pages per Session</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold">{pagespersession}</span>
            </div>
            <div className="analyticsquickdatabox flex flex-col">
              <span className="analyticsquickdataboxlabel">Bounce Rate</span>
              <span className="analyticsquickdataboxdata text-2xl font-bold
">{bouncerate}</span>
            </div>
          </div>
          <div className="analyticsquickdataboxpie flex flex-col">
            <Pie data={newreturningtotalPie} />

          </div>


        </div>
        <div className="flex flex-row">
          <div className="mt-8 fade-in mapsdiv">
            {visitorsbycountry && Object.keys(visitorsbycountry).length > 0 ? (
              <MapAnalyticsComponent visitorsbycountry={visitorsbycountry} />
            ) : (
              <div className="text-red-500">
                No data available for the map.
              </div>
            )}

          </div>
          <div>country data</div>
        </div>
      </div>


    </>

  );
}