import { useState, useEffect } from 'react';
import TrafficSourcesPieChart from "./TrafficSourcesPieChart.jsx"; // Import TrafficSourcesPieChart component
import TopSearchEngines from "./TopSearchEngines.jsx"; // Import TopSearchEngines component
import TopSocialMedia from "./TopSocialMedia.jsx";
import { formatNumber } from '../useful/utilites.js'; // Import formatNumber function

export default function TopReferrers(props) {

  const { referrals, selecteddatesMulti, solodate, solodatedate, currentsiteid } = props;

  const [divtoshow, setDivtoShow] = useState('topreferrers'); // State to control which div to show


  useEffect(() => {
    // console.log(referrals, '22');

  }, [referrals]);

  return (
    <>

      <div className="referralsdiv">
        <div className="flex flex-row justify-between">
          <h4>
            {divtoshow === 'topreferrers' ? 'Top Referrers' :
              divtoshow === 'trafficsources' ? 'Traffic Sources' :
                divtoshow === 'topsocialmedia' ? 'Top Social Media' :
                  divtoshow === 'topsearchengines' ? 'Top Search Engines' :
                    ''
            }


          </h4>
          <div className="flex flex-row gap-5">
            <button className={` ${divtoshow === 'topreferrers' ? 'analyticscardactive' : 'analyticscardinactive'}`} onClick={() => setDivtoShow('topreferrers')}>Referrers</button>
            <button className={` ${divtoshow === 'trafficsources' ? 'analyticscardactive' : 'analyticscardinactive'}`} onClick={() => setDivtoShow('trafficsources')}>Traffic Sources</button>
            <button className={` ${divtoshow === 'topsocialmedia' ? 'analyticscardactive' : 'analyticscardinactive'}`} onClick={() => setDivtoShow('topsocialmedia')}>Social Media</button>
            <button className={` ${divtoshow === 'topsearchengines' ? 'analyticscardactive' : 'analyticscardinactive'}`} onClick={() => setDivtoShow('topsearchengines')}>Search Engines</button>
          </div>
        </div>
        {divtoshow === 'topreferrers' && (
          <>
            <div className="referralstitles">

              <span className="referrer-name">Url</span>
              <span className="referrer-visits">Total visits</span>
              {/*           <span className="referrer-visits">Returning visits</span>
          <span className="referrer-visits">New visits</span> */}
            </div>
            <div className="referralstuff">
              {referrals && referrals.map((referrer, index) => (
                <div key={index}
                  className={`referrer-item ${index % 2 === 0 ? 'even' : 'odd'}`}>

                  <span className="referrer-name">{referrer.referrer}</span>


                  <span className="referrer-visits">{formatNumber(referrer.count)}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {divtoshow === 'topsocialmedia' && <TopSocialMedia currentsiteid={currentsiteid} selecteddatesMulti={selecteddatesMulti || []} solodate={solodate || false} solodatedate={solodatedate || ''} />}
        {divtoshow === 'topsearchengines' && <TopSearchEngines currentsiteid={currentsiteid} selecteddatesMulti={selecteddatesMulti || []} solodate={solodate || false} solodatedate={solodatedate || ''} />}
        {divtoshow === 'trafficsources' && <TrafficSourcesPieChart selecteddatesMulti={selecteddatesMulti || []} solodate={solodate || false} solodatedate={solodatedate || ''} currentsiteid={currentsiteid} />}

      </div>
      {/*    <TrafficSourcesPieChart selecteddatesMulti={selecteddatesMulti || []} solodate={solodate || false} solodatedate={solodatedate || ''} currentsiteid={currentsiteid} />
      <TopSearchEngines currentsiteid={currentsiteid} selecteddatesMulti={selecteddatesMulti || []} solodate={solodate || false} solodatedate={solodatedate || ''} />
      <TopSocialMedia currentsiteid={currentsiteid} selecteddatesMulti={selecteddatesMulti || []} solodate={solodate || false} solodatedate={solodatedate || ''} /> */}
    </>
  )


}