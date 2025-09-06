import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';
import './PieVisitors.css';

export default function PieChart(props) {
  const pieCanvasRef = useRef();
  const { data } = props;
  const pieRef = useRef();

  //only use once ref 
  const loadoncepie = useRef(false);


  const [labels, setLabels] = useState([])
  const [returningUsers, setReturningUsers] = useState([]);
  const [newUsers, setNewUsers] = useState([]);

  const [piedata, setPieData] = useState([]); // State to hold pie chart data
  useEffect(() => {
    /*   if (data.length === 0) {
        return
      } */
    console.log(data, 'data111111111')
    //WE HAV ETOTAL USERS, we want to get from 100 - the ratio 
    let totalusers = data.totalVisitors;
    let newusers = data.totalNewUsers;
    let returningusers = data.totalReturningUsers;
    console.log('totalusers11111111', totalusers);
    console.log('newusers11111111', newusers);
    console.log('returningusers11111', returningusers);
    //calculate the percentage of new and returning users
    let newuserspercentage = (newusers / totalusers) * 100;
    //no decimals
    newuserspercentage = Math.round(newuserspercentage)
    setNewUsers(newuserspercentage);
    let returninguserspercentage = (returningusers / totalusers) * 100;
    //no decimals
    returninguserspercentage = Math.round(returninguserspercentage);

    setReturningUsers(returninguserspercentage);

    let arraydata = [];
    arraydata.push(newuserspercentage);
    arraydata.push(returninguserspercentage);
    console.log('arraydata', arraydata);
    setPieData(arraydata);
  }, [data]); // Re-run effect when data changes

  ////returningUsers newUsers

  useEffect(() => {
    //MAKE SURE ONLY LOADS ONE 
    if (loadoncepie.current) {
      return;
    }
    //make sure window has loaded and document
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    if ((returningUsers > 0 || newUsers > 0)) {

      if (pieRef.current) pieRef.current.destroy();
      const ctxa = pieCanvasRef.current.getContext('2d');
      pieRef.current = new Chart(ctxa, {
        type: 'pie',
        data: {
          labels: ['New Users', 'Returning Users'], //labels,
          datasets: [{
            label: '',
            data: piedata,
            /* borderColor: 'rgb(75,192,192)', */
            backgroundColor: [
              'rgb(36, 175, 255)',
              'rgb(41, 156, 31)'

            ],
            /*   hoverOffset: 4 */
            // tension: 0.2
          }, //dataonlynomonth
          ]
          //dataon
        },
        options: {
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: false
            }
          }
        }

      });
    }
  }, [newUsers, returningUsers]); // Re-run effect when data changes

  return (
    <>
      <div className="piechartdiv ">
        <div>
          {/*   New v Returning Visitors */}
          <span className="piechartnewvisitors">New Visitors: {newUsers}% <br /></span>
          <span className="piechartreturningvisitors">Returning Visitors: {returningUsers}% <br /></span>

        </div>

        <canvas ref={pieCanvasRef} width={100} height={50} className="piechartcanvas" />
      </div>

    </>
  );
}