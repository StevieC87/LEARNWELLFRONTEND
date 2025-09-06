import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';
import { formatNumber } from './useful/utilites.js'; // Import formatNumber function

export default function ChartVisitsFilter(props) {
  const canvasRef = useRef();
  const { data, uniquevisitors, totalpageviews } = props;
  const chartRef = useRef();

  //only use once ref 
  const loadonce = useRef(false);

  const [dataperiod, setDataperiod] = useState('7days'); // default period

  const [dataonly, setDataonly] = useState([]);
  const [labels, setLabels] = useState([])


  const [uniquevisitorsdataonly, setUniqueVisitorsDataOnly] = useState([]);
  const [uniquevisitorslabels, setUniqueVisitorsLabels] = useState([]);
  const [totalpageviewsdataonly, setTotalPageViewsDataOnly] = useState([]);
  const [totalpageviewslabels, setTotalPageViewsLabels] = useState([]);

  useEffect(() => {
    if (data.length === 0) {
      return
    }
    console.log(data, 'data in ChartVisitsFilter');
    let dataonlyv = []
    let labelsv = [];
    let loopoverdata = data.map(item => {
      let datelabel = item.date;
      let totalusers = item.totalusers;
      // let returnignusers = item.returningUsers;
      // let newusers = item.newUsers;

      dataonlyv.push(totalusers);
      labelsv.push(datelabel);
      // returningUsersv.push(returnignusers);
      // newUsersv.push(newusers);
    })
    console.log('dataonlyv', dataonlyv);
    console.log('labelsv', labelsv);
    setDataonly(dataonlyv);
    setLabels(labelsv);
    //, ----------------------------------------
    let uniquevisitorsdataonly = [];
    let uniquevisitorslabels = [];

    if (!uniquevisitors || uniquevisitors.length === 0) {
      console.log('No unique visitors data available');
      return;
    }
    else {
      let loopoveruniquevisitors = uniquevisitors.map(item => {
        let datelabel = item.date;
        let totaluniquevisitors = item.unique_visitors;

        uniquevisitorsdataonly.push(totaluniquevisitors);
        uniquevisitorslabels.push(datelabel);
      })
      setUniqueVisitorsDataOnly(uniquevisitorsdataonly);
      setUniqueVisitorsLabels(uniquevisitorslabels);
    }
    //, ----------------------------------------
    let totalpageviewsdataonly = [];
    let totalpageviewslabels = [];
    if (!totalpageviews || totalpageviews.length === 0) {
      console.log('No total page views data available');
      return;
    }
    else {
      let loopovertotalpageviews = totalpageviews.map(item => {
        let datelabel = item.date;
        let totalpageviews = item.pageviews;

        totalpageviewsdataonly.push(totalpageviews);
        totalpageviewslabels.push(datelabel);
      })
      setTotalPageViewsDataOnly(totalpageviewsdataonly);
      setTotalPageViewsLabels(totalpageviewslabels);
    }
    console.log('totalpageviewsdataonly', totalpageviewsdataonly);
    console.log('totalpageviewslabels', totalpageviewslabels);

  }, [data, uniquevisitors, totalpageviews]); // Re-run effect when data changes

  ////returningUsers newUsers

  useEffect(() => {
    //MAKE SURE ONLY LOADS ONE 
    if (loadonce.current) {
      return;
    }
    //make sure window has loaded and document
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    if (dataonly.length > 0) {
      console.log(dataonly, 'dataonlynomonthdataonlynomonth')
      if (chartRef.current) chartRef.current.destroy();
      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Unique Visits',
            data: dataonly,
            borderColor: '#5bcaec',
            backgroundColor: 'rgba(91, 202, 236, 0.2)', // shading with opacity
            fill: true, // enables shading under the line
            tension: 0.4 // smooth curve
          },
          {
            //  uniquevisitorslabels
            label: 'Unique Visitors per day',
            data: uniquevisitorsdataonly,
            borderColor: '#445053ff',
            backgroundColor: 'rgba(68, 80, 83, 0.2)', // shading with opacity
            fill: true, // enables shading under the line
            tension: 0.4 // smooth curve
          },
          {
            //  totalpageviewslabels
            label: 'Total Page Views per day',
            data: totalpageviewsdataonly,
            borderColor: '#6096ddff',
            backgroundColor: 'rgba(83, 140, 214, 0.2)', // shading with opacity
            fill: true, // enables shading under the line
            tension: 0.4 // smooth curve
          }

          ]
          /* rgb(75,192,192) */
        },

        options: {
          scales: {
            y: {
              ticks: {
                callback: function (value) {
                  return Number.isInteger(value) ? formatNumber(value) : null;
                }
              },
              suggestedMax: Math.max(...dataonly) * 1.3, // Increase the maximum value by 10%
              suggestedMin: 0, // Ensure the minimum value is 0
              grid: {
                display: true // Hide the grid lines
              }
            },
            x: {
              grid: {
                display: false // Hide the grid lines
              }
            }
          },
          plugins: {
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              callbacks: {
                /*  beforeTitle: function () { return ''; },
                 title: function () { return ''; }, */
                /*   label: function (context) {
                    // Access the value directly from the context parameter
                    return formatNumber(context.raw);
                  }, */

              },
              displayColors: false,

            },
          }
        }
      });

    }
  }, [dataonly]);

  return (
    <div className="card flex flex-row items-center justify-center">
      <canvas ref={canvasRef} width={100} height={50} className="linechartcanvas1" />
    </div>
  );
}