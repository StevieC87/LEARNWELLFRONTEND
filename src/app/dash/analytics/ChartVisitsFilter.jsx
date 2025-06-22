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
  useEffect(() => {
    if (data.length === 0) {
      return
    }

    console.log(data, 'data in ChartVisitsFilter');

    let dataonlyv = []
    let labelsv = [];

    let loopoverdata = data.map(item => {
      let datelabel = item.date;
      let totalusers = item.totalUsers;
      let returnignusers = item.returningUsers;
      let newusers = item.newUsers;

      dataonlyv.push(totalusers);
      labelsv.push(datelabel);
    })
    console.log('dataonlyv', dataonlyv);
    console.log('labelsv', labelsv);
    setDataonly(dataonlyv);
    setLabels(labelsv);

  }, [data]); // Re-run effect when data changes



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
            label: dataonly,
            data: dataonly, //,
            borderColor: 'rgb(75,192,192)',
            tension: 0.2
          }] //dataonlynomonth
        }
      });
    }
  }, [dataonly]);

  return (
    <div>
      <canvas ref={canvasRef} width={100} height={50} className="linechartcanvas1" />
    </div>
  );
}