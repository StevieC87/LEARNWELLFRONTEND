
'use client'
//note im importing my custom svgmap.js file below in the useeffect
import './styles/svgMapcustom.css'
import './styles/morecustomsvgmap.css'
import { useEffect, useRef, useState } from 'react';
import { countryandcode, flags } from './styles/countrystuff.js'

export default function MapAnalyticsComponent({ countriesdata }) {
  const [mapReady, setMapReady] = useState(false);
  const mapInstance = useRef(null);
  const [visitorfilter, setVisitorfilter] = useState('allvisitors'); // state to manage visitor filter
  console.log(countriesdata, 'countriesdata in MapAnalyticsComponent')
  if (!countriesdata) {
    return;
  }


  const [filteredDataS, setFilteredDataS] = useState({});
  const [topcountries, setTopCountries] = useState([]); // Initialize topcountries state

  //default values - no filtering
  useEffect(() => {


    console.log(visitorfilter, 'visitorfilter in MapAnalyticsComponent')
    let filtervisitortype
    if (visitorfilter === 'allvisitors') {
      filtervisitortype = 'visitors';
    } else if (visitorfilter === 'returningvisitors') {
      filtervisitortype = 'returningUsers';
    } else if (visitorfilter === 'newvisitors') {
      filtervisitortype = 'newUsers';
    }

    // Keep only key and the value based on filtervisitortype
    const filteredData = Object.fromEntries(
      Object.entries(countriesdata).map(([key, value]) => [
        key,
        { [visitorfilter]: value[filtervisitortype] }
      ])
    );

    console.log(countriesdata, 'countriesdata in MapAnalyticsComponent')
    console.log(filteredData, 'filteredData')
    setFilteredDataS(filteredData);


    //.HERE FOR TOP 10 COUNTRIES
    //order data.visitorsbycountry by total visitors in descending order
    const sortedCountries = Object.entries(filteredData).sort((a, b) => {
      return b[1][visitorfilter] - a[1][visitorfilter]; // Sort by visitors in descending order
    });
    console.log(sortedCountries, 'sortedCountries');
    //limit result to top 10 countries

    const top10Countries = sortedCountries.slice(0, 10);
    setTopCountries(top10Countries); // Set the top 10 countries

  }, [countriesdata, visitorfilter]);

  const hasRun = useRef(false);
  const [hoverData, setHoverData] = useState(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef(null);


  let currentcountryid = '';

  useEffect(() => {
    /*  if (hasRun.current) {
       // alert('already run');
       return;
     }
     hasRun.current = true; */

    if (!countriesdata || Object.keys(countriesdata).length === 0) {
      return;
    }

    import('./svgMap.js').then(({ default: svgMap }) => {
      if (mapInstance.current) {
        if (typeof mapInstance.current.remove === 'function') {
          mapInstance.current.remove();
        } else if (typeof mapInstance.current.destroy === 'function') {
          mapInstance.current.destroy();
        }
        mapInstance.current = null;
      }
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }


      mapInstance.current = new svgMap({
        targetElementID: mapContainerRef.current.id,
        disableDefaultFill: true,
        data: {
          data: {
            allvisitors: {
              name: 'Visitors per country',
              format: '{0}',
              thousandSeparator: ',',
              // thresholdMax: 5000,
              //thresholdMin: 0
            },
            newvisitors: {
              name: 'New Users per country',
              format: '{0}',
              thousandSeparator: ',',
              //  thresholdMax: 5000,
              // thresholdMin: 0
            },
            returningvisitors: {
              name: 'Returning Users per country',
              format: '{0}',
              thousandSeparator: ',',
              //  thresholdMax: 5000,
              // thresholdMin: 0
            }
          },
          applyData: visitorfilter,
          // applyData: 'allvisitors',
          values: filteredDataS,

        },


      })


      document.querySelectorAll('.svgMap-country').forEach(el => {
        el.addEventListener('mouseenter', (e) => {
          const countryID = e.target.getAttribute('data-id');
          const countryname = getCountryName(countryID)
          //const countryValues = map.options.data.values[countryID];
          const countryValues = mapInstance.current.options.data.values[countryID] || {};
          console.log(countryValues, 'countryValues23www')
          // let valuesvalues = countryValues?.visitors ?? 0;
          const flag = getFlag(countryID)
          console.log(flag, 'flag2')
          // setCurrentCountryid(countryID)
          currentcountryid = countryID
          //  setHoverData({ countryID, countryname, flag, visitors: countryValues?.visitors ?? 0 });
          let users = countryValues[visitorfilter] ?? 0;
          console.log(users, 'usersinMapAnalyticsComponent')
          let tostring = users.toString();
          //  setHoverData({ countryID, countryname, flag, users: countryValues?.visitors ?? 0 });
          setHoverData({ countryID, countryname, flag, users: tostring });
        });
        el.addEventListener('mousemove', (e) => {
          const rect = mapContainerRef.current.getBoundingClientRect();
          let x = e.clientX - rect.left; //e.pageX;
          setCoords({
            x: x,
            y: e.pageY
          });
        });
        el.addEventListener('pointerdown', (e) => {
          //  alert('clicked');
          const rect = mapContainerRef.current.getBoundingClientRect();

          const x = e.clientX - rect.left; //e.pageX;//e.pageX;
          const y = e.pageY;

          setCoords({ x, y });
          const countryID = e.target.getAttribute('data-id');
          currentcountryid = countryID
          const countryname = getCountryName(countryID)
          const flag = getFlag(countryID)
          console.log(flag, 'flag2')
          //  const countryValues = map.options.data.values[countryID];
          //  setCurrentCountryid(countryID
          const countryValues = mapInstance.current.options.data.values[countryID]?.visitors ?? 0;
          setHoverData({ countryID, countryname, flag, visitors: filteredDataS?.visitors ?? 0 });
        });
        document.querySelector('#svgMap').addEventListener("dblclick", (e) => {

          e.preventDefault();
        });

        el.addEventListener('mouseleave', () => {
          setHoverData(null);
        });
      })
      setMapReady(true); // show map now

    });
    // });
    document.addEventListener('pointerdown', (e) => {

      const isInsideMap = e.target.closest('#svgMap');
      //! MAYBE CHANGE LATER - to if clikc on same country close tooltip


      if (!isInsideMap) {
        // alert('clicked');
        setHoverData(null);
      }
    });
  }, [filteredDataS]);

  function getCountryName(countryCode) {
    const countryName = countryandcode[countryCode];
    return countryName || countryCode;
  }
  function getFlag(countryCode) {
    const flag = flags[countryCode];
    return flag || countryCode;
  }

  const matchcodetocountry = (code) => {
    const countryName = countryandcode[code];
    return countryName || code;
  }

  return (
    <>
      <style jsx>{`
        .mapdiv {
          width: 500px;
          height: 300px;
        }
          .showdata {
          height: 200px;
          font-size: 1rem}
      `}</style>




      {/*   <div id="svgMap" className="mapdiv" ref={mapContainerRef} />

      </div> */}
      <div className="svgMapwrapper">
        <div className="mapsection">
          <select className="filtervisitortypeselect" name="" id="" value={visitorfilter} onChange={(e) => {
            setVisitorfilter(e.target.value);
          }}>
            <option value="allvisitors">All Visitors</option>
            <option value="returningvisitors">Returning Visitors</option>
            <option value="newvisitors">New Visitors</option>
          </select>
          <div id="svgMap" className="mapdiv" ref={mapContainerRef} >
          </div>
        </div>
        {/* setvisitorfilter, setVisitorfilter */}

        <div className="topcountries">
          {topcountries && topcountries.length > 0 ? (
            <ul className="topcountrieslist">
              <strong>Top Countries</strong>
              {topcountries.map(([countryCode, data]) => (
                <li key={countryCode} className="topcountryitem">
                  <span className="countryflag">{data.flag}</span>
                  <span className="countryname">{matchcodetocountry(countryCode)}</span>
                  <span className="visitorscount">: {data[visitorfilter]}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-red-500">
              No top countries data available.
            </div>
          )}
        </div>
      </div>


      {hoverData && (
        <>
          <div
            style={{
              position: 'absolute',
              top: coords.y + 10,
              left: coords.x + 10,
              background: 'black',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '3px',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          >
            <strong className="flex flex-row gap-3">
              {/* {hoverData.countryID} */}
              <span>{hoverData.flag}</span>
              <span>{hoverData.countryname}</span>

            </strong><br />
            {/*   Visitors: {hoverData.visitors} */}
            Users: {hoverData.users}
          </div>

        </>
      )}
    </>
  );

}