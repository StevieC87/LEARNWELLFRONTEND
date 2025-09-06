import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';
import './PieVisitors.css';

export default function TrafficSourcesPieChart(props) {

  const pieCanvasRef = useRef();
  const { selecteddatesMulti, solodate, solodatedate, currentsiteid } = props;

  // Create a ref for the pie chart
  const pieRef = useRef();

  //only use once ref 
  const loadoncepie = useRef(false);


  const [labels, setLabels] = useState([])

  const [campaignTraffic, setCampaignTraffic] = useState([]);
  const [directTraffic, setDirectTraffic] = useState([]);
  const [searchTraffic, setSearchTraffic] = useState([]);
  const [socialTraffic, setSocialTraffic] = useState([]);
  const [otherTraffic, setOtherTraffic] = useState([]);

  const [datayestoshow, setDatayestoshow] = useState([]); // State to hold pie chart data 

  const [piedata, setPieData] = useState([]); // State to hold pie chart data



  useEffect(() => {
    console.log(selecteddatesMulti, 'selecteddatesMulti in TrafficSourcesPieChart');
    console.log(solodate, 'solodate in TrafficSourcesPieChart');
    console.log(solodatedate, 'solodatedate in TrafficSourcesPieChart');
    console.log(currentsiteid, 'currentsiteid in TrafficSourcesPieChart');
    function getCsrfToken() {
      if (typeof document !== 'undefined') {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith('csrfToken='))
          ?.split('=')[1];
      }
      return null; // Return null if running on the server
    }
    const csrfToken = getCsrfToken(); // Get CSRF token from cookies


    if (!currentsiteid || currentsiteid === '') {
      console.log('No site selected, skipping fetch');
      return;
    }

    const fetchtrafficsources = async () => {
      console.log('fetchtrafficsources')
      if (!selecteddatesMulti || selecteddatesMulti.length === 0) {
        return
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/gettrafficsources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken, // Include CSRF token in the request headers
          },
          body: JSON.stringify({
            daterange: selecteddatesMulti,
            solodate: solodate,
            solodatedate: solodatedate,
            selectedsite: currentsiteid || '', // Use selectedsite state
          }),
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          console.log('fetchnotok222111');
          return;
        }

        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          console.log('No data received from the server');
          setDatayestoshow(false)
          return;
        }
        setDatayestoshow(true)
        console.log(data, 'trafficsourcesdata');

        const trafficsources = data.trafficSources;

        const totaltraffic = Object.values(trafficsources).reduce((sum, val) => {
          if (typeof val === 'number') {
            return sum + val;
          }
          return sum;
        }, 0);

        console.log(totaltraffic, 'totaltraffic');

        const directtraf = ((trafficsources.direct / totaltraffic) * 100).toFixed(0);
        const campaigntraf = ((trafficsources.campaigntrafficCount
          / totaltraffic) * 100).toFixed(0);
        const searchtraf = ((trafficsources.search / totaltraffic) * 100).toFixed(0);
        const socialtraf = ((trafficsources.social / totaltraffic) * 100).toFixed(0);
        const othertraf = ((trafficsources.other / totaltraffic) * 100).toFixed(0);

        setCampaignTraffic(campaigntraf);
        setDirectTraffic(directtraf);
        setSearchTraffic(searchtraf);
        setSocialTraffic(socialtraf);
        setOtherTraffic(othertraf);



        let arrayforpie = [];
        arrayforpie.push(directtraf);
        arrayforpie.push(searchtraf);
        arrayforpie.push(socialtraf);
        arrayforpie.push(campaigntraf);
        arrayforpie.push(othertraf);

        setPieData(arrayforpie);

      }
      catch (error) {
        console.log('Error fetching traffic sources:', error);
      }
    };

    fetchtrafficsources();
  }, [selecteddatesMulti, solodate, solodatedate, currentsiteid]); // Re-run 
  // 
  // effect when dependencies change


  useEffect(() => {
    //MAKE SURE ONLY LOADS ONE 
    if (loadoncepie.current) {
      return;
    }
    //make sure window has loaded and document
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    if (datayestoshow) {

      if (pieRef.current) pieRef.current.destroy();
      const ctxa = pieCanvasRef.current.getContext('2d');
      pieRef.current = new Chart(ctxa, {
        type: 'pie',
        data: {
          labels: ['Direct', 'Search Engines', 'Social Media', 'Campaigns', 'Other'], //labels,
          datasets: [{
            label: '',
            data: piedata,

            backgroundColor: [
              '#1f77b4',
              '#2ca02c',
              '#d62728',
              '#ff7f0e',
              '#9467bd'
            ],

          }, //dataonlynomonth
          ]
          //dataon
        },
        options: {
          plugins: {
            legend: {
              display: false,
              position: 'right', // Move the legend to the left

            },
            title: {
              display: false
            },
            tooltip: {
              bodyFont: {
                size: 16 // Increase font size for hover labels
              },
              callbacks: {
                /*     beforeTitle: function () { return ''; },
                    title: function () { return ''; },
                    afterTitle: function () { return ''; },
                    beforeLabel: function () { return ''; }, */
                label: function (context) {
                  // Access the value directly from the context parameter
                  return context.raw + '%';
                },
              }
            }
          }
        },


      });
    }
  }, [piedata]); // Re-run effect when data changes

  return (
    <>


      <div className="flex flex-row justify-start flex-wrap">
        <div className="flex-1 piechartdiv-trafficsource">
          <canvas ref={pieCanvasRef} className="piecharttrafficsource" />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="flex-1 flex flex-col justify-center fontsize2">
            <span><div className="colorboxpiecharttraffic directcb"></div>Direct:
              <strong> {directTraffic}%</strong></span>
            <span><div className="colorboxpiecharttraffic searchcb"></div>Search Engines:
              <strong> {searchTraffic}%</strong>
            </span>
            <span><div className="colorboxpiecharttraffic socialcb"></div>Social Media:
              <strong> {socialTraffic}%</strong>
            </span>
            <span><div className="colorboxpiecharttraffic campaigncb"></div>Campaigns
              <strong>  {campaignTraffic}%</strong>
            </span>
            <span><div className="colorboxpiecharttraffic othertrcd"></div>Other Traffic
              <strong> {otherTraffic}%</strong></span>
          </div>
        </div>
      </div>


    </>
  );
}