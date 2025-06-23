'use client'
import './GDPR.css';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import PostAnalytics from './PostAnalytics';
import { useParams } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import { enableFullAnalytics } from './userconsents.js';
import { enableBasicAnalytics } from './userrejects.js';

//! How it works
//if user accepts: we use local storage
//if user declines: we use session storage

export default function GDPR() {

  const params = useParams();
  //NEED TO TRIGGER THE FETCH ON EACH URL CHANGE OR param or query change 
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const langslug = params.slug; // assuming your file is [slug]/page.js
  const [isVisible, setIsVisible] = useState(false);
  //.cookie policy pages 
  let arraypolicypages = [
    ["en", "cookiespolicy"],
    ["es", "politicadecookies"],
    ["fr", "politique-de-cookies"],
    ["de", "cookie-richtlinie"]
  ]
  let appropriatePolicyPage = arraypolicypages.find(item => item[0] === langslug);
  const url = `/${langslug}/appropriatePolicyPage[1]`;


  //. on page load - whether to show popup or not
  useEffect(() => {
    // Check if user has already decided on choice 
    const consent = localStorage.getItem("AnalyticsConsent");
    if (!consent) {
      setIsVisible(true);  //trigger popup 
    }
    // if consent detected - see if it is true or false
    else if (consent) {
      const parsedConsent = JSON.parse(consent);
      if (parsedConsent.analytics === true) {
        //IF HAS CONSENTED IN THE PAST  - accepted
        setIsVisible(false); //dont trigger popup
        fsetConsentLS(true);
        enableFullAnalytics();  //'argument if if previous consent yes

      }
      else if (parsedConsent.analytics === false) {
        //IF HAS NOT CONSENTED IN THE PAST
        setIsVisible(false); //dont trigger popup
        enableBasicAnalytics(); //whether SAME OR NEW SESSION
        fsetConsentLS(false);
      }
    }
  }, [langslug, pathname, searchParams]);
  //2 =============================================================


  const handleAccept = () => {
    setIsVisible(false);
    enableFullAnalytics();
    fsetConsentLS(true)
  };
  const handleDecline = () => {
    setIsVisible(false);
    fsetConsentLS(false);
    enableBasicAnalytics();
  };

  function fsetConsentLS(trueorfalse) {
    const consentData = { analytics: trueorfalse, marketing: false };
    localStorage.setItem("AnalyticsConsent", JSON.stringify(consentData));

  }

  if (!isVisible) return null;

  return (
    <div className="gdpr-banner">
      <div className="gdpr-inner">
        <div className="gdpr-text"><p>
          This site uses cookies. Visit our <Link className="url" href={url}>cookies policy page</Link> or click the link in the footer for more information and to change your preferences.</p></div>
        <div className="gdpr-buttons">
          <div>
            <button className="button1" onClick={handleAccept}>Accept</button>
          </div>
          <div>
            <button className="button1" onClick={handleDecline}>Decline</button>
          </div>
        </div>
      </div>
    </div>
  );
};



