import { useState, useEffect } from 'react';


export default function TopReferrers({ referrals }) {




  useEffect(() => {
    console.log(referrals, '22');

  }, [referrals]);

  return (
    <>
      <div className="referralsdiv">
        <h4>Top Referrers</h4>
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


              <span className="referrer-visits">{referrer.count}</span>
            </div>
          ))}
        </div>

      </div>

    </>
  )


}