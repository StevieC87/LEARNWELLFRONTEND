const PostAnalytics = async (useranalyticsID, neworreturning) => {
  let timestartedinhuman = new Date(Date.now()).toLocaleString(); // e.g., "2023-10-01 12:00:00"
  let dateonly = new Date(Date.now()).toLocaleDateString(); // e.g., "2023-10-01"

  try {
    let objectostringify = {
      neworreturning1: neworreturning,
      useranalyticsIDis: useranalyticsID,
      url: typeof window !== "undefined" ? window.location.pathname : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      browserlanguage:
        typeof navigator !== "undefined" ? navigator.language : "",
      screenresolution:
        typeof window !== "undefined"
          ? `${window.screen.width}x${window.screen.height}`
          : "",
      dateonly: dateonly,
      timestarted: Date.now(),
      timestartedinhuman: timestartedinhuman,
    };

    let stringify = JSON.stringify(objectostringify);
    //   console.log("stringify", stringify);
    //  console.log("hello");
    try {
      //console.log("attempting fetcgh");
      let url = `${process.env.NEXT_PUBLIC_API_URL}/analytics/postanalytics`;
      // console.log("url", url);
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: stringify,
      });
      //  console.log("hello2");
      //   console.log("response", response);
      if (!response.ok) {
        //   console.error("Failed to send analytics:", response.statusText);
      }
    } catch (error) {
      //     console.error("Error sending analytics:", error);
    }
  } catch (error) {
    //  console.error("Analytics error:", error);
  }
};

export default PostAnalytics;
