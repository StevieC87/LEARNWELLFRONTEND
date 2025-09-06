
import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatNumber } from '../useful/utilites.js'; // Import formatNumber function

export default function HoursofDayTraffic(props) {
  const canvasRef = useRef();
  const chartRef = useRef();

  const currentsizetimezone = useSelector((state) => state.AnalyticsSlice.currentsizetimezone);
  const { data } = props;

  //only use once ref 
  const loadonce = useRef(false);


  // const [dataonly, setDataonly] = useState([]);
  //const [labels, setLabels] = useState([])


  const [time00, setTime00] = useState(0);
  const [time01, setTime01] = useState(0);
  const [time02, setTime02] = useState(0);
  const [time03, setTime03] = useState(0);
  const [time04, setTime04] = useState(0);
  const [time05, setTime05] = useState(0);
  const [time06, setTime06] = useState(0);
  const [time07, setTime07] = useState(0);
  const [time08, setTime08] = useState(0);
  const [time09, setTime09] = useState(0);
  const [time10, setTime10] = useState(0);
  const [time11, setTime11] = useState(0);
  const [time12, setTime12] = useState(0);
  const [time13, setTime13] = useState(0);
  const [time14, setTime14] = useState(0);
  const [time15, setTime15] = useState(0);
  const [time16, setTime16] = useState(0);
  const [time17, setTime17] = useState(0);
  const [time18, setTime18] = useState(0);
  const [time19, setTime19] = useState(0);
  const [time20, setTime20] = useState(0);
  const [time21, setTime21] = useState(0);
  const [time22, setTime22] = useState(0);
  const [time23, setTime23] = useState(0);




  useEffect(() => {
    if (data.length === 0) {
      return
    }
    console.log(data, 'dataincharthoursfilter');
    const utcHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
      12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    /*  const offsetString = "+01:00"; */
    console.log(currentsizetimezone, 'currentsizetimezone in charthoursfilter');
    let extractplusorminus = currentsizetimezone?.substring(0, 3); // "+01" or "-05"
    const offsetHours = parseInt(currentsizetimezone); // "+01" → 1
    console.log(offsetHours, 'offsetHours in charthoursfilter');

    const localHours = utcHours.map(h => {
      let localHour = (h + offsetHours + 24) % 24;
      console.log(localHour, 'localHour in charthoursfilter');
      console.log(h.unique_visits, 'h.unique_visits in charthoursfilter');
      return {
        hour_of_day: (h + offsetHours + 24) % 24,
        //unique_visits: data.find(item => item.hour_of_day === h.toString())?.unique_visits || 0
        unique_visits: data.find(item => item.hour_of_day === h)?.unique_visits || 0
      };
    });
    console.log(localHours, 'localHours in charthoursfilter');


    console.log(data, 'data2 in charthoursfilter');


    let loopoverdata = localHours.map((item, index) => {
      console.log(item, 'itemitemitem')
      if (item.hour_of_day) {

        switch (item.hour_of_day) {
          case 0:
            setTime00(parseInt(item.unique_visits));
            break;
          case 1:
            setTime01(parseInt(item.unique_visits));
            break;
          case 2:
            setTime02(parseInt(item.unique_visits));
            break;
          case 3:
            setTime03(parseInt(item.unique_visits));
            break;
          case 4:
            setTime04(parseInt(item.unique_visits));
            break;
          case 5:
            setTime05(parseInt(item.unique_visits));
            break;
          case 6:
            setTime06(parseInt(item.unique_visits));
            break;
          case 7:
            setTime07(parseInt(item.unique_visits));
            break;
          case 8:
            setTime08(parseInt(item.unique_visits));
            break;
          case 9:
            setTime09(parseInt(item.unique_visits));
            break;
          case '10':
            setTime10(parseInt(item.unique_visits));
            break;
          case 11:
            setTime11(parseInt(item.unique_visits));
            break;
          case 12:
            setTime12(parseInt(item.unique_visits));
            break;
          case 13:
            setTime13(parseInt(item.unique_visits));
            break;
          case 14:
            setTime14(parseInt(item.unique_visits));
            break;
          case 15:
            setTime15(parseInt(item.unique_visits));
            break;
          case 16:
            setTime16(parseInt(item.unique_visits));
            break;
          case 17:
            setTime17(parseInt(item.unique_visits));
            break;
          case 18:
            setTime18(parseInt(item.unique_visits));
            break;
          case 19:
            setTime19(parseInt(item.unique_visits));
            break;
          case 20:
            setTime20(parseInt(item.unique_visits));
            break;
          case 21:
            setTime21(parseInt(item.unique_visits));
            break;
          case 22:
            setTime22(parseInt(item.unique_visits));
            break;
          case 23:
            setTime23(parseInt(item.unique_visits));
            break;
          default:
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

    //  console.log(dataonly, 'dataonlynomonthdataonlynomonth')
    if (chartRef.current) chartRef.current.destroy();
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        datasets: [{
          label: '', // set to empty string to hide label
          data: [time00, time01, time02, time03, time04, time05, time06, time07, time08, time09, time10, time11, time12, time13, time14, time15, time16, time17, time18, time19, time20, time21, time22, time23],
          borderColor: '#5bcaec',
          backgroundColor: [
            '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC', '#5BCAEC',
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
              afterTitle: function () { return ''; },
              beforeLabel: function () { return ''; },
              label: function (context) {
                // Access the value directly from the context parameter
                return formatNumber(context.raw);
              },
              /*       afterLabel: function () { return ''; },
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
            suggestedMax: 10,
            grid: {
              display: true
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }

      }
    });


  }, [data, time00, time01, time02, time03, time04, time05, time06, time07, time08, time09, time10, time11, time12, time13, time14, time15, time16, time17, time18, time19, time20, time21, time22, time23]); // Re-run effect when data changes

  return (
    <div className=" flex flex-row items-center justify-center">
      <canvas ref={canvasRef} width={100} height={50} className="linechartcanvas1" />
    </div>
  );
}
