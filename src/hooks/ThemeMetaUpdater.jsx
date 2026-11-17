"use client";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setdarkmodeOn } from "@/redux/slices/DashSlice.js";
import {
    applyTheme,
    hasExplicitTheme,
    persistTheme,
    readPreferredTheme,
    systemPrefersDark,
    takeSystemFollow,
    THEME_COLOR,
} from "@/lib/themeBoot.js";

export default function ThemeMetaUpdater() {
    const dispatch = useDispatch();
    const darkmodeOn = useSelector((state) => state.DashSlice && state.DashSlice.darkmodeOn);

    // Resolved during the first client render, i.e. before any effect can repaint the
    // page. The store still starts at its `darkmodeOn: false` default, so without this
    // the apply-effect below would run once with the wrong value and flash.
    const bootedRef = useRef(null);
    if (bootedRef.current === null && typeof window !== "undefined") {
        const stored = readPreferredTheme();
        bootedRef.current = stored ? stored === "dark" : systemPrefersDark();
    }
    const appliedOnceRef = useRef(false);
    const fromSystemRef = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        dispatch(setdarkmodeOn(Boolean(bootedRef.current)));

        const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
        // Only follow the OS for visitors who never picked a side; an explicit choice
        // must survive the OS flipping at sunset.
        const handleChange = (e) => {
            if (hasExplicitTheme()) return;
            fromSystemRef.current = true;
            dispatch(setdarkmodeOn(e.matches));
        };

        matchMedia.addEventListener("change", handleChange);
        return () => matchMedia.removeEventListener("change", handleChange);
    }, [dispatch]);

    useEffect(() => {
        if (typeof document === "undefined") return;

        const isDark = Boolean(darkmodeOn);

        // First pass runs before the dispatch above lands. The document is already
        // correct from the boot script, so leave it alone rather than repaint it.
        const wasApplied = appliedOnceRef.current;
        if (!wasApplied) {
            appliedOnceRef.current = true;
            if (isDark !== Boolean(bootedRef.current)) return;
        }

        // Anything after the first pass that did not come from the OS is the toggle,
        // except Appearance's "Match system", which switches to the OS's side.
        const explicit = wasApplied && !fromSystemRef.current && !takeSystemFollow();
        fromSystemRef.current = false;

        persistTheme(isDark, explicit);
        applyTheme(isDark);

        // The public site's pages keep their own colour, whatever the theme (SiteShell.jsx).
        if (document.querySelector(".sg-site")) return;

        // The body's colour as painted, so a Background picked in Appearance is matched too.
        // The server may have sent one tag per OS side; every one gets the same answer.
        const color = getComputedStyle(document.body).backgroundColor || THEME_COLOR[isDark ? "dark" : "light"];
        const metaTags = [...document.querySelectorAll('meta[name="theme-color"]')];
        if (!metaTags.length) {
            const metaTag = document.createElement("meta");
            metaTag.name = "theme-color";
            document.head.appendChild(metaTag);
            metaTags.push(metaTag);
        }
        metaTags.forEach((metaTag) => { metaTag.content = color; });
    }, [darkmodeOn]);

    return null;
}
