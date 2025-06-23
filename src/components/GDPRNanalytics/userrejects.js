import { isitBot } from "./analyticsfunctions.js";
import PostAnalytics from "./PostAnalytics";

export const enableBasicAnalytics = () => {
  localStorage.removeItem("analyticsID");
  let useranalyticsID = "";
  let neworreturning = "";

  const checkanalyticsidSS = sessionStorage.getItem("analyticsID");
  if (!checkanalyticsidSS) {
    neworreturning = "new";
    const randomId = crypto.randomUUID();
    sessionStorage.setItem("analyticsID", randomId);
    useranalyticsID = randomId;
  } else {
    useranalyticsID = checkanalyticsidSS;
    neworreturning = "returning";
  }

  if (isitBot()) return;

  PostAnalytics(useranalyticsID, neworreturning);
};
