import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';

export default function ChartVisitsD(props) {
  const canvasRef = useRef();
  const { data } = props;
  const [datatoshow, setDatatoshow] = useState([]);
  let dataonlynomonth = [];

  //only use once ref 
  const loadonce = useRef(false);

  const [dataperiod, setDataperiod] = useState('7days'); // default period

  useEffect(() => {

    if (data.length === 0) {
      return
    }


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
    if (dataonlynomonth.length > 0) {
      console.log(dataonlynomonth, 'dataonlynomonthdataonlynomonth')
      const ctx = canvasRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [{
            label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            data: dataonlynomonth, //,
            borderColor: 'rgb(75,192,192)',
            tension: 0.2
          }] //dataonlynomonth
        }
      });
    }
  }, [dataonlynomonth]);

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={200} />
    </div>
  );
}