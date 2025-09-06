
import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';
import { formatNumber } from '../useful/utilites.js'; // Import formatNumber function

export default function DaysofWeek(props) {
  const canvasRef = useRef();
  const chartRef = useRef();

  const { data } = props;

  //only use once ref 
  const loadonce = useRef(false);


  // const [dataonly, setDataonly] = useState([]);
  //const [labels, setLabels] = useState([])


  const [Monday, setMonday] = useState(0);
  const [Tuesday, setTuesday] = useState(0);
  const [Wednesday, setWednesday] = useState(0);
  const [Thursday, setThursday] = useState(0);
  const [Friday, setFriday] = useState(0);
  const [Saturday, setSaturday] = useState(0);
  const [Sunday, setSunday] = useState(0);
  useEffect(() => {
    if (data.length === 0) {
      return
    }
    console.log(data, 'datainChartWeekdays');

    let loopoverdata = data.map((item, index) => {
      if (item.day_of_week) {
        switch (item.day_of_week) {
          case 0:
            setSunday(parseInt(item.unique_visits));
            break;
          case 1:
            setMonday(parseInt(item.unique_visits));
            break;
          case 2:
            setTuesday(parseInt(item.unique_visits));
            break;
          case 3:
            setWednesday(parseInt(item.unique_visits));
            break;
          case 4:
            setThursday(parseInt(item.unique_visits));
            break;
          case 5:
            setFriday(parseInt(item.unique_visits));
            break;
          case 6:
            setSaturday(parseInt(item.unique_visits));
            break;
        }
      }
    })
  }, [data]); // Re-run effect when data changes

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
    console.log(Monday, 'Monday');
    console.log(Tuesday, 'Tuesday');
    console.log(Wednesday, 'Wednesday');
    console.log(Thursday, 'Thursday');
    console.log(Friday, 'Friday');
    console.log(Saturday, 'Saturday');
    console.log(Sunday, 'Sunday');

    //  console.log(dataonly, 'dataonlynomonthdataonlynomonth')
    if (chartRef.current) chartRef.current.destroy();
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [{
          // label: 'Total Visitors',
          /* label: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], */
          label: '',
          data: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday],
          borderColor: '#5bcaec',
          backgroundColor: [
            /* '#759facff', // Monday - dark grey-blue
           //  '#5BCAEC', // Tuesday - light blue
          //   '#4CAF50', // Wednesday - green
          //   '#FFC107', // Thursday - amber
          //   '#FF9800', // Friday - orange
          //   '#E91E63', // Saturday - pink/red
          //   '#9C27B0'  // Sunday - purple */
            '#5BCAEC', // Monday - dark grey-blue
            '#5BCAEC', // Tuesday - light blue
            '#5BCAEC', // Wednesday - green
            '#5BCAEC', // Thursday - amber
            '#5BCAEC', // Friday - orange
            '#5BCAEC', // Saturday - pink/red
            '#5BCAEC'  // Sunday - purple */

          ]


        }],
      },

      options: {
        plugins: {
          legend: {
            display: false // hide legend
          },

          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {
              beforeTitle: function () { return ''; },
              title: function () { return ''; },
              label: function (context) {
                // Access the value directly from the context parameter
                return formatNumber(context.raw);
              },
              /*   afterTitle: function () { return ''; },
                beforeLabel: function () { return ''; },
                label: function () { return ''; },
                afterLabel: function () { return ''; },
                beforeBody: function () { return ''; },
                beforeFooter: function () { return ''; },
                footer: function () { return ''; },
                afterFooter: function () { return ''; }, */
            },
            displayColors: false,
            //  backgroundColor: 'rgba(0, 0, 0, 0.5)',
            ////   titleColor: 'transparent',
            //   bodyColor: 'transparent',
            //   borderColor: 'transparent',
            //    cornerRadius: 4,
            //    padding: 8
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return Number.isInteger(value) ? value : null;
              }
            },
            suggestedMax: 10, // Increase the maximum value by 10%
            //   suggestedMin: 0, // Ensure the minimum value is 0
            grid: {
              display: true // Hide the grid lines
            }
          },
          x: {
            grid: {
              display: false // Hide the grid lines
            }
          }
        }
      }
    });


  }, [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]);

  return (
    <div className=" flex flex-row items-center justify-center">
      <canvas ref={canvasRef} width={100} height={50} className="linechartcanvas1" />
    </div>
  );
}
