import { isitBot } from "./analyticsfunctions.js";
import PostAnalytics from "./PostAnalytics";

export const enableFullAnalytics = () => {
  const checkanalyticsidLS = localStorage.getItem("analyticsID");
  let useranalyticsID = "";
  let neworreturning = "";

  if (checkanalyticsidLS) {
    // alert('returning')
    neworreturning = "returning";
    useranalyticsID = checkanalyticsidLS;
    localStorage.setItem("analyticsID", useranalyticsID);
    if (isitBot()) return;
  } else if (!checkanalyticsidLS) {
    // alert('new')
    neworreturning = "new";
    const randomId = crypto.randomUUID();
    useranalyticsID = randomId;
    localStorage.setItem("analyticsID", useranalyticsID);
    if (isitBot()) return;
  }
  PostAnalytics(useranalyticsID, neworreturning);
};

/* //check if session id - and use that for localstorage id
  const checkanalyticsidSS = sessionStorage.getItem("analyticsID");
  if (checkanalyticsidSS) {
    // alert('session id')
    neworreturning = "returning";
    useranalyticsID = checkanalyticsidSS;
    //delete session id
    sessionStorage.removeItem("analyticsID", useranalyticsID);
    //here i think we don't need to post it again
    localStorage.setItem("analyticsID", useranalyticsID);
  } */

//LOOK FOR PRE-EXISTING USER ID (in both cases to be sure )

//if not create
