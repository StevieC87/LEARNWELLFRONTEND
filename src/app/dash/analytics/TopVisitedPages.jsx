import { useEffect } from 'react';
import Link from 'next/link';

export default function TopVisitedPages({ mostvisitedpages }) {

  useEffect(() => {
    if (!mostvisitedpages) {
      return;
    }
    console.log(mostvisitedpages, 'mostvisitedpages');
  }
    , [mostvisitedpages]);


  return (
    <>
      <div className="topvistedpagesouterdiv">
        <h4>Top Visited Pages</h4>
        <div className="topvisitedpagestitles">
          <span className="topvisitedpage-name">Page</span>
          <span className="topvisitedpage-visits">Total visits</span>
        </div>
        <div className="topvisitedpagesstuff"></div>
        {mostvisitedpages && mostvisitedpages.map((page, index) => (
          <div
            key={index}
            className={`topvisitedpage-item ${index % 2 === 0 ? 'even' : 'odd'}`}
          >
            <Link href={`${page._id}`} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
              </svg>
            </Link>
            <span className="topvisitedpage-name">{page._id}</span>
            <span className="topvisitedpage-visits">{page.totalVisits}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
          .topvistedpagesouterdiv {
            border-radius: 8px;
       
            background-color: #f9f9f9;
          }
          .topvisitedpagestitles {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
          }
          .topvisitedpage-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
          }
          .topvisitedpage-item.even {
            background-color: #f0f0f0;
          }
          .topvisitedpage-item.odd {
            background-color: #ffffff;
          }
          .topvisitedpage-name {
            font-weight: bold;
            flex: 3;
          }
          .topvisitedpage-visits {
            flex: 1;
          }
            @media (max-width: 600px) {
          .topvisitedpage-name {
            font-size: 1.2rem;   
        };
        `}</style>

    </>
  );
}