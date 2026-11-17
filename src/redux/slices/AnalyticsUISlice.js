import { createSlice } from "@reduxjs/toolkit";
import { setSelecteddatesMulti } from "./AnalyticsSlice.js";

// How many rows a card's table shows, picked per card from its control bar.
// Only fewer than the card's own count: cards fetch exactly their `limit`
// (10), so a larger pick would have nothing more to show. null = the card's own.
export const ROW_CAPS = [null, 5, 3];
export const cleanRowCap = (value) => (ROW_CAPS.includes(Number(value)) ? Number(value) : null);
export const nextRowCap = (current) => ROW_CAPS[(ROW_CAPS.indexOf(current ?? null) + 1) % ROW_CAPS.length];

// Ordered by the questions people ask: when (the chart), where visitors came
// from, what they looked at, who they are and when they come; then whether the
// site is running, and the deeper reads (segments, insights) after the basics.
export const DEFAULT_CARD_ORDER = [
  "linechart",
  "referrers",
  "pages",
  "map",
  "devices",
  "hoursweeks",
  "campaigns",
  "engagement",
  "goals",
  "events",
  "revenue",
  "latestvisitors",
  // A Site card, and the one shown by default: is everything running.
  "systems",
  "segments",
  "insights",
  "opportunities",
  "contenthealth",
  "forecast",
  "propensity",
  "retention",
  "abtests",
  "outbound",
  "downloads",
  "speed",
  // The other Site cards: summaries of the site's other pages (cards/site/),
  // hidden until switched on or put on screen by a layout.
  "visitorsnow",
  "uptime",
  "servers",
  "errors",
  "security",
  "rankings",
  "deploys",
  "jobs",
  "leads",
  "usage",
  "attention",
  "search",
  "pagehealth",
  "forms",
  "feedback",
  "backups",
  "protection",
  "ads",
  "aivisibility",
  "social",
  "funnel",
  "replays",
];

// The Site cards, in the Cards menu's order: is it running, is it safe, is it
// found, then who came of it. Visitors now reads the count the dashboard
// already polls; the rest are answered by /customer/dashboard-cards.
export const SITE_CARD_IDS = ["visitorsnow", "systems", "attention", "uptime", "servers", "errors", "deploys", "jobs", "backups",
  "security", "protection", "rankings", "search", "pagehealth", "aivisibility", "social",
  "leads", "forms", "feedback", "funnel", "replays", "ads", "usage"];
// The Site cards only a server of the site's own can fill. A site whose owner
// said they can't install anything on one (capabilities.server_code false,
// backend site/siteSetup.js) isn't offered them, on the dashboard or in the
// Cards menu. Deploys stays: Vercel, Netlify and GitHub report those. Jobs
// stays too: a hosted scheduler (GitHub Actions, Vercel cron) calls a job's
// address as well as a server's cron does.
export const SERVER_ONLY_CARDS = ["servers", "backups"];
export const withoutServerCards = (ids, capabilities) => (capabilities?.server_code === false
  ? ids.filter((id) => !SERVER_ONLY_CARDS.includes(id)) : ids);

// Earlier defaults: a saved order still equal to one of these was never
// arranged by the user, so it moves to the current default.
const OLD_DEFAULT_ORDERS = [
  ["linechart", "insights", "opportunities", "contenthealth", "forecast", "propensity", "segments", "retention", "referrers", "map", "campaigns", "pages",
    "engagement", "goals", "revenue", "abtests", "events", "outbound", "downloads", "hoursweeks", "devices", "latestvisitors", "speed"],
  ["linechart", "insights", "contenthealth", "referrers", "map", "campaigns", "pages", "engagement", "goals", "revenue",
    "abtests", "events", "outbound", "hoursweeks", "devices", "latestvisitors", "speed"],
  ["linechart", "insights", "contenthealth", "forecast", "referrers", "map", "campaigns", "pages", "engagement", "goals", "revenue",
    "abtests", "events", "outbound", "hoursweeks", "devices", "latestvisitors", "speed"],
  ["linechart", "insights", "contenthealth", "forecast", "propensity", "referrers", "map", "campaigns", "pages", "engagement", "goals", "revenue",
    "abtests", "events", "outbound", "hoursweeks", "devices", "latestvisitors", "speed"],
  ["linechart", "insights", "contenthealth", "forecast", "propensity", "segments", "referrers", "map", "campaigns", "pages", "engagement", "goals", "revenue",
    "abtests", "events", "outbound", "hoursweeks", "devices", "latestvisitors", "speed"],
  ["linechart", "insights", "contenthealth", "forecast", "propensity", "segments", "retention", "referrers", "map", "campaigns", "pages", "engagement", "goals", "revenue",
    "abtests", "events", "outbound", "hoursweeks", "devices", "latestvisitors", "speed"],
  ["linechart", "insights", "opportunities", "contenthealth", "forecast", "propensity", "segments", "retention", "referrers", "map", "campaigns", "pages",
    "engagement", "goals", "revenue", "abtests", "events", "outbound", "hoursweeks", "devices", "latestvisitors", "speed"],
  ["linechart", "insights", "contenthealth", "speed", "map", "pages", "engagement", "goals", "abtests", "revenue",
    "referrers", "devices", "campaigns", "hoursweeks", "outbound", "events", "latestvisitors"],
  // The default until All systems joined it, after the chart (2026-11-15).
  ["linechart", "insights", "opportunities", "contenthealth", "forecast", "propensity", "segments", "retention", "referrers", "map", "campaigns", "pages", "engagement", "goals", "revenue", "abtests", "events", "outbound", "downloads", "hoursweeks", "devices", "latestvisitors", "speed", "visitorsnow", "uptime", "servers", "errors", "security", "rankings", "deploys", "jobs", "leads", "usage"],
  // The default until twelve more Site cards joined it (2026-11-16).
  ["linechart", "systems", "insights", "opportunities", "contenthealth", "forecast", "propensity", "segments", "retention", "referrers", "map", "campaigns", "pages", "engagement", "goals", "revenue", "abtests", "events", "outbound", "downloads", "hoursweeks", "devices", "latestvisitors", "speed", "visitorsnow", "uptime", "servers", "errors", "security", "rankings", "deploys", "jobs", "leads", "usage"],
];

// Hidden until switched on from the Cards menu: empty unless the site is set up
// for them (A/B tests, revenue, outbound, downloads), or covered elsewhere (speed).
export const DEFAULT_HIDDEN_CARDS = ["speed", "abtests", "revenue", "outbound", "downloads", "propensity", "retention", "forecast", "goals", "campaigns", "opportunities", "contenthealth", "insights",
  ...SITE_CARD_IDS.filter((id) => id !== "systems")];
// Cards added after people started saving their own hidden list (before the
// browser remembered which cards it had seen); see hiddenCardsWithNew.
const CARDS_ADDED_LATER = ["forecast", "propensity", "segments", "retention", "opportunities", "downloads", ...SITE_CARD_IDS];

// A saved view or layout copy's hidden list, from before the Site cards
// existed: its order has none of them, so they stay hidden rather than all
// appearing at once. A newer one lists them in its order and is taken as is.
export const hiddenWithSiteCards = (hidden, savedOrder) => [...new Set([...(Array.isArray(hidden) ? hidden : []),
  ...SITE_CARD_IDS.filter((id) => !(Array.isArray(savedOrder) && savedOrder.includes(id)))])];

// A layout copy saved before its layout gained a card (its order has none of
// it): the card is shown as the layout now has it, first under the chart,
// rather than hidden with the Site cards the layout never had. Once the copy
// is saved again its order lists the card, and hiding it then is the user's.
const CARDS_LAYOUTS_GAINED = ["systems"];
export function layoutCopyWithNewCards(preset, copy) {
  if (!copy || !Array.isArray(copy.cardOrder)) return copy;
  const gained = CARDS_LAYOUTS_GAINED.filter((id) => preset.cards.includes(id) && !copy.cardOrder.includes(id));
  if (!gained.length) return copy;
  const at = copy.cardOrder.indexOf("linechart") + 1;
  return { ...copy, cardOrder: [...copy.cardOrder.slice(0, at), ...gained, ...copy.cardOrder.slice(at)] };
}

// A saved hidden list predates cards added since: those of them hidden by
// default start hidden too. `known` is the card list the browser saw last
// time (null before it started remembering).
export function hiddenCardsWithNew(storedHidden, known) {
  const seen = Array.isArray(known) ? known : DEFAULT_CARD_ORDER.filter((id) => !CARDS_ADDED_LATER.includes(id));
  return [...new Set([...storedHidden, ...DEFAULT_HIDDEN_CARDS.filter((id) => !seen.includes(id))])];
}

// Tabs that can be popped out of their card into a card of their own,
// with ids like "map:map". Each entry lists the card's tabs in display order;
// the first is the card's default tab.
export const DETACHABLE_TABS = {
  map: {
    title: "Location",
    activeKey: "locationActiveTab",
    tabs: { topcountries: "Countries", topregions: "Regions", topcities: "Cities", toplocales: "Language", map: "Map" },
  },
  pages: {
    title: "Pages",
    activeKey: "pagesActiveTab",
    tabs: { TopVisited: "Pages", TopSections: "Sections", TopEntryPages: "Entry pages", Topexitedpages: "Exit pages", TopUserFlows: "Flows", Funnels: "Funnels" },
  },
  engagement: {
    title: "Engagement",
    activeKey: "engagementActiveTab",
    tabs: { bounce: "Bounce", engaged: "Engaged time", scroll: "Scroll", depth: "Depth", speed: "Speed", returning: "Returning" },
  },
  referrers: {
    title: "Sources",
    activeKey: "referrersActiveTab",
    tabs: { topreferrers: "Referrers", trafficsources: "Channels", topsocialmedia: "Social", topsearchengines: "Search", hosts: "Hosts" },
  },
  devices: {
    title: "Devices",
    activeKey: "devicesActiveTab",
    tabs: { TopBrowsers: "Browsers", TopDevices: "Devices", TopOS: "OS", TopScreenSizes: "Screen sizes" },
  },
  campaigns: {
    title: "Campaigns",
    activeKey: "campaignsActiveTab",
    tabs: { CampaignName: "Campaign name", CampaignSource: "Campaign source", CampaignMedium: "Campaign medium", CampaignTerm: "Campaign term", CampaignContent: "Campaign content" },
  },
  hoursweeks: {
    title: "Time & Day",
    activeKey: "timeActiveTab",
    tabs: { hours: "Time of day", days: "Weekdays", heatmap: "Heatmap" },
  },
  outbound: {
    title: "Outbound links",
    activeKey: "outboundActiveTab",
    tabs: { domains: "Outbound domains", urls: "Outbound URLs", pages: "Outbound source pages" },
  },
  downloads: {
    title: "File downloads",
    activeKey: "downloadsActiveTab",
    tabs: { files: "Downloaded files", types: "Download file types", pages: "Download source pages" },
  },
  // Cards without tabs: one tab each, so they can move into the user's cards too.
  goals: { title: "Conversions", single: true, tabs: { main: "Conversions" } },
  abtests: { title: "A/B tests", single: true, tabs: { main: "A/B tests" } },
  revenue: { title: "Revenue", single: true, tabs: { main: "Revenue" } },
  latestvisitors: { title: "Latest visitors", single: true, tabs: { main: "Latest visitors" } },
  events: { title: "Events", single: true, tabs: { main: "Events" } },
  insights: { title: "Insights", single: true, tabs: { main: "Insights" } },
  contenthealth: { title: "Content health", single: true, tabs: { main: "Content health" } },
  forecast: { title: "Forecast", single: true, tabs: { main: "Forecast" } },
  propensity: { title: "Who converts", single: true, tabs: { main: "Who converts" } },
  segments: { title: "Standout segments", single: true, tabs: { main: "Standout segments" } },
  retention: { title: "Retention", single: true, tabs: { main: "Retention" } },
  opportunities: { title: "Opportunities", single: true, tabs: { main: "Opportunities" } },
};

export const splitCardId = (id) => {
  const [parent, tab] = String(id).split(":");
  return { parent, tab };
};

export const isDetachableId = (id) => {
  const { parent, tab } = splitCardId(id);
  return Boolean(tab && DETACHABLE_TABS[parent]?.tabs[tab]);
};

// Every tab lives in exactly one card: its built-in card, or one of the user's
// cards ("custom:…"), which hold whatever tabs were moved into them.
export const takenTabs = (ui) => (ui.customCards || []).flatMap((card) => card.tabs);

// The tabs still shown in a built-in card.
export const remainingTabs = (parent, ui) => {
  const taken = takenTabs(ui);
  return Object.keys(DETACHABLE_TABS[parent]?.tabs || {}).filter((tab) => !taken.includes(`${parent}:${tab}`));
};

// Built-in cards whose tabs have all moved elsewhere; they hide until one comes back.
export const emptyCards = (ui) => Object.keys(DETACHABLE_TABS).filter((parent) => remainingTabs(parent, ui).length === 0);

// A card's open tab. Unknown or moved tabs (old bookmarks too) fall back to its first tab.
export const effectiveTab = (ui, parent) => {
  const active = ui[DETACHABLE_TABS[parent].activeKey];
  const left = remainingTabs(parent, ui);
  return left.includes(active) ? active : (left[0] || active);
};

export const isCustomCardId = (id) => String(id).startsWith("custom:");
export const isMetricCardId = (id) => String(id).startsWith("metric:");

// A metric card's saved filters: AnalyticsSlice filter fields with a value.
const cleanFilters = (filters) => Object.fromEntries(Object.entries(filters && typeof filters === "object" ? filters : {})
  .filter(([key, value]) => /^[a-z]+(filter|filterName)$/i.test(key) && typeof value === "string" && value)
  .map(([key, value]) => [key, value.slice(0, 2100)]));

// kind "trend": one metric over time (chart: area | line | bar | number).
// kind "breakdown": users split by a dimension (chart: donut | pie | bars), top N + Other.
// kind "chart": the dashboard's own chart, drawing its own lines (metrics) over
// the dashboard's dates and filters (chart: the main chart's four types).
const TREND_CHARTS = ["area", "line", "bar", "number"];
// kind "formula": metrics[0] ÷ metrics[1] over the card's range (cards/formula.js).
const formulaParts = (metrics) => {
};
const FORMULA_CHARTS = ["number", "line"];
export const FORMULA_SCALES = ["ratio", "percent", "per1000"];
const BREAKDOWN_CHARTS = ["donut", "pie", "bars"];
const CHART_CARD_CHARTS = ["line", "bar", "stackedLine", "stackedBar"];
export const CHART_CARD_MAX_LINES = 8;
const KIND_CHARTS = { trend: TREND_CHARTS, breakdown: BREAKDOWN_CHARTS, chart: CHART_CARD_CHARTS, formula: FORMULA_CHARTS };
// The most of the user's own cards kept: a bound on what is stored, not a plan
// limit (the backend's saved view schema takes the same).
export const MAX_METRIC_CARDS = 100;
const cleanMetrics = (metrics) => [...new Set((Array.isArray(metrics) ? metrics : [])
  .map((metric) => String(metric || "").slice(0, 50)).filter(Boolean))].slice(0, CHART_CARD_MAX_LINES);
// A card's own period, instead of the one the date bar is set to. "follow" is
// the dashboard's range and is what every card did before scopes existed.
// The vocabulary is closed: the days each one means are worked out in
// useful/cardScope.js, which reads this list so there is one source of truth.
export const METRIC_CARD_RANGES = ["follow", "today", "yesterday", "last7", "last30", "last90", "year_ago"];
const cleanMetricCard = (card) => {
  const kind = KIND_CHARTS[card.kind] ? card.kind : "trend";
  const charts = KIND_CHARTS[kind];
  return {
    id: card.id,
    title: String(card.title || "Metric").slice(0, 60),
    kind,
    metric: String(card.metric || "uniquevisitors").slice(0, 50),
    dimension: String(card.dimension || "channel").slice(0, 30),
    chart: charts.includes(card.chart) ? card.chart : charts[0],
    // A chart card's lines; never empty, a chart of nothing draws an empty frame.
    ...(kind === "chart" ? { metrics: cleanMetrics(card.metrics).length ? cleanMetrics(card.metrics) : ["uniquevisitors"] } : {}),
    // A formula's two parts, top then bottom, both counts (a rate over
    // anything means nothing), and how the figure is shown.
    ...(kind === "formula" ? {
      metrics: formulaParts(card.metrics),
      scale: FORMULA_SCALES.includes(card.scale) ? card.scale : "percent",
    } : {}),
    top: [3, 5, 8].includes(Number(card.top)) ? Number(card.top) : 5,
    filters: cleanFilters(card.filters),
    // "follow": the dashboard's filters as they are now, whatever they become.
    // "own": the saved filters above. A card saved before this existed with no
    // filters was showing all traffic only because none were set when it was
    // made, so it follows; one that saved filters keeps them.
    filtersMode: card.filtersMode === "follow"
      || (card.filtersMode !== "own" && !Object.keys(cleanFilters(card.filters)).length) ? "follow" : "own",
    // The card's own period and site. Empty site = the dashboard's site; the
    // server still checks access to whichever site is asked for.
    range: METRIC_CARD_RANGES.includes(card.range) ? card.range : "follow",
    site: /^[a-f\d]{24}$/i.test(String(card.site || "")) ? String(card.site) : "",
    siteName: String(card.siteName || "").slice(0, 80),
    note: String(card.note || "").slice(0, 200),
    // Number-only cards: where the figure sits, and whether the card is the
    // mini one (the default) or full size.
    align: card.align === "left" ? "left" : "center",
    size: card.size === "normal" ? "normal" : "compact",
  };
};

// A Site card's own settings: its time (RANGE), how it is drawn (DISPLAY,
// the first the card's default), for Servers which server and for Funnel
// which funnel.
export const SITE_CARD_RANGES = ["live", "follow", "today", "yesterday", "last7", "last30", "last90"];
export const SITE_CARD_DISPLAYS = {
  visitorsnow: ["number"],
  systems: ["light"],
  uptime: ["light", "gauge", "number"],
  servers: ["gauge", "number"],
  errors: ["number", "list"],
  security: ["number"],
  rankings: ["list"],
  deploys: ["list"],
  jobs: ["list", "light"],
  leads: ["number", "list"],
  usage: ["gauge"],
  attention: ["list"],
  search: ["number"],
  pagehealth: ["list"],
  forms: ["number"],
  feedback: ["list"],
  backups: ["list", "light"],
  protection: ["list"],
  ads: ["number"],
  aivisibility: ["number"],
  social: ["list"],
  funnel: ["list"],
  replays: ["list"],
  // Not a Site card: the Speed card's table, or a gauge per vital against Google's limits.
  speed: ["list", "gauge"],
};
// The cards with settings kept here.
const SETTINGS_CARDS = [...SITE_CARD_IDS.filter((id) => id !== "visitorsnow"), "speed"];
// Only these read over a range; the rest are always now.
export const SITE_CARDS_WITH_RANGE = ["errors", "deploys", "leads", "replays", "search", "pagehealth", "forms", "ads", "funnel"];
// Of them, the ones with no "live": what they read is by the day, so they
// follow the dashboard's dates unless given their own, and never refresh by
// themselves (backend dashboardCards.js `range: "only"`).
export const SITE_CARDS_RANGE_ONLY = ["search", "pagehealth", "forms", "ads", "funnel"];
export const siteCardRanges = (id) => (!SITE_CARDS_WITH_RANGE.includes(id) ? ["live"]
  : SITE_CARDS_RANGE_ONLY.includes(id) ? SITE_CARD_RANGES.filter((range) => range !== "live") : SITE_CARD_RANGES);
export const cleanSiteCard = (id, settings = {}) => {
  const displays = SITE_CARD_DISPLAYS[id] || ["number"];
  const ranges = siteCardRanges(id);
  return {
    range: ranges.includes(settings?.range) ? settings.range : ranges[0],
    display: displays.includes(settings?.display) ? settings.display : displays[0],
    ...(id === "servers" && typeof settings?.server === "string" && settings.server ? { server: settings.server.slice(0, 100) } : {}),
    ...(id === "funnel" && /^[a-f\d]{24}$/i.test(String(settings?.funnel || "")) ? { funnel: String(settings.funnel).toLowerCase() } : {}),
  };
};
const cleanSiteCards = (value) => Object.fromEntries(Object.entries(value && typeof value === "object" ? value : {})
  .filter(([id]) => SETTINGS_CARDS.includes(id)).map(([id, settings]) => [id, cleanSiteCard(id, settings)]));

export const tabLabel = (id) => {
  const { parent, tab } = splitCardId(id);
  return DETACHABLE_TABS[parent]?.tabs[tab] || id;
};

const isCardId = (state, id) => DEFAULT_CARD_ORDER.includes(id) || state.customCards.some((card) => card.id === id)
  || state.metricCards.some((card) => card.id === id);

// Hidden by the user, or a built-in card with no tabs left.
const isOffscreen = (state, id) => state.hiddenCards.includes(id) || emptyCards(state).includes(id);

const removeCard = (state, id) => {
  state.customCards = state.customCards.filter((card) => card.id !== id);
  state.metricCards = state.metricCards.filter((card) => card.id !== id);
  state.cardOrder = state.cardOrder.filter((item) => item !== id);
  state.hiddenCards = state.hiddenCards.filter((item) => item !== id);
  const { [id]: _removed, ...widths } = state.cardWidths;
  state.cardWidths = widths;
  const { [id]: _rows, ...rows } = state.cardRows || {};
  state.cardRows = rows;
  const { [id]: _color, ...colors } = state.cardIcons.colors;
  const { [id]: _look, ...looks } = state.cardIcons.looks;
  const { [id]: _border, ...borderColors } = state.cardIcons.borderColors || {};
  const { [id]: _text, ...textColors } = state.cardIcons.textColors || {};
  state.cardIcons.colors = colors;
  state.cardIcons.borderColors = borderColors;
  state.cardIcons.textColors = textColors;
  state.cardIcons.looks = looks;
  state.cardIcons.noIcon = state.cardIcons.noIcon.filter((item) => item !== id);
};

// Take a tab out of the user's card holding it; a card left with no tabs is removed.
const releaseTab = (state, tab) => {
  for (const card of [...state.customCards]) {
    if (!card.tabs.includes(tab)) continue;
    const live = state.customCards.find((item) => item.id === card.id);
    live.tabs = live.tabs.filter((item) => item !== tab);
    if (live.active === tab) live.active = live.tabs[0] || null;
    if (!live.tabs.length) removeCard(state, card.id);
  }
};

// A tab going back to its built-in card opens there.
const openInOwnCard = (state, tab) => {
  const { parent, tab: name } = splitCardId(tab);
  const { activeKey } = DETACHABLE_TABS[parent];
  if (activeKey) state[activeKey] = name;
};

const addCustomCard = (state, { id, title, tabs = [], afterId }) => {
  const valid = [...new Set(tabs.filter(isDetachableId))];
  for (const tab of valid) releaseTab(state, tab);
  state.customCards = [...state.customCards, { id, title: String(title || "New card").slice(0, 60), tabs: valid, active: valid[0] || null }];
  const order = state.cardOrder.filter((item) => item !== id);
  const at = afterId ? order.indexOf(afterId) : -1;
  order.splice(at === -1 ? order.length : at + 1, 0, id);
  state.cardOrder = order;
};

// The user's cards missing from an order go last; ids of removed cards are dropped.
const withExtraCards = (order, state) => {
  const result = order.filter((id) => typeof id === "string" && (!id.includes(":") || isCardId(state, id)));
  for (const card of [...state.customCards, ...state.metricCards]) if (!result.includes(card.id)) result.push(card.id);
  return result;
};

const CARD_ICON_STYLES = ["soft", "solid", "outline", "plain"];
const CARD_LOOKS = ["none", "tint", "border", "glow", "pulse", "gradient", "tint+border", "tint+glow", "tint+pulse", "tint+gradient"];
const CARD_SURFACES = ["white", "grey", "warm", "cool"];
const HEX = /^#[0-9a-f]{6}$/i;

// Every checklist that can draw chart overlays. The initial state and
// clearSelections share it, so a checklist added later cannot be reset in one
// place and forgotten in the other.
const emptySelections = () => ({
  countries: [],
  regions: [],
  cities: [],
  locales: [],
  pages: [],
  browsers: [],
  devices: [],
  os: [],
  screensizes: [],
  referrers: [],
  topvisited: [],
  sections: [],
  entrypages: [],
  exitpages: [],
  categories: [],
  socialmedia: [],
  searchengines: [],
  ai: [],
  campaignname: [],
  campaignmedium: [],
  campaignterm: [],
  campaigncontent: [],
  campaignsource: [],
  hosts: [],
  events: [],
  funnels: [],
  visitdepth: [],
  bounce: [],
  sessionduration: [],
  engagedtime: [],
  speed: [],
  scroll: [],
  abtests: [],
  revenue: [],
});

const AnalyticsUISlice = createSlice({
  name: "AnalyticsUISlice",
  initialState: {
    floatingFiltersCollapsed: false,
    campaigntablefilter: "",
    charttype: "line",
    // How the main chart is laid out. "single": one plot carrying every ticked
    // line. "grid": small multiples - one small plot per metric, each with its
    // own y axis, because Users (a count), Bounce rate (a %) and Avg duration
    // (seconds) cannot honestly share one axis. Clicking a small plot promotes
    // that metric back to the single chart.
    chartLayout: "single", // single | grid
    // Set only when a grid panel was clicked to open it: { metric, metrics },
    // the lines that were ticked before the promotion. It is what puts the way
    // back to the grid in the chart header - without it the only route back is
    // the gear menu, which is not where anyone looks after clicking a plot.
    gridReturn: null,
    chartInterval: "auto",
    pointRadius: 0,
    peakMarkers: "main", // off | main | all
    showAverageLine: false,
    chartGrid: "minimal", // full | horizontal | minimal | none
    lineCurve: "smooth", // angular | smooth | curvy
    linePoints: "on", // on | off
    lineThickness: "normal", // thin | normal | thick
    // The user's own colour for a metric's line, by metric key:
    // { uniquevisitors: "#2563eb" }. A metric not listed keeps the hue in
    // components/metricColors.js, and one hex serves both light and dark.
    metricLineColors: {},
    lineFill: "gradient", // none | solid | gradient: shade the area under each line
    barStyle: "solid", // solid | outlined: the colour fills the bar, or draws its edge
    chartFontSize: "normal", // small | normal | large
    valueLabels: "top", // all | top | none: exact values are in the hover tooltip
    compareSegment: null, // { label, params } while comparePreset is "segment": the same dates, other filters
    activePreset: null, // { id, title, params, metrics, undo } of the preset in view
    showHoverGuide: false, // the vertical line and values at the hovered point
    // Each line's name beside its top number, so a colour needn't be matched
    // against the legend to read the chart. On unless switched off.
    showLineNames: true,
    // The key under the chart naming each line. Off unless switched on: the
    // names beside the lines already say which is which.
    showLegend: false,
    // An icon before each headline tile's number, off unless switched on (too
    // small to read beside the number). Appearance, like the line
    // colours: remembered by the browser (dash/analytics/page.jsx), not a view.
    showMetricIcons: false,
    // The page speed strip under the traffic chart. Off unmounts it, so it
    // fetches nothing. Remembered by the browser (dash/analytics/page.jsx).
    showSpeed: false,
    // The lines with a 7-day trend, by metric. Kept by metric, not "the first
    // line", so adding another line never moves a trend onto it; a line taken
    // off the chart gets its trend back when it returns.
    rollingAverageMetrics: [],
    // Dated markers on the chart: the site's own notes plus the automatic ones
    // for changes that can move it (backend chartNotes.js). null until the
    // viewer picks: on, except on the demo (useChartNotesShown.js).
    showChartNotes: null,
    // Kinds of note left off the chart, one tick each under Notes
    // (LineChart/noteKinds.js); empty shows them all. Remembered by the
    // browser (dash/analytics/page.jsx).
    hiddenNoteKinds: [],
    // A note's words printed on the plot itself. Off: the dotted line and the
    // marker on the axis still say where it is, and hovering either reads it.
    showNoteLabels: false,
    explainPoints: true, // clicking a chart number opens "What was different"
    compareEnabled: false,
    comparePreset: "previous_period", // previous_period | previous_day|week|month|quarter|year|custom
    compareRange: [],
    rangeDays: 0, // days in the dashboard's range, last it changed length
    visibleLineMetrics: [
      "uniquevisitors",
      //   "totalvisits",
      //   "totalpageviews",
      //   "averagevisitduration",
      //   "bouncerate",
      //   "pagespervisit",
    ],
    // Tiles added from Lines (or a card's line button) whose line was clicked
    // off: the tile stays, with its number, so the line can come straight back.
    // Fetched with the drawn lines, never drawn. The x takes one away.
    parkedLineMetrics: [],
    // Headline tiles taken off with their x. A line that is on shows its tile
    // regardless, so ticking it in Lines brings the tile back.
    hiddenHeadlineTiles: [],
    headerpagetitle: "",
    pagesActiveTab: "TopVisited",
    locationActiveTab: "topcountries",
    timeActiveTab: "hours",
    referrersActiveTab: "topreferrers",
    devicesActiveTab: "TopBrowsers",
    campaignsActiveTab: "CampaignName",
    outboundActiveTab: "domains",
    downloadsActiveTab: "files",
    engagementActiveTab: "bounce",
    // Analytics page: the normal cards ("traffic") or the Performance view.
    dashboardView: "traffic",
    // Pages tables show the path (default) or the page title; filters always use the path.
    pageLabelMode: "path",
    // Depth tab: exact page counts ("list") or ranges that follow the data ("grouped").
    depthView: "list",
    selectedFilters: emptySelections(),
    cardOrder: DEFAULT_CARD_ORDER,
    layoutEditMode: false,
    sectionOrderFocusPinned: false,
    // The user's order while a sidebar link has pinned a card under the chart; restored after.
    orderBeforePin: null,
    // Responsive card widths ('half' or 'full').
    cardWidths: {},
    // Rows a card's table shows when the user wants fewer than its own: { pages: 5 }.
    cardRows: {},
    // Cards switched off from the View menu (not shown, not fetched).
    hiddenCards: DEFAULT_HIDDEN_CARDS,
    // The user's cards: { id: "custom:…", title, tabs: ["referrers:hosts", …], active }.
    // Their tabs are moved out of the built-in cards, which no longer show them.
    // How many columns the card grid runs: "auto" follows the width of the
    // grid, "2".."4" is the user's own pick (cardSizes.js clamps it to what the
    // width can carry). A card's width is a span of these columns.
    cardColumns: "auto",
    customCards: [],
    // The user's metric cards: one metric over saved filters, for the picked dates.
    // { id: "metric:…", title, metric, filters: { devicefilter: "mobile", … }, note }.
    metricCards: [],
    // Site cards' own settings by id (cleanSiteCard); a card with none uses
    // its defaults.
    siteCards: {},
    // Site cards fold away while nothing on them is wrong (the Emergency
    // layout); "All good" stands in when every one has.
    onlyProblems: false,
    // A tab of the Revenue card asked for from elsewhere (the Ads card's
    // link); the card opens it and clears this.
    revenueTabAsked: null,
    // The "Nothing to show for these dates" card (cards with nothing to show) left off
    // the page; its cards still come back by themselves once they have data.
    hideEmptyCards: false,
    // Card colours and looks. Icons next to titles: style is soft | solid | outline | plain;
    // noIcon lists cards without one. look (none | tint | border | glow | pulse | gradient) styles every
    // card in its colour; looks holds per-card overrides. colors: the user's picks by card id.
    // surface (white | grey | warm | cool) is every card's base colour in light mode.
    cardIcons: { enabled: true, style: "soft", colors: {}, borderColors: {}, textColors: {}, noIcon: [], look: "none", looks: {}, surface: "white" },
    // The small trend line beside each table row. On by default; it is a shape
    // over the picked range, never a number, and it costs one request per card
    // that draws one, so it is switchable from Cards -> Appearance.
    rowTrendLines: true,
    // The card opened over the dashboard at full size (its data-card-id), or ""
    // for none. The card keeps its place in the tree, so its tab, sorting and
    // chart instance all survive being opened and closed.
    expandedCard: "",
  },

  reducers: {
    setFloatingFiltersCollapsed: (state, action) => {
      state.floatingFiltersCollapsed = action.payload;
    },
    setcampaigntablefilter: (state, action) => {
      state.campaigntablefilter = action.payload;
    },
    setcharttype: (state, action) => {
      state.charttype = action.payload;
    },
    setChartLayout: (state, action) => {
      state.chartLayout = action.payload === "grid" ? "grid" : "single";
      // Choosing a layout outright is not arriving from a panel: whatever was
      // promoted before, there is nothing to go back to now.
      state.gridReturn = null;
    },
    // Clicking a small-multiples panel: that metric becomes the only line on
    // the single chart. One action rather than three, so the lines, the layout
    // and the way back can never be left half applied.
    promoteFromGrid: (state, action) => {
      const metric = action.payload;
      if (typeof metric !== "string" || !metric) return;
      state.gridReturn = {
        metric,
        metrics: Array.isArray(state.visibleLineMetrics) ? state.visibleLineMetrics : [],
      };
      state.visibleLineMetrics = [metric];
      state.chartLayout = "single";
    },
    returnToGrid: (state) => {
      const back = state.gridReturn;
      const shown = Array.isArray(state.visibleLineMetrics) ? state.visibleLineMetrics : [];
      // Put the earlier lines back only if the chart is still showing exactly
      // the metric that was promoted. A different pick since then is the
      // user's own, and restoring over it would undo a choice they made.
      if (back?.metrics?.length && shown.length === 1 && shown[0] === back.metric) {
        state.visibleLineMetrics = back.metrics;
      }
      state.gridReturn = null;
      state.chartLayout = "grid";
    },
    setExpandedCard: (state, action) => {
      state.expandedCard = typeof action.payload === "string" ? action.payload : "";
    },
    setPeakMarkers: (state, action) => {
      state.peakMarkers = ['off', 'main', 'all'].includes(action.payload) ? action.payload : 'main';
    },
    setShowAverageLine: (state, action) => {
      state.showAverageLine = Boolean(action.payload);
    },
    setChartGrid: (state, action) => {
      state.chartGrid = ['full', 'horizontal', 'minimal', 'none'].includes(action.payload) ? action.payload : 'minimal';
    },
    setCompareSegment: (state, action) => {
      state.compareSegment = action.payload || null;
    },
    setActivePreset: (state, action) => {
      state.activePreset = action.payload || null;
    },
    setShowLineNames: (state, action) => {
      state.showLineNames = action.payload !== false;
    },
    setShowLegend: (state, action) => {
      state.showLegend = action.payload === true;
    },
    setShowMetricIcons: (state, action) => {
      state.showMetricIcons = action.payload !== false;
    },
    setShowSpeed: (state, action) => {
      state.showSpeed = action.payload === true;
    },
    setLinePoints: (state, action) => {
      state.linePoints = action.payload === 'off' ? 'off' : 'on';
    },
    setLineThickness: (state, action) => {
      state.lineThickness = ['thin', 'normal', 'thick'].includes(action.payload) ? action.payload : 'normal';
    },
    // One metric's line colour: { metric, color } (a hex, or null for its
    // default hue). Anything that is not a six-digit hex clears the pick
    // rather than painting a line with it.
    setMetricLineColor: (state, action) => {
      const { metric, color } = action.payload || {};
      if (!metric) return;
      const { [metric]: _old, ...rest } = state.metricLineColors;
      state.metricLineColors = HEX.test(color || "") ? { ...rest, [metric]: color } : rest;
    },
    // Every pick at once: restoring from storage, or {} to put them all back.
    setMetricLineColors: (state, action) => {
      const colors = action.payload;
      state.metricLineColors = colors && typeof colors === "object" && !Array.isArray(colors)
        ? Object.fromEntries(Object.entries(colors).filter(([, color]) => HEX.test(color || "")))
        : {};
    },
    setLineFill: (state, action) => {
      state.lineFill = ['none', 'solid', 'gradient'].includes(action.payload) ? action.payload : 'gradient';
    },
    setBarStyle: (state, action) => {
      state.barStyle = action.payload === 'outlined' ? 'outlined' : 'solid';
    },
    setChartFontSize: (state, action) => {
      state.chartFontSize = ['small', 'normal', 'large'].includes(action.payload) ? action.payload : 'normal';
    },
    setValueLabels: (state, action) => {
      state.valueLabels = ['all', 'top', 'none'].includes(action.payload) ? action.payload : 'top';
    },
    setLineCurve: (state, action) => {
      state.lineCurve = ['angular', 'smooth', 'curvy'].includes(action.payload) ? action.payload : 'smooth';
    },
    setShowHoverGuide: (state, action) => {
      state.showHoverGuide = Boolean(action.payload);
    },
    setRollingAverageMetrics: (state, action) => {
      state.rollingAverageMetrics = Array.isArray(action.payload) ? [...new Set(action.payload.filter(m => typeof m === 'string'))] : [];
    },
    setRowTrendLines: (state, action) => {
      state.rowTrendLines = Boolean(action.payload);
    },
    setShowChartNotes: (state, action) => {
      state.showChartNotes = Boolean(action.payload);
    },
    setNoteKindShown: (state, action) => {
      const { kind, shown } = action.payload || {};
      const hidden = (state.hiddenNoteKinds || []).filter((key) => key !== kind);
      state.hiddenNoteKinds = shown ? hidden : [...hidden, kind];
    },
    setHiddenNoteKinds: (state, action) => {
    },
    setShowNoteLabels: (state, action) => {
      state.showNoteLabels = Boolean(action.payload);
    },
    setExplainPoints: (state, action) => {
      state.explainPoints = Boolean(action.payload);
    },
    setChartInterval: (state, action) => {
      state.chartInterval = ['auto', 'daily', 'weekly', 'monthly'].includes(action.payload) ? action.payload : 'auto';
    },
    setCompareEnabled: (state, action) => {
      state.compareEnabled = Boolean(action.payload);
    },
    setComparePreset: (state, action) => {
      state.comparePreset = action.payload;
    },
    setCompareRange: (state, action) => {
      state.compareRange = Array.isArray(action.payload) ? action.payload : [];
    },
    setPointRadius: (state, action) => {
      state.pointRadius = action.payload === 5 ? 5 : 0;
    },
    togglePointRadius: (state) => {
      state.pointRadius = state.pointRadius === 0 ? 5 : 0;
    },
    toggleLineMetric: (state, action) => {
      const key = action.payload;
      if (!key) return;
      if (state.visibleLineMetrics.includes(key)) {
        state.visibleLineMetrics = state.visibleLineMetrics.filter(
          (m) => m !== key,
        );
      } else {
        state.visibleLineMetrics = [...state.visibleLineMetrics, key];
      }
      state.parkedLineMetrics = (state.parkedLineMetrics || []).filter((m) => m !== key);
    },
    setVisibleLineMetrics: (state, action) => {
      state.visibleLineMetrics = Array.isArray(action.payload)
        ? action.payload
        : [];
      state.parkedLineMetrics = (state.parkedLineMetrics || []).filter((m) => !state.visibleLineMetrics.includes(m));
    },
    // Clicking an added tile: its line goes off and the tile stays, or back on.
    switchTileLine: (state, action) => {
      const key = action.payload;
      if (!key) return;
      const parked = state.parkedLineMetrics || [];
      if (state.visibleLineMetrics.includes(key)) {
        state.visibleLineMetrics = state.visibleLineMetrics.filter((m) => m !== key);
        state.parkedLineMetrics = [...parked.filter((m) => m !== key), key];
      } else {
        state.parkedLineMetrics = parked.filter((m) => m !== key);
        state.visibleLineMetrics = [...state.visibleLineMetrics, key];
      }
    },
    // A tile's x: the line and the tile both go. A headline tile is
    // remembered as hidden; an added one simply stops being added.
    removeTile: (state, action) => {
      const { key, headline } = action.payload || {};
      if (!key) return;
      state.visibleLineMetrics = state.visibleLineMetrics.filter((m) => m !== key);
      state.parkedLineMetrics = (state.parkedLineMetrics || []).filter((m) => m !== key);
      const hidden = state.hiddenHeadlineTiles || [];
      if (headline && !hidden.includes(key)) state.hiddenHeadlineTiles = [...hidden, key];
    },
    setParkedLineMetrics: (state, action) => {
      state.parkedLineMetrics = Array.isArray(action.payload) ? action.payload : [];
    },
    setHiddenHeadlineTiles: (state, action) => {
      state.hiddenHeadlineTiles = Array.isArray(action.payload) ? action.payload : [];
    },
    setHeaderPageTitle: (state, action) => {
      state.headerpagetitle = action.payload;
    },
    setLocationActiveTab: (state, action) => { state.locationActiveTab = action.payload; },
    setTimeActiveTab: (state, action) => { state.timeActiveTab = action.payload; },
    setPagesActiveTab: (state, action) => {
      state.pagesActiveTab = action.payload;
    },
    setReferrersActiveTab: (state, action) => {
      state.referrersActiveTab = action.payload;
    },
    setDevicesActiveTab: (state, action) => {
      state.devicesActiveTab = action.payload;
    },
    setOutboundActiveTab: (state, action) => {
      state.outboundActiveTab = ["domains", "urls", "pages"].includes(action.payload) ? action.payload : "domains";
    },
    setDownloadsActiveTab: (state, action) => {
      state.downloadsActiveTab = ["files", "types", "pages"].includes(action.payload) ? action.payload : "files";
    },
    setEngagementActiveTab: (state, action) => {
      state.engagementActiveTab = ["bounce", "engaged", "scroll", "depth", "speed", "returning"].includes(action.payload) ? action.payload : "bounce";
    },
    setDashboardView: (state, action) => {
      // Every view the page can render; anything else falls back to traffic.
      state.dashboardView = ["performance", "server", "developer", "errors", "links", "a11y", "scripts", "uptime",
        "crawlers", "tracking", "allsites"].includes(action.payload) ? action.payload : "traffic";
    },
    setDepthView: (state, action) => {
      state.depthView = action.payload === "grouped" ? "grouped" : "list";
    },
    setPageLabelMode: (state, action) => {
      state.pageLabelMode = action.payload === "title" ? "title" : "path";
    },
    setCampaignsActiveTab: (state, action) => {
      state.campaignsActiveTab = action.payload;
    },
    addSelection: (state, action) => {
      const { key, value } = action.payload;
      if (!state.selectedFilters[key]) {
        state.selectedFilters[key] = [];
      }
      if (!state.selectedFilters[key].includes(value)) {
        state.selectedFilters[key].push(value);
      }
    },
    removeSelection: (state, action) => {
      const { key, value } = action.payload;
      if (state.selectedFilters[key]) {
        state.selectedFilters[key] = state.selectedFilters[key].filter(
          (item) => item !== value,
        );
      }
    },
    setSelections: (state, action) => {
      const { key, values } = action.payload;
      const next = Array.isArray(values) ? values : [];
      // Every table reports its selection when it mounts, usually the very
      // list it was given. Keeping the same array then leaves the state
      // untouched, so the page and the filter bar don't re-render for it.
      const current = state.selectedFilters[key];
      if (current && current.length === next.length && current.every((value, i) => value === next[i])) return;
      state.selectedFilters[key] = next;
    },
    clearSelections: (state, action) => {
      if (action.payload) {
        const key = action.payload;
        if (state.selectedFilters[key]) {
          state.selectedFilters[key] = [];
        }
      } else {
        state.selectedFilters = emptySelections();
      }
    },
    // Moves swap with the nearest card on screen, skipping hidden ones.
    moveCardUp: (state, action) => {
      const id = action.payload;
      const idx = state.cardOrder.indexOf(id);
      let target = idx - 1;
      while (target >= 0 && isOffscreen(state, state.cardOrder[target])) target--;
      if (idx > 0 && target >= 0) {
        const order = [...state.cardOrder];
        [order[target], order[idx]] = [order[idx], order[target]];
        state.cardOrder = order;
      }
    },
    moveCardDown: (state, action) => {
      const id = action.payload;
      const idx = state.cardOrder.indexOf(id);
      let target = idx + 1;
      while (target < state.cardOrder.length && isOffscreen(state, state.cardOrder[target])) target++;
      if (idx !== -1 && target < state.cardOrder.length) {
        const order = [...state.cardOrder];
        [order[idx], order[target]] = [order[target], order[idx]];
        state.cardOrder = order;
      }
    },
    pinCardAfterLinechart: (state, action) => {
      const id = action.payload;
      if (!state.sectionOrderFocusPinned) state.orderBeforePin = [...state.cardOrder];
      const order = state.cardOrder.filter((s) => s !== id);
      const linechartIdx = order.indexOf("linechart");
      order.splice(linechartIdx + 1, 0, id);
      state.cardOrder = order;
      state.sectionOrderFocusPinned = true;
    },
    setLayoutEditMode: (state, action) => {
      state.layoutEditMode = Boolean(action.payload);
    },
    setCardOrder: (state, action) => {
      if (Array.isArray(action.payload)) {
        // Orders saved before a card existed would otherwise sort it first.
        state.cardOrder = withExtraCards([...action.payload,
        ...DEFAULT_CARD_ORDER.filter((id) => !action.payload.includes(id))], state);
        state.sectionOrderFocusPinned = false;
        state.orderBeforePin = null;
      }
    },
    // The order remembered on this device. While a sidebar link has a card pinned,
    // it waits behind the pin and comes back when the pin is cleared.
    restoreCardOrder: (state, action) => {
      if (!Array.isArray(action.payload)) return;
      const saved = OLD_DEFAULT_ORDERS.some((old) => old.join(",") === action.payload.join(",")) ? DEFAULT_CARD_ORDER : action.payload;
      const order = withExtraCards([...saved,
      ...DEFAULT_CARD_ORDER.filter((id) => !saved.includes(id))], state);
      if (state.sectionOrderFocusPinned) state.orderBeforePin = order;
      else state.cardOrder = order;
    },
    clearFocusPin: (state) => {
      state.cardOrder = withExtraCards(state.orderBeforePin || DEFAULT_CARD_ORDER, state);
      state.sectionOrderFocusPinned = false;
      state.orderBeforePin = null;
    },
    setHiddenCards: (state, action) => {
      state.hiddenCards = Array.isArray(action.payload)
        ? [...new Set(action.payload.filter((id) => isCardId(state, id)))] : [];
    },
    toggleCardHidden: (state, action) => {
      const id = action.payload;
      if (!isCardId(state, id)) return;
      state.hiddenCards = state.hiddenCards.includes(id)
        ? state.hiddenCards.filter((item) => item !== id) : [...state.hiddenCards, id];
    },
    setCardColumns: (state, action) => {
      const value = String(action.payload ?? "auto");
      state.cardColumns = ["auto", "2", "3", "4"].includes(value) ? value : "auto";
    },
    // Dropped onto another card: the dragged card takes that card's place and
    // the rest close up behind it. `before: false` drops it after the target,
    // which is what dragging onto the right-hand half of a card means.
    moveCardTo: (state, action) => {
      const { id, targetId, before = true } = action.payload || {};
      if (!id || !targetId || id === targetId) return;
      const order = state.cardOrder.filter((item) => item !== id);
      const at = order.indexOf(targetId);
      if (at === -1) return;
      order.splice(before ? at : at + 1, 0, id);
      state.cardOrder = order;
      // A drag is the user arranging the dashboard themselves, so a sidebar
      // link's temporary pin no longer applies.
      state.sectionOrderFocusPinned = false;
      state.orderBeforePin = null;
    },
    setCardWidths: (state, action) => {
      const widths = action.payload;
      // Layouts saved before the grid (and bookmarks, which hold them too)
      // carry the pixel-era steps; they become column spans. 'half' was older
      // still and already mapped onto 'm'.
      const MIGRATE = { half: "2", s: "1", m: "2", l: "3", xl: "4" };
      // '0.5' is half a column, the one step narrower than a column - a card
      // with nothing but a number in it does not need a whole one. '1/2' and
      // '1/3' are half and a third of the row, whatever the column count.
      state.cardWidths = Object.fromEntries(Object.entries(widths || {})
        .map(([id, width]) => [id, MIGRATE[width] || width])
        .filter(([id, width]) => isCardId(state, id) && id !== 'linechart' &&
          ['0.5', '1', '2', '3', '4', '1/2', '1/3', 'full'].includes(width)));
    },
    // { cardId, rows }: rows null (or anything not in ROW_CAPS) puts the card back to its own count.
    setCardRows: (state, action) => {
      const { cardId, rows } = action.payload || {};
      if (!isCardId(state, cardId)) return;
      const { [cardId]: _current, ...rest } = state.cardRows || {};
      const cap = cleanRowCap(rows);
      state.cardRows = cap ? { ...rest, [cardId]: cap } : rest;
    },
    // Restore from storage or a bookmark, after the user's cards.
    setAllCardRows: (state, action) => {
      const stored = action.payload && typeof action.payload === "object" && !Array.isArray(action.payload) ? action.payload : {};
      state.cardRows = Object.fromEntries(Object.entries(stored)
        .map(([id, rows]) => [id, cleanRowCap(rows)])
        .filter(([id, rows]) => rows && isCardId(state, id)));
    },
    // Open a tab in any tabbed card: { parent: "devices", tab: "TopOS" }.
    setCardActiveTab: (state, action) => {
      const { parent, tab } = action.payload || {};
      if (DETACHABLE_TABS[parent]?.tabs[tab] && DETACHABLE_TABS[parent].activeKey) state[DETACHABLE_TABS[parent].activeKey] = tab;
    },
    // New card of the user's, placed after afterId (or last): { title, tabs, afterId }.
    // Its tabs move here from wherever they were.
    createCustomCard: {
      reducer: (state, action) => addCustomCard(state, action.payload),
      prepare: (payload = {}) => ({ payload: { ...payload, id: `custom:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}` } }),
    },
    // Move a tab into one of the user's cards from wherever it is: { cardId, tab }. It opens there.
    moveTabToCard: (state, action) => {
      const { cardId, tab } = action.payload || {};
      if (!isDetachableId(tab) || !state.customCards.some((card) => card.id === cardId)) return;
      if (state.customCards.find((card) => card.id === cardId).tabs.includes(tab)) return;
      releaseTab(state, tab);
      const card = state.customCards.find((item) => item.id === cardId);
      if (!card) return;
      card.tabs = [...card.tabs, tab];
      card.active = tab;
    },
    // Send a tab back to its built-in card, where it opens.
    sendTabHome: (state, action) => {
      const tab = action.payload;
      if (!isDetachableId(tab)) return;
      releaseTab(state, tab);
      openInOwnCard(state, tab);
    },
    setCustomCardActive: (state, action) => {
      const { cardId, tab } = action.payload || {};
      const card = state.customCards.find((item) => item.id === cardId);
      if (card && card.tabs.includes(tab)) card.active = tab;
    },
    renameCustomCard: (state, action) => {
      const { cardId, title } = action.payload || {};
      const card = state.customCards.find((item) => item.id === cardId);
      if (card && String(title || "").trim()) card.title = String(title).trim().slice(0, 60);
    },
    // Restore from storage, or change settings: { enabled, style, colors, borderColors, textColors, noIcon, look, looks, surface }.
    setCardIcons: (state, action) => {
      const { enabled, style, colors, borderColors, textColors, noIcon, look, looks, surface } = action.payload || {};
      const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);
      if (typeof enabled === "boolean") state.cardIcons.enabled = enabled;
      if (CARD_ICON_STYLES.includes(style)) state.cardIcons.style = style;
      if (CARD_LOOKS.includes(look)) state.cardIcons.look = look;
      if (CARD_SURFACES.includes(surface)) state.cardIcons.surface = surface;
      if (isObject(colors)) {
        state.cardIcons.colors = Object.fromEntries(Object.entries(colors).filter(([, color]) => HEX.test(color)));
        // Older saves hid a card's icon with the colour 'none'.
        const hidden = Object.keys(colors).filter((id) => colors[id] === "none");
        if (hidden.length) state.cardIcons.noIcon = [...new Set([...state.cardIcons.noIcon, ...hidden])];
      }
      if (isObject(borderColors)) state.cardIcons.borderColors = Object.fromEntries(Object.entries(borderColors).filter(([, color]) => HEX.test(color)));
      if (isObject(textColors)) state.cardIcons.textColors = Object.fromEntries(Object.entries(textColors).filter(([, color]) => HEX.test(color)));
      if (Array.isArray(noIcon)) state.cardIcons.noIcon = noIcon.filter((id) => typeof id === "string");
      if (isObject(looks)) state.cardIcons.looks = Object.fromEntries(Object.entries(looks).filter(([, value]) => CARD_LOOKS.includes(value)));
    },
    // One card's colour: { cardId, color } (a hex, or null for its preset).
    setCardIconColor: (state, action) => {
      const { cardId, color } = action.payload || {};
      const { [cardId]: _old, ...rest } = state.cardIcons.colors;
      state.cardIcons.colors = HEX.test(color || "") ? { ...rest, [cardId]: color } : rest;
    },
    // One card's edge colour: { cardId, color } (a hex, or null for the card's colour).
    setCardBorderColor: (state, action) => {
      const { cardId, color } = action.payload || {};
      const { [cardId]: _old, ...rest } = state.cardIcons.borderColors || {};
      state.cardIcons.borderColors = HEX.test(color || "") ? { ...rest, [cardId]: color } : rest;
    },
    // One card's text colour: { cardId, color } (a hex, or null for the page's own).
    setCardTextColor: (state, action) => {
      const { cardId, color } = action.payload || {};
      const { [cardId]: _old, ...rest } = state.cardIcons.textColors || {};
      state.cardIcons.textColors = HEX.test(color || "") ? { ...rest, [cardId]: color } : rest;
    },
    toggleCardNoIcon: (state, action) => {
      const id = action.payload;
      const { noIcon } = state.cardIcons;
      state.cardIcons.noIcon = noIcon.includes(id) ? noIcon.filter((item) => item !== id) : [...noIcon, id];
    },
    // One card's look: { cardId, look } (null follows the look for all cards).
    setCardLook: (state, action) => {
      const { cardId, look } = action.payload || {};
      const { [cardId]: _old, ...rest } = state.cardIcons.looks;
      state.cardIcons.looks = CARD_LOOKS.includes(look) ? { ...rest, [cardId]: look } : rest;
    },
    // New metric card, placed after afterId (or last): { title, metric, filters, note, afterId }.
    createMetricCard: {
      reducer: (state, action) => {
        const card = cleanMetricCard(action.payload);
        state.metricCards = [...state.metricCards, card];
        const order = state.cardOrder.filter((item) => item !== card.id);
        const at = action.payload.afterId ? order.indexOf(action.payload.afterId) : -1;
        order.splice(at === -1 ? order.length : at + 1, 0, card.id);
        state.cardOrder = order;
        // A chart arrives as wide as the home chart; the width button steps it
        // down to sit beside another one.
        if (card.kind === "chart") state.cardWidths = { ...state.cardWidths, [card.id]: "full" };
      },
      prepare: (payload = {}) => ({ payload: { ...payload, id: `metric:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}` } }),
    },
    renameMetricCard: (state, action) => {
      const { cardId, title } = action.payload || {};
      const card = state.metricCards.find((item) => item.id === cardId);
      if (card && String(title || "").trim()) card.title = String(title).trim().slice(0, 60);
    },
    // Change a card's settings: { cardId, kind, metric, dimension, chart, top }.
    // A new kind without a chart takes that kind's first chart.
    updateMetricCard: (state, action) => {
      const { cardId, ...changes } = action.payload || {};
      const index = state.metricCards.findIndex((item) => item.id === cardId);
      if (index === -1) return;
      const current = state.metricCards[index];
      // The id stays: the order, widths and hidden cards all point at it.
      const next = { ...current, ...changes, id: current.id };
      if (changes.kind && changes.kind !== current.kind && !changes.chart) delete next.chart;
      state.metricCards[index] = cleanMetricCard(next);
    },
    // One Site card's settings: { cardId, range?, display?, server? }.
    updateSiteCard: (state, action) => {
      const { cardId, ...changes } = action.payload || {};
      if (!SETTINGS_CARDS.includes(cardId)) return;
      state.siteCards = { ...state.siteCards, [cardId]: cleanSiteCard(cardId, { ...state.siteCards[cardId], ...changes }) };
    },
    // Restore from storage or a saved view.
    setSiteCards: (state, action) => {
      state.siteCards = cleanSiteCards(action.payload);
    },
    setOnlyProblems: (state, action) => {
      state.onlyProblems = action.payload === true;
    },
    // Shows the Revenue card on one of its tabs; null once it has opened it.
    askRevenueTab: (state, action) => {
      state.revenueTabAsked = typeof action.payload === "string" ? action.payload : null;
      if (state.revenueTabAsked) state.hiddenCards = state.hiddenCards.filter((id) => id !== "revenue");
    },
    setHideEmptyCards: (state, action) => {
      state.hideEmptyCards = action.payload === true;
    },
    deleteMetricCard: (state, action) => {
      if (isMetricCardId(action.payload)) removeCard(state, action.payload);
    },
    // Restore from storage or a bookmark; dispatch before the order, widths and hidden cards.
    setMetricCards: (state, action) => {
      state.metricCards = (Array.isArray(action.payload) ? action.payload : [])
        .filter((card) => card && isMetricCardId(card.id)).slice(0, MAX_METRIC_CARDS).map(cleanMetricCard);
      state.cardOrder = withExtraCards(state.cardOrder, state);
      state.hiddenCards = state.hiddenCards.filter((id) => isCardId(state, id));
      state.cardWidths = Object.fromEntries(Object.entries(state.cardWidths).filter(([id]) => isCardId(state, id)));
    },
    // Its tabs go back to their built-in cards.
    deleteCustomCard: (state, action) => removeCard(state, action.payload),
    // Restore from storage or a bookmark; dispatch before the order, widths and hidden cards.
    setCustomCards: (state, action) => {
      // A tab saved in two cards stays in the first.
      const seen = new Set();
      state.customCards = (Array.isArray(action.payload) ? action.payload : [])
        .filter((card) => card && isCustomCardId(card.id))
        .map((card) => {
          const tabs = [...new Set((Array.isArray(card.tabs) ? card.tabs : []).filter(isDetachableId))]
            .filter((tab) => !seen.has(tab) && seen.add(tab));
          return { id: card.id, title: String(card.title || "New card").slice(0, 60), tabs, active: tabs.includes(card.active) ? card.active : tabs[0] || null };
        });
      state.cardOrder = withExtraCards(state.cardOrder, state);
      state.hiddenCards = state.hiddenCards.filter((id) => isCardId(state, id));
      state.cardWidths = Object.fromEntries(Object.entries(state.cardWidths).filter(([id]) => isCardId(state, id)));
    },
    // Older saves held popped-out tabs ("map:map") as a separate list: each becomes
    // a one-tab card of the user's, keeping its place, size and hidden state.
    migrateDetachedTabs: (state, action) => {
      const list = Array.isArray(action.payload) ? action.payload.filter(isDetachableId) : [];
      for (const tab of list) {
        if (takenTabs(state).includes(tab)) continue;
        const id = `custom:tab-${tab.replace(":", "-")}`;
        const at = state.cardOrder.indexOf(tab);
        addCustomCard(state, { id, title: tabLabel(tab), tabs: [tab], afterId: splitCardId(tab).parent });
        if (at !== -1) {
          const order = state.cardOrder.filter((item) => item !== id);
          order.splice(order.indexOf(tab), 1, id);
          state.cardOrder = order;
        }
        if (state.hiddenCards.includes(tab)) state.hiddenCards = [...state.hiddenCards.filter((item) => item !== tab), id];
        if (state.cardWidths[tab]) state.cardWidths = { ...state.cardWidths, [id]: state.cardWidths[tab] };
      }
      state.cardOrder = withExtraCards(state.cardOrder, state);
    },
  },
  extraReducers: (builder) => {
    // Here rather than in the date picker because every way of changing the
    // range lands on this action. Only a change of length counts, so the same
    // range set again doesn't undo a comparison picked from the menu.
    builder.addCase(setSelecteddatesMulti, (state, action) => {
      const days = new Set(action.payload || []).size;
      if (!days || days === state.rangeDays) return;
      state.rangeDays = days;
    });
  },
});

export const {
  setFloatingFiltersCollapsed,
  setCardRows,
  setAllCardRows,
  createMetricCard,
  renameMetricCard,
  updateMetricCard,
  deleteMetricCard,
  setMetricCards,
  createCustomCard,
  moveTabToCard,
  sendTabHome,
  setCustomCardActive,
  renameCustomCard,
  deleteCustomCard,
  setCustomCards,
  setCardIcons,
  setCardIconColor,
  setCardBorderColor,
  setCardTextColor,
  toggleCardNoIcon,
  setCardLook,
  migrateDetachedTabs,
  setCardActiveTab,
  setHiddenCards,
  askRevenueTab,
  setCardColumns,
  moveCardTo,
  toggleCardHidden,
  setcampaigntablefilter,
  setcharttype,
  setChartLayout,
  promoteFromGrid,
  returnToGrid,
  setExpandedCard,
  setChartInterval,
  setCompareEnabled,
  setComparePreset,
  setCompareRange,
  setPointRadius,
  setPeakMarkers,
  setShowAverageLine,
  setChartGrid,
  setShowHoverGuide,
  setLineCurve,
  setLinePoints,
  setLineThickness,
  setMetricLineColor,
  setMetricLineColors,
  setLineFill,
  setBarStyle,
  setChartFontSize,
  setValueLabels,
  setActivePreset,
  setCompareSegment,
  setShowLineNames,
  setShowLegend, setShowMetricIcons, setShowSpeed,
  setRollingAverageMetrics,
  setShowChartNotes,
  setNoteKindShown,
  setHiddenNoteKinds,
  setShowNoteLabels,
  setRowTrendLines,
  setExplainPoints,
  togglePointRadius,
  toggleLineMetric,
  setVisibleLineMetrics,
  switchTileLine,
  removeTile,
  setParkedLineMetrics,
  setHiddenHeadlineTiles,
  setHeaderPageTitle,
  setLocationActiveTab,
  setTimeActiveTab,
  setPagesActiveTab,
  setReferrersActiveTab,
  setDevicesActiveTab,
  setCampaignsActiveTab,
  setOutboundActiveTab,
  setDownloadsActiveTab,
  setEngagementActiveTab,
  setDashboardView,
  setPageLabelMode,
  setDepthView,
  addSelection,
  removeSelection,
  setSelections,
  clearSelections,
  moveCardUp,
  moveCardDown,
  pinCardAfterLinechart,
  setLayoutEditMode,
  setCardOrder,
  restoreCardOrder,
  clearFocusPin,
  updateSiteCard,
  setSiteCards,
  setOnlyProblems,
  setHideEmptyCards,
  setCardWidths,
} = AnalyticsUISlice.actions;

export default AnalyticsUISlice.reducer;
