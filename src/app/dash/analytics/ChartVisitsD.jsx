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
    const monthsarray = [
      ['01', 'January', 'Jan'],
      ['02', 'February', 'Feb'],
      ['03', 'March', 'Mar'],
      ['04', 'April', 'Apr'],
      ['05', 'May', 'May'],
      ['06', 'June', 'Jun'],
      ['07', 'July', 'Jul'],
      ['08', 'August', 'Aug'],
      ['09', 'September', 'Sep'],
      ['10', 'October', 'Oct'],
      ['11', 'November', 'Nov'],
      ['12', 'December', 'Dec']
    ]

    //find position in monthsarray of first entry in data 
    let firstmonth = data[0].month;
    console.log(firstmonth, 'firstmonth');

    let firstmonthindex = monthsarray.findIndex(month => month[2] === firstmonth);
    console.log(firstmonthindex, 'firstmonthindex');

    let missingmonths = firstmonthindex;
    console.log(missingmonths, 'missingmonths');

    console.log('datainchartVisits', data);

    //let add two arrays to data
    for (let i = 0; i < missingmonths; i++) {
      //add month and totalUsers to data
      let objecttoadd = {
        month: monthsarray[i][2],
        totalUsers: 0
      }
      data.unshift(objecttoadd);
    }

    dataonlynomonth = data.map(item => item.totalUsers);
    //   setDatatoshow(dataonlynomonth);

    console.log('dataonlynomonth', dataonlynomonth);


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
      <canvas ref={canvasRef} width={100} height={50} className="linechartcanvas1" />
    </div>
  );
}