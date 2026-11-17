'use client'

import { useEffect, useState } from 'react'
import { nativeFetch, watchFetch } from './fetchWatch.js'
import './apioffline.css'

// Dashboard pages discard their own fetch errors, so a backend that is down
// just leaves empty pages behind. This watches API calls (fetchWatch.js, shared
// with UpgradeNotice), says so, and checks back every 5s: session gone -> login, API back ->
// reload, because the pages behind threw their data away.
//
// A failed call is only a suspicion, never the verdict, and the verdict is
// expensive: showing the panel ends in a reload, so a wrong one flashes an
// outage at someone whose API is fine. Four things fail while the API is
// perfectly healthy: a reload cancels every in-flight request, which rejects as
// a TypeError rather than an abort; a report endpoint answers 503 for the one
// card whose query it could not run (backend routes/analyticsDashboard.js); the
// browser itself has no network; and a tab coming back from the background
// refetches before the machine's connection is up again. So a suspicion is
// confirmed against /users/verifyjwttoken, repeatedly, and only an API that is
// still unreachable several seconds later shows the panel.
//
// Gaps between probes. Every one of them has to fail, so the panel cannot paint
// until the API has been unreachable for their sum.
const PROBE_GAPS_MS = [0, 1500, 2500]
// Returning to a hidden tab, or waking a slept machine, cancels the in-flight
// requests and brings the network back a moment later. Several cards refetch
// the instant the tab becomes visible (useAnalyticsData's resume, LiveVisitors,
// ServerView, VerifyToken), so their failures arrive before there is anything
// to reach the API with. Probing waits at least this long after the tab came
// back before believing any of them.
const WAKE_GRACE_MS = 3000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function ApiOffline() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL
    if (!api) return

    // Requests cut off by a reload or a navigation say nothing about the API.
    let leaving = false
    // Mounting counts as the tab arriving: a first paint races the same
    // refetches a restored one does.
    let visibleAt = Date.now()
    const onLeave = () => { leaving = true }
    // pagehide also fires on the way into the back/forward cache, and a tab
    // restored from there resumes this closure instead of running again, so
    // without clearing the flag here the watcher would stay muted for good.
    const onShow = () => { leaving = false; visibleAt = Date.now() }
    const onVisible = () => {
      if (document.visibilityState === 'visible') visibleAt = Date.now()
    }
    window.addEventListener('pagehide', onLeave)
    window.addEventListener('beforeunload', onLeave)
    window.addEventListener('pageshow', onShow)
    document.addEventListener('visibilitychange', onVisible)

    // Nothing can be concluded about the API while the page is going away, is
    // hidden, or the browser reports no network of its own.
    const quiet = () =>
      leaving ||
      document.visibilityState !== 'visible' ||
      navigator.onLine === false

    let probing = false
    const confirm = async () => {
      if (quiet() || probing) return
      probing = true
      try {
        for (const gap of PROBE_GAPS_MS) {
          const wake = WAKE_GRACE_MS - (Date.now() - visibleAt)
          const wait = Math.max(gap, wake)
          if (wait > 0) await sleep(wait)
          if (quiet()) return
          let down
          try {
            const res = await nativeFetch(`${api}/users/verifyjwttoken`, { credentials: 'include' })
            // A dead upstream behind nginx answers here too; an application
            // 503 from one report does not, and 401/403 is an API that is very
            // much alive.
            down = [502, 503, 504].includes(res.status)
          } catch {
            down = true
          }
          // The API answered, or the page stopped being somewhere a verdict
          // means anything. Either way the pages stay as they are.
          if (!down || quiet()) return
        }
        setOffline(true)
      } finally {
        probing = false
      }
    }

    const unwatch = watchFetch({
      // Behind nginx a dead backend answers instead of refusing.
      response: (res, url) => {
        if (url.startsWith(api) && [502, 503, 504].includes(res.status)) void confirm()
      },
      error: (error, url) => {
        if (url.startsWith(api) && error?.name !== 'AbortError') void confirm()
      },
    })
    return () => {
      unwatch()
      window.removeEventListener('pagehide', onLeave)
      window.removeEventListener('beforeunload', onLeave)
      window.removeEventListener('pageshow', onShow)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  useEffect(() => {
    if (!offline) return
    const api = process.env.NEXT_PUBLIC_API_URL
    const check = async () => {
      if (navigator.onLine === false) return
      try {
        const res = await nativeFetch(`${api}/users/verifyjwttoken`, { credentials: 'include' })
        if (res.status === 401 || res.status === 403) window.location.href = '/users/login'
        else if (res.ok) window.location.reload()
      } catch { /* still down */ }
    }
    const id = setInterval(check, 5000)
    return () => clearInterval(id)
  }, [offline])

  if (!offline) return null

  return (
    <div className="apioffline" role="alertdialog" aria-modal="true">
      <div className="apioffline-panel">
        <h2>Can’t reach the server</h2>
        <p>
          The dashboard loaded but the API is not answering, so its pages are
          empty. You are still signed in. Checking again every few seconds.
        </p>
        <button type="button" className="ui-btn ui-btn-primary" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    </div>
  )
}
