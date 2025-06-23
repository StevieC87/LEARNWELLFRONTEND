'use client'
import './GDPR.css';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import PostAnalytics from './PostAnalytics';
import { useParams } from 'next/navigation';

//! How it works
//if user accepts: we use local storage
//if user declines: we use session storage

export default function GDPR() {

  const params = useParams();
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
  // . ----------------------


  // SEE PREEXISTING CONSENT DECISION: TRIGGER POPUP / LAUNCH ANALYTICS
  // =============================================================
  //. on page load - whether to show popup or not
  useEffect(() => {

    //2 Check if user has already decided on choice 
    const consent = localStorage.getItem("AnalyticsConsent");


    if (!consent) {
      setIsVisible(true);  //trigger popup 
      //enable basic analytics
      //enableBasicAnalytics(false); //whether SAME OR NEW SESSION

    }

    //2b if consent detected - see if it is true or false
    else if (consent) {
      //NEED TO MAKE SURE TO PARSE THE JSON
      const parsedConsent = JSON.parse(consent);

      if (parsedConsent.analytics === true) {
        //  alert('has consented')
        //IF HAS CONSENTED IN THE PAST
        setIsVisible(false); //dont trigger popup
        // enableAnalytics(true);  //'argument if if previous consent yes
      }
      else if (parsedConsent.analytics === false) {
        //IF HAS NOT CONSENTED IN THE PAST
        setIsVisible(false); //dont trigger popup
        //enableBasicAnalytics(true); //whether SAME OR NEW SESSION
        //save that consent is no 
        fsetConsentLS(false);

        //! Dont change SESSION ID NUMBER HERE

      }
    }

  }, [langslug,]);
  //2 =============================================================


  //1 HANDLING USER CHOICES WHEN CLICKING ON THE BUTTONS
  //1 ========================================================
  const handleAccept = () => {
    setIsVisible(false);
    // enableAnalytics(false);
  };
  const handleDecline = () => {
    setIsVisible(false);
    fsetConsentLS(false);

  };
  //1 ========================================================

  //4 FUNCTIONS FOR DOING ANALYTICS
  //6 ==================================== 
  let useranalyticsID = '';
  let neworreturning = '';


  function fsetConsentLS(trueorfalse) {
    const consentData = { analytics: trueorfalse, marketing: false };
    localStorage.setItem("AnalyticsConsent", JSON.stringify(consentData));

  }

  function isitBot() {  //if bot returns true
    if (!navigator.cookieEnabled) return true; // Bots often disable cookies
    if (!window.innerWidth || !window.innerHeight) return true; // Headless browsers often lack dimensions
    if (!window.requestAnimationFrame) return true; // Old bots don't support this
    // Use WebGL to detect headless browsers
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return true; // Some bots disable WebGL
    } catch (e) {
      return true
    }
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



