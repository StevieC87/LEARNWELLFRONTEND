
'use client'
//note im importing my custom svgmap.js file below in the useeffect
import './styles/svgMapcustom.css'
import './styles/morecustomsvgmap.css'
import { useEffect, useRef, useState } from 'react';
import { countryandcode, flags } from './styles/countrystuff.js'

export default function MapAnalyticsComponentBackup({ countriesdata }) {
  const [mapReady, setMapReady] = useState(false);
  if (!countriesdata) {
    return;
  }
  // console.log(countriesdata, 'countriesdata')
  let bycountrydefault;

  //default values - no filtering
  useEffect(() => {

    function calculateUserTotals(countriesdata) {
      const result = {};

      countriesdata.forEach(entry => {
        for (const [countryCode, stats] of Object.entries(entry.countries)) {
          if (!result[countryCode]) {
            result[countryCode] = {
              newUsers: 0,
              returningUsers: 0,
              visitors: 0
            };
          }

          result[countryCode].newUsers += stats.newUsers;
          result[countryCode].returningUsers += stats.returningUsers;
          result[countryCode].visitors += stats.totalUsers
        }
      });

      return result;
    }
    bycountrydefault = calculateUserTotals(countriesdata);
    console.log(bycountrydefault, 'bycountrydefault')

    /* function convertToArray(obj) {
      return Object.entries(obj).map(([country, values]) => ({
        country,
        ...values
      }));
    }

    let converttoarray = convertToArray(bycountrydefault);
    console.log(converttoarray, 'converttoarray') */

  }, [countriesdata]);

  const hasRun = useRef(false);
  const [hoverData, setHoverData] = useState(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef(null);

  //console.log(countryandcode, 'countryandcode')
  const countryName = countryandcode['EG']
  //console.log(countryName, 'countryname')
  const flag1 = flags['EG'];
  console.log(flag1, 'flag1')

  // const [currentcountryid, setCurrentCountryid] = useState('');
  let currentcountryid = '';

  useEffect(() => {
    if (hasRun.current) {
      // alert('already run');
      return;
    }
    hasRun.current = true;

    if (typeof window === 'undefined') return;
    /* if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = ''; // <- this line prevents duplicates
    } */

    // Dynamically import on client side only
    // import('svgmap').then(({ default: svgMap }) => {
    import('./svgMap.js').then(({ default: svgMap }) => {
      const map = new svgMap({
        targetElementID: mapContainerRef.current.id,
        disableDefaultFill: true,
        data: {
          data: {
            visitors: {
              name: 'Visitors per country',
              format: '{0}',
              thousandSeparator: ',',
              thresholdMax: 5000,
              thresholdMin: 0
            }
          },
          applyData: 'visitors',
          values: bycountrydefault,
          /*  values: {
             AT: { visitors: 2000 },
             DE: { visitors: 1500 },
             US: { visitors: 3000 }
           } */
        },
        /* onGetTooltip: function (tooltipDiv, countryID, countryValues) {
          console.log('Tooltip for:', countryID, countryValues)
          const visitors = countryValues?.visitors || 0;

          tooltipDiv.innerHTML = `
            <div class="svgMap-tooltip  svgMap-tooltip-content-container">
              <strong>Country:</strong> ${countryID}<br/>
              <strong>Visitors:</strong> ${visitors}
            </div>
          `;
          return tooltipDiv;
        }
      }); */

      })
      document.querySelectorAll('.svgMap-country').forEach(el => {
        el.addEventListener('mouseenter', (e) => {
          const countryID = e.target.getAttribute('data-id');
          const countryname = getCountryName(countryID)
          const countryValues = map.options.data.values[countryID];
          const flag = getFlag(countryID)
          console.log(flag, 'flag2')
          // setCurrentCountryid(countryID)
          currentcountryid = countryID
          setHoverData({ countryID, countryname, flag, visitors: countryValues?.visitors ?? 0 });
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
          const countryValues = map.options.data.values[countryID];
          //  setCurrentCountryid(countryID)
          setHoverData({ countryID, countryname, flag, visitors: countryValues?.visitors ?? 0 });
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
      /* setHoverData(null); */

      /* if (!e.target.closest('.svgMap-country')) {
        setHoverData(null);
      } */
      //COULD ALSO DO - IF INSIDE THE MAP BUT SAME COUNTRY ALSO CLOSE 


      const isInsideMap = e.target.closest('#svgMap');
      //! MAYBE CHANGE LATER - to if clikc on same country close tooltip
      /*  if (isInsideMap) {
        const countryID = e.target.getAttribute('data-id');
        console.log(countryID, 'countryID')
        console.log(currentcountryid, 'currentcountryid')
        if (currentcountryid === countryID) {
         // alert('same')
          return;
        }
        //  setHoverData({ countryID, countryname, flag, visitors: countryValues?.visitors ?? 0 }); 
      } */

      if (!isInsideMap) {
        // alert('clicked');
        setHoverData(null);
      }
    });
  }, []);

  function getCountryName(countryCode) {
    const countryName = countryandcode[countryCode];
    return countryName || countryCode;
  }
  function getFlag(countryCode) {
    const flag = flags[countryCode];
    return flag || countryCode;
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

      <div id="svgMap" className="mapdiv" ref={mapContainerRef} >
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
            Visitors: {hoverData.visitors}
          </div>
          {/*  <div className="showdata">
            <p><strong>Country:</strong> {hoverData.countryID}</p>
            <p><strong>Country Name:</strong> {hoverData.countryname}</p>
            <p><strong>Flag:</strong> {hoverData.flag}</p>
            <p><strong>Visitors:</strong> {hoverData.visitors}</p>
          </div> */}
        </>
      )}
    </>
  );

}