import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';
import { formatNumber } from './useful/utilites.js'; // Import formatNumber function

export default function ChartVisitsFilter(props) {
  const canvasRef = useRef();
  const { data, metric, linechartjustoneday } = props;
  const chartRef = useRef();

  //only use once ref 
  const loadonce = useRef(false);


  const [dataonly, setDataonly] = useState([]);
  const [labels, setLabels] = useState([])

  const [title, setTitle] = useState('Unique Visitors'); // Default title

  useEffect(() => {
    function secondsToDecimalMinutes(seconds) {
      return seconds / 60;
    }
    function decimalMinutesToSeconds(decimalMinutes) {
      return decimalMinutes * 60;
    }


    if (data.length === 0) {
      return
    }
    console.log(data, 'data in ChartVisitsFilter');
    let dataonlyv = []
    let labelsv = [];
    let loopoverdata = data.map(item => {
      let datelabel = item.date;
      let totalusers = item.result;
      // let returnignusers = item.returningUsers;
      // let newusers = item.newUsers;
      if (metric === 'averagevisitduration') {

        console.log(totalusers, 'totalusersinaveragevisitduration');
        totalusers = secondsToDecimalMinutes(totalusers);
        console.log(totalusers, 'totalusersinaveragevisitduration after conversion');
      }

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

    /*  if (!uniquevisitors || uniquevisitors.length === 0) {
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
  */
  }, [data]); // Re-run effect when data changes

  useEffect(() => {
    if (metric === 'uniquevisitors') {
      setTitle('Unique Visitors');
    }
    else if (metric === 'totalvisits') {
      setTitle('Total Visits');
    }
    else if (metric === 'totalpageviews') {
      setTitle('Total Page Views');
    }

    else if (metric === 'averagevisitduration') {
      setTitle('Average Visit Duration');
    }
    else if (metric === 'bouncerate') {
      setTitle('Bounce Rate');
    }
    else if (metric === 'pagespervisit') {
      setTitle('Pages per Visit');
    }
  }, [metric]);
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
            /*  label: 'Unique Visits', */
            data: dataonly,
            borderColor: '#5bcaec',
            backgroundColor: 'rgba(91, 202, 236, 0.2)', // shading with opacity
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
                  if (metric === 'bouncerate') {
                    let value1 = value + '%';
                    return Number.isInteger(value) ? value1 : null;
                  }
                  else if (metric === 'averagevisitduration') {
                    return decimalMinutesToMinutesSeconds(value);
                  }
                  else {
                    return Number.isInteger(value) ? formatNumber(value) : null;
                  }
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
              },
              ticks: {
                callback: function (value, index, ticks) {
                  // Use 'this.getLabelForValue' if available (Chart.js 2.x/3.x)
                  // For Chart.js 3.x+, context parameter is passed
                  // Check for context if your version supports it

                  // For Chart.js 3.x/4.x
                  const label = this.getLabelForValue(value);
                  const [year, month, day] = label.split('-');
                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  return `${day} ${months[parseInt(month, 10) - 1]} ${year.slice(2)}`;
                }
              }
            }
          },
          plugins: {
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              callbacks: {
                /*    beforeTitle: function () { return ''; },*/
                title: function () { return ''; },
                label: function (context) {
                  if (metric === 'bouncerate') {
                    let value1 = context.raw + '%';
                    return value1
                  }
                  else if (metric === 'averagevisitduration') {
                    //make it minute second
                    return decimalMinutesToMinutesSeconds(context.raw);
                  }
                  else {
                    // Access the value directly from the context parameter
                    return formatNumber(context.raw);
                  }
                },

              },
              displayColors: false,

            },
            legend: {
              display: false // hide legend
            },
          },
          elements: {
            point: {
              radius: linechartjustoneday ? 15 : 1,           // default is 3
              hoverRadius: linechartjustoneday ? 10 : 5,     // larger when hovered
              hitRadius: linechartjustoneday ? 10 : 5,        // larger hit area
              backgroundColor: 'rgba(91, 202, 236, 1)', // point color


            }

          }
        }
      });

    }
    function decimalMinutesToMinutesSeconds(decimalMinutes) {
      const totalSeconds = Math.round(decimalMinutes * 60);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    }
  }, [dataonly]);

  return (
    <div className="card flex flex-col items-center justify-center">

      <div className=" font-semibold mb-2">{title}</div>


      <canvas ref={canvasRef} width={100} height={50} className="linechartcanvas1" />
    </div>
  );
}