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
          <span className="referrer-visits">Returning visits</span>
          <span className="referrer-visits">New visits</span>
        </div>
        <div className="referralstuff">
          {referrals && referrals.map((referrer, index) => (
            <div key={index}
              className={`referrer-item ${index % 2 === 0 ? 'even' : 'odd'}`}>

              <span className="referrer-name">{referrer._id}</span>
              <span className="referrer-visits"> {referrer.totalUsers} </span>
              <span className="referrer-visits">{referrer.totalReturningUsers}</span>

              <span className="referrer-visits">{referrer.totalNewUsers}</span>
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
    `}</style>
      </div>

    </>
  )


}