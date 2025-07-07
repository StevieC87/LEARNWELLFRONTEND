import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';

export default function ChartVisitsFilter(props) {
  const canvasRef = useRef();
  const { data } = props;
  const chartRef = useRef();

  //only use once ref 
  const loadonce = useRef(false);

  const [dataperiod, setDataperiod] = useState('7days'); // default period

  const [dataonly, setDataonly] = useState([]);
  const [labels, setLabels] = useState([])
  const [returningUsers, setReturningUsers] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  useEffect(() => {
    if (data.length === 0) {
      return
    }

    console.log(data, 'data in ChartVisitsFilter');

    let dataonlyv = []
    let labelsv = [];
    let returningUsersv = [];
    let newUsersv = [];

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
    // setReturningUsers(returningUsersv);
    //setNewUsers(newUsersv);

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
    if (dataonly.length > 0) {
      console.log(dataonly, 'dataonlynomonthdataonlynomonth')
      if (chartRef.current) chartRef.current.destroy();
      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Visitors',
            data: dataonly,
            borderColor: 'rgb(75,192,192)',
            tension: 0.2
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                callback: function (value) {
                  return Number.isInteger(value) ? value : null;
                }
              },
              suggestedMax: Math.max(...dataonly) * 1.3, // Increase the maximum value by 10%
              suggestedMin: 0, // Ensure the minimum value is 0
              grid: {
                display: false // Hide the grid lines
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

    }
  }, [dataonly]);

  return (
    <div className="card flex flex-row items-center justify-center">
      <canvas ref={canvasRef} width={100} height={50} className="linechartcanvas1" />
    </div>
  );
}