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
        <style jsx>{`
      .referralsdiv {
       
       
        border-radius: 8px;
      }
      .referralstitles {
        margin-bottom: 10px;
            display: flex;
        justify-content: space-between;
        padding: 5px 0;
      }
      .referrer-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
       
      }
      .referrer-name {
        font-weight: bold;
        flex: 3;
      }
        .referrer-visits {
        flex: 1;
        text-align: center;
        }
         .referrer-item.even {
            background-color: #f0f0f0;
          }
          .referrer-item.odd {
            background-color: #ffffff;
          }
        @media (max-width: 600px) {
          .referrer-name {
            font-size: 1.2rem;   
        };
    `}</style>
      </div>

    </>
  )


}