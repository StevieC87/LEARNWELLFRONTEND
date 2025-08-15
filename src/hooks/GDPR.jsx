'use client'
import './css/GDPR.css';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import GetUrlParams from '../../hooks/GetURLParamsClient';
import PostAnalytics from '../../hooks/PostAnalytics';
import { useSelector } from 'react-redux';
import ReduxProvider from "../ReduxProvider";


// issue: if declines conset - RETRIGGERS BASIC ANALYTICS - FIX 
// ISSUE: if session only - and change page - doesnt trigger analytic s again 
const GDPR = () => {

  const [isVisible, setIsVisible] = useState(false);
  const { langslug, pathname } = GetUrlParams();
  const url = `/${langslug}/cookiespolicy`;

  const currentdifficultyR = useSelector(
    (state) => state.NewsSlice.currentdifficultyR
  );

  const enableAnalytics = useCallback((previousconsentYes) => {

    if (!previousconsentYes) {
      //if it has not been accepted before - so user click on accept
      fsetConsentLS(true);
    }
    const checkanalyticsidLS = localStorage.getItem("SimpleNewsanalyticsID");
    // console.log(checkanalyticsidLS, 'checkanalyticsidLS');

    if (checkanalyticsidLS) {
      // alert('returning')
      neworreturning = 'returning';
      useranalyticsID = checkanalyticsidLS;
      localStorage.setItem("SimpleNewsanalyticsID", useranalyticsID);
      if (isitBot()) return;
      PostAnalytics(useranalyticsID, neworreturning, currentdifficultyR);
    }
    //check if session id - and use that for localstorage id
    const checkanalyticsidSS = sessionStorage.getItem("SimpleNewsanalyticsID");
    if (checkanalyticsidSS) {
      // alert('session id')
      //! NO IF FIRST PAGE VISIT - shuldl say 'new'
      neworreturning = 'returning';
      useranalyticsID = checkanalyticsidSS;
      //delete session id
      sessionStorage.removeItem("SimpleNewsanalyticsID", useranalyticsID);
      //here i think we don't need to post it again 
      localStorage.setItem("SimpleNewsanalyticsID", useranalyticsID);
    }


    //LOOK FOR PRE-EXISTING USER ID (in both cases to be sure )

    //if not create 
    else if (!checkanalyticsidLS && !checkanalyticsidSS) {
      // alert('new')
      neworreturning = 'new';
      const randomId = crypto.randomUUID();
      useranalyticsID = randomId;
      localStorage.setItem("SimpleNewsanalyticsID", useranalyticsID);
      if (isitBot()) return;
      PostAnalytics(useranalyticsID, neworreturning, currentdifficultyR);
    }


  }, []);
  const enableBasicAnalytics = useCallback((samesession) => {
    // alert('basic analytics')
    //! maybe in future could refine this further 
    if (samesession) {
      neworreturning = 'returning';
    }
    else {
      neworreturning = 'new';
    }
    //HERE ONLY SESSION ANALYTICS - no tracking returning / across sessions/days
    //alert('basic analytics')

    //delete useranalyticsID if existing
    if (useranalyticsID) {
      //delete useranalyticsID
      localStorage.removeItem("SimpleNewsanalyticsID", useranalyticsID);
    }
    //CREATE SESSION ID 
    //IF NO SESSION ID, SET
    const checkanalyticsidSS = sessionStorage.getItem("SimpleNewsanalyticsID");
    if (!checkanalyticsidSS) {
      neworreturning = 'new';
      const randomId = crypto.randomUUID();
      //  console.log(randomId, 'randomId');
      //  console.log('consent but no id - set id')

      sessionStorage.setItem("SimpleNewsanalyticsID", randomId);
      useranalyticsID = randomId;
    }
    else {
      //use existing session id
      useranalyticsID = checkanalyticsidSS;
      neworreturning = 'returning';
    }


    // deleteCookies();
    /* // clearLocalStorage();
    let isbotornot = isitBot();
    if (isbotornot) {
      return;
    } */
    if (isitBot()) return;
    PostAnalytics(useranalyticsID, neworreturning, currentdifficultyR);

  }, []);

  //2 SEE PREEXISTING CONSENT DECISION: TRIGGER POPUP / LAUNCH ANALYTICS
  //2 =============================================================
  useEffect(() => {
    // alert('uese effect triggered')
    //2 Check if user has already decided on choice 
    const consent = localStorage.getItem("SimpleNewsAnalyticsConsent");
    //2 if no consent detected

    if (!consent) {

      // alert('no consent')
      setIsVisible(true);  //trigger popup 
      //enable basic analytics
      enableBasicAnalytics(false); //whether SAME OR NEW SESSION

    }

    //2b if consent detected - see if it is true or false
    else if (consent) {
      //NEED TO MAKE SURE TO PARSE THE JSON
      const parsedConsent = JSON.parse(consent);

      if (parsedConsent.analytics === true) {
        //  alert('has consented')
        //IF HAS CONSENTED IN THE PAST
        setIsVisible(false); //dont trigger popup
        enableAnalytics(true);  //'argument if if previous consent yes
      }
      else if (parsedConsent.analytics === false) {
        //  alert('has not consented and choice saved')
        //IF HAS NOT CONSENTED IN THE PAST
        setIsVisible(false); //dont trigger popup
        enableBasicAnalytics(true); //whether SAME OR NEW SESSION
        //save that consent is no 
        fsetConsentLS(false);

        //! Dont change SESSION ID NUMBER HERE

      }
    }

  }, [pathname, langslug, currentdifficultyR, enableAnalytics, enableBasicAnalytics]);
  //2 =============================================================


  //1 HANDLING USER CHOICES WHEN CLICKING ON THE BUTTONS
  //1 ========================================================
  const handleAccept = () => {
    setIsVisible(false);
    enableAnalytics(false);
  };
  const handleDecline = () => {
    setIsVisible(false);
    fsetConsentLS(false);
    //! MAYBE HERE REMOVE ANY ANALYTICS - FOR COOKIE BUTTON LATER
    //! OR HANDLE COOKIE CHOICE BUTTON DIFFERENTLY 
  };
  //1 ========================================================
  //! ISSUE IS - IF REFRESH WITH LOCALSTORAGE - DOESNT SEEM TO TRIGGER POST - CHECK THIS AGAIN 

  //4 FUNCTIONS FOR DOING ANALYTICS
  //6 ==================================== 
  let useranalyticsID = '';
  let neworreturning = '';


  function fsetConsentLS(trueorfalse) {
    const consentData = { analytics: trueorfalse, marketing: false };
    localStorage.setItem("SimpleNewsAnalyticsConsent", JSON.stringify(consentData));

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


const WrappedGDPR = (props) => (
  <ReduxProvider>
    <GDPR />
  </ReduxProvider>
);

export default WrappedGDPR;


/*
   const enableMarketing = () => {
     //empty for now
   };
   const deleteCookies = () => {
     //delete localstorage with unique id
     //localStorage.removeItem("SimpleNewsanalytics");
     //FOR THE BUTTONS - to delete localstorage
     //  document.cookie.split(";").forEach((cookie) => {
     //    const name = cookie.split("=")[0].trim();
     //   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
     // });
   };
   const clearLocalStorage = () => {
     // localStorage.removeItem("_ga");
 
   }; */
