import { createSlice } from "@reduxjs/toolkit";

const AnalyticsSlice = createSlice({
  name: "AnalyticsSlice",
  // A function, so each store (one per server request) takes its own startdate.
  initialState: () => ({
    currentsiteid: "",
    currentsitedomain: "",
    // Shown beside each page title (SiteTag) when the account has more than one site.
    currentsitename: "",
    sitecount: 0,
    // Other sites on the dashboard: "compare" adds their chart lines, "combine"
    // merges them into every card (useSiteMerge).
    extrasites: [],
    extrasitesmode: "compare",
    triggerfetch: 0, // Added triggerfetch to the initial state
    currentsizetimezone: "",
    countryfilter: "",
    cityfilter: "",
    regionfilter: "",
    browserfilter: "",
    browserlanguagefilter: "",
    devicefilter: "",
    osfilter: "",
    screenheightfilter: "",
    screenwidthfilter: "",
    hostfilter: "",
    visitorfilter: "",
    bucketfilter: "",
    topvisitedpagefilter: "",
    topentrypagefilter: "",
    topexitpagefilter: "",
    userflowfilter: "",
    funnelfilter: "",
    funnelfilterName: "",
    topreferrerfilter: "",
    eventnamefilter: "",
    eventlabelfilter: "",
    eventvariantfilter: "",
    eventvaluefilter: "",
    trafficsourcefilter: "",
    socialmediafilter: "",
    searchenginefilter: "",
    campaignnamefilter: "",
    campaignsourcefilter: "",
    campaignmediumfilter: "",
    hourfilter: "",
    dayfilter: "",
    visitdepthfilter: "",
    bouncefilter: "",
    sessiondurationfilter: "",
    goalfilter: "",
    goalfilterName: "",
    engagedtimefilter: "",
    speedfilter: "",
    frustrationfilter: "",
    // Suspicious visits (Security page): "hide", "only", or "show" (counted even
    // when the site leaves them out); "" is the site's setting.
    botfilter: "",
    abtestfilter: "",
    surveyfilter: "",
    cohortfilter: "",
    cohortfilterName: "",
    // Property conditions, a JSON list (filters/propertyConditions.js): of a
    // custom event, or of the signed-in person (identify).
    propertyfilter: "",
    userpropertyfilter: "",
    outboundfilter: "",
    downloadfilter: "",
    revenuefilter: "",
    campaigntermfilter: "",
    campaigncontentfilter: "",
    scrollfilter: "",
    durationfilter: "",
    islive: false,
    customdates: [],
    startdate: new Date().toISOString(),
    enddate: "",
    selecteddatesMulti: [],
    isopendatepicker: false,
    fiveMinutesAgo: null,
    ismodalshowmoreOpen: false,
    modalshowmoreComponent: "",
    savedduration: "",
    saveddurationstartdate: "",
    saveddurationenddate: "",
    triggercustomdaterangechange: 0,
    publicmode: false,
    // A public dashboard's longest range in days, 0 for none (rangeCap.js).
    publicMaxRangeDays: 0,
  }),
  reducers: {
    setcurrentsiteid: (state, action) => {
      state.currentsiteid = action.payload;
    },
    setExtraSites: (state, action) => {
      state.extrasites = action.payload;
    },
    setExtraSitesMode: (state, action) => {
      state.extrasitesmode = action.payload;
    },
    setcurrentsitedomain: (state, action) => {
      state.currentsitedomain = action.payload;
    },
    setcurrentsitename: (state, action) => {
      state.currentsitename = action.payload;
    },
    setsitecount: (state, action) => {
      state.sitecount = action.payload;
    },
    incrementTriggerFetch: (state) => {
      state.triggerfetch += 1;
    },
    setCurrentSiteTimezone: (state, action) => {
      state.currentsizetimezone = action.payload;
    },
    setCountryFilter: (state, action) => {
      state.countryfilter = action.payload;
    },
    setCityFilter: (state, action) => {
      state.cityfilter = action.payload;
    },
    setRegionFilter: (state, action) => {
      state.regionfilter = action.payload;
    },
    setBrowserFilter: (state, action) => {
      state.browserfilter = action.payload;
    },
    setBrowserLanguageFilter: (state, action) => {
      state.browserlanguagefilter = action.payload;
    },
    setDeviceFilter: (state, action) => {
      state.devicefilter = action.payload;
    },
    setOSFilter: (state, action) => {
      state.osfilter = action.payload;
    },
    setScreenHeightFilter: (state, action) => {
      state.screenheightfilter = action.payload;
    },
    setScreenWidthFilter: (state, action) => {
      state.screenwidthfilter = action.payload;
    },
    setVisitorFilter: (state, action) => {
      state.visitorfilter = action.payload;
    },
    setBucketFilter: (state, action) => {
      state.bucketfilter = action.payload;
    },
    setHostFilter: (state, action) => {
      state.hostfilter = action.payload;
    },
    setTopVisitedPageFilter: (state, action) => {
      state.topvisitedpagefilter = action.payload;
    },
    setTopEntryPageFilter: (state, action) => {
      state.topentrypagefilter = action.payload;
    },
    setTopExitPageFilter: (state, action) => {
      state.topexitpagefilter = action.payload;
    },
    setUserFlowFilter: (state, action) => {
      state.userflowfilter = action.payload;
    },
    setFunnelFilter: (state, action) => {
      state.funnelfilter = action.payload;
    },
    setFunnelFilterName: (state, action) => {
      state.funnelfilterName = action.payload;
    },
    setTopReferrerFilter: (state, action) => {
      state.topreferrerfilter = action.payload;
    },
    setEventNameFilter: (state, action) => {
      state.eventnamefilter = action.payload;
    },
    setEventLabelFilter: (state, action) => {
      state.eventlabelfilter = action.payload;
    },
    setEventVariantFilter: (state, action) => {
      state.eventvariantfilter = action.payload;
    },
    setEventValueFilter: (state, action) => {
      state.eventvaluefilter = action.payload;
    },
    setTrafficSourceFilter: (state, action) => {
      state.trafficsourcefilter = action.payload;
    },
    setSocialMediaFilter: (state, action) => {
      state.socialmediafilter = action.payload;
    },
    setSearchEngineFilter: (state, action) => {
      state.searchenginefilter = action.payload;
    },
    setCampaignNameFilter: (state, action) => {
      state.campaignnamefilter = action.payload;
    },
    setCampaignSourceFilter: (state, action) => {
      state.campaignsourcefilter = action.payload;
    },
    setCampaignMediumFilter: (state, action) => {
      state.campaignmediumfilter = action.payload;
    },
    setHourFilter: (state, action) => {
      state.hourfilter = action.payload;
    },
    setDayFilter: (state, action) => {
      state.dayfilter = action.payload;
    },
    setVisitDepthFilter: (state, action) => {
      state.visitdepthfilter = action.payload;
    },
    setBounceFilter: (state, action) => {
      state.bouncefilter = action.payload;
    },
    setSessionDurationFilter: (state, action) => {
      state.sessiondurationfilter = action.payload;
    },
    setGoalFilter: (state, action) => {
      state.goalfilter = action.payload;
      if (!action.payload) state.goalfilterName = "";
    },
    setGoalFilterName: (state, action) => {
      state.goalfilterName = action.payload;
    },
    setEngagedTimeFilter: (state, action) => {
      state.engagedtimefilter = action.payload;
    },
    setSpeedFilter: (state, action) => {
      state.speedfilter = action.payload;
    },
    setFrustrationFilter: (state, action) => {
      state.frustrationfilter = action.payload;
    },
    setBotFilter: (state, action) => {
      state.botfilter = action.payload;
    },
    setAbTestFilter: (state, action) => {
      state.abtestfilter = action.payload;
    },
    setSurveyFilter: (state, action) => {
      state.surveyfilter = action.payload;
    },
    // A saved cohort (group of people): "<id>" or "not:<id>".
    setCohortFilter: (state, action) => {
      state.cohortfilter = action.payload;
      if (!action.payload) state.cohortfilterName = "";
    },
    setPropertyFilter: (state, action) => {
      state.propertyfilter = action.payload;
    },
    setUserPropertyFilter: (state, action) => {
      state.userpropertyfilter = action.payload;
    },
    setCohortFilterName: (state, action) => {
      state.cohortfilterName = action.payload;
    },
    setOutboundFilter: (state, action) => {
      state.outboundfilter = action.payload;
    },
    setDownloadFilter: (state, action) => {
      state.downloadfilter = action.payload;
    },
    setRevenueFilter: (state, action) => {
      state.revenuefilter = action.payload;
    },
    setCampaignTermFilter: (state, action) => {
      state.campaigntermfilter = action.payload;
    },
    setCampaignContentFilter: (state, action) => {
      state.campaigncontentfilter = action.payload;
    },
    setScrollFilter: (state, action) => {
      state.scrollfilter = action.payload;
    },
    setDurationFilter: (state, action) => {
      state.durationfilter = action.payload;
    },
    setIsLive: (state, action) => {
      state.islive = action.payload;
    },
    setCustomDates: (state, action) => {
      state.customdates = action.payload;
    },

    setStartDate: (state, action) => {
      state.startdate = action.payload;
    },
    setEndDate: (state, action) => {
      state.enddate = action.payload;
    },
    setSelecteddatesMulti: (state, action) => {
      state.selecteddatesMulti = action.payload;
    },
    setIsOpenDatePicker: (state, action) => {
      state.isopendatepicker = action.payload;
    },
    setFiveMinutesAgo: (state, action) => {
      state.fiveMinutesAgo = action.payload;
    },
    setIsModalShowMoreOpen: (state, action) => {
      state.ismodalshowmoreOpen = action.payload;
    },
    setModalShowMoreComponent: (state, action) => {
      state.modalshowmoreComponent = action.payload;
    },
    setSavedDuration: (state, action) => {
      state.savedduration = action.payload;
    },
    setTriggerCustomDaterangeChange: (state) => {
      state.triggercustomdaterangechange += 1;
    },
    setSavedDurationStartDate: (state, action) => {
      state.saveddurationstartdate = action.payload;
    },
    setSavedDurationEndDate: (state, action) => {
      state.saveddurationenddate = action.payload;
    },
    setPublicMode: (state, action) => {
      state.publicmode = action.payload;
    },
    setPublicMaxRangeDays: (state, action) => {
      state.publicMaxRangeDays = action.payload;
    },
    // Filters and the range only. The site, its timezone and its saved range
    // (what the date picker opens on) are the site's settings, which
    // SiteSelection applies alongside this on a switch.
    setClearFilters: (state) => {
      state.countryfilter = "";
      state.cityfilter = "";
      state.regionfilter = "";
      state.browserfilter = "";
      state.browserlanguagefilter = "";
      state.devicefilter = "";
      state.osfilter = "";
      state.screenheightfilter = "";
      state.screenwidthfilter = "";
      state.hostfilter = "";
      state.visitorfilter = "";
      state.bucketfilter = "";
      state.topvisitedpagefilter = "";
      state.topentrypagefilter = "";
      state.topexitpagefilter = "";
      state.userflowfilter = "";
      state.funnelfilter = "";
      state.funnelfilterName = "";
      state.topreferrerfilter = "";
      state.eventnamefilter = "";
      state.eventlabelfilter = "";
      state.eventvariantfilter = "";
      state.eventvaluefilter = "";
      state.trafficsourcefilter = "";
      state.socialmediafilter = "";
      state.searchenginefilter = "";
      state.campaignnamefilter = "";
      state.campaignsourcefilter = "";
      state.campaignmediumfilter = "";
      state.hourfilter = "";
      state.dayfilter = "";
      state.visitdepthfilter = "";
      state.bouncefilter = "";
      state.sessiondurationfilter = "";
      state.goalfilter = "";
      state.goalfilterName = "";
      state.engagedtimefilter = "";
      state.speedfilter = "";
      state.frustrationfilter = "";
      state.botfilter = "";
      state.abtestfilter = "";
      state.surveyfilter = "";
      state.cohortfilter = "";
      state.cohortfilterName = "";
      state.propertyfilter = "";
      state.userpropertyfilter = "";
      state.outboundfilter = "";
      state.downloadfilter = "";
      state.revenuefilter = "";
      state.campaigntermfilter = "";
      state.campaigncontentfilter = "";
      state.scrollfilter = "";
      state.durationfilter = "";
      state.islive = false;
      state.customdates = [];
      state.startdate = new Date().toISOString();
      state.enddate = "";
      state.selecteddatesMulti = [];
      state.isopendatepicker = false;
      state.fiveMinutesAgo = null;
      state.ismodalshowmoreOpen = false;
      state.modalshowmoreComponent = "";
      state.triggercustomdaterangechange = 0;
      state.publicmode = false;
      state.publicMaxRangeDays = 0;
    },
  },
});

export const {
  setcurrentsiteid,
  setExtraSites,
  setExtraSitesMode,
  setcurrentsitedomain,
  setcurrentsitename,
  setsitecount,
  incrementTriggerFetch,
  setCurrentSiteTimezone,
  setCountryFilter,
  setCityFilter,
  setRegionFilter,
  setBrowserFilter,
  setBrowserLanguageFilter,
  setDeviceFilter,
  setOSFilter,
  setScreenHeightFilter,
  setScreenWidthFilter,
  setHostFilter,
  setVisitorFilter,
  setBucketFilter,
  setTopVisitedPageFilter,
  setTopEntryPageFilter,
  setTopExitPageFilter,
  setTopReferrerFilter,
  setUserFlowFilter,
  setEventNameFilter,
  setEventLabelFilter,
  setEventVariantFilter,
  setEventValueFilter,
  setTrafficSourceFilter,
  setSocialMediaFilter,
  setSearchEngineFilter,
  setCampaignNameFilter,
  setCampaignSourceFilter,
  setCampaignMediumFilter,
  setHourFilter,
  setDayFilter,
  setVisitDepthFilter,
  setBounceFilter,
  setSessionDurationFilter,
  setGoalFilter,
  setGoalFilterName,
  setEngagedTimeFilter,
  setSpeedFilter,
  setFrustrationFilter,
  setBotFilter,
  setAbTestFilter,
  setSurveyFilter,
  setCohortFilter,
  setCohortFilterName,
  setPropertyFilter,
  setUserPropertyFilter,
  setOutboundFilter,
  setDownloadFilter,
  setRevenueFilter,
  setCampaignTermFilter,
  setCampaignContentFilter,
  setScrollFilter,
  setDurationFilter,
  setIsLive,
  setCustomDates,
  setStartDate,
  setEndDate,
  setSelecteddatesMulti,
  setIsOpenDatePicker,
  setFiveMinutesAgo,
  setIsModalShowMoreOpen,
  setModalShowMoreComponent,
  setSavedDuration,
  setTriggerCustomDaterangeChange,
  setSavedDurationStartDate,
  setSavedDurationEndDate,
  setPublicMode,
  setPublicMaxRangeDays,
  setFunnelFilter,
  setFunnelFilterName,
  setClearFilters,
} = AnalyticsSlice.actions;

export default AnalyticsSlice.reducer;
