'use client'
// Book builder (admins): full editions of the dictionary with their own cover and foreword.
// Visitors make their own books on the public /book page. The backend runs the generator
// (backend/bookgen, routes/bookRouter.js).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PageTitle from '@/components/layout/PageTitle.jsx'
import { ALL, NAMES, PAGE_SIZES, OrderList, VariantPicker, ChapterPicker, PronunciationPicker, GrammarNotesPicker, entryCount } from '@/features/book/bookChoices.jsx'

const API = process.env.NEXT_PUBLIC_API_URL || ''
const TEXT_FIELDS = [
    ['title', 'Title'],
    ['author', 'Author'],
    ['edition_label', 'Edition label (on the cover)'],
    ['edition', 'Edition (copyright page), e.g. 1st edition'],
    ['version', 'Version, e.g. 1.0 (raise it with each update)'],
    ['website', 'Website (cover, footer, back page)'],
    ['updates_url', 'Updates page (copyright page, with a QR code)'],
]
const CONTENT_FLAGS = [
    ['family_friendly', 'Family-friendly (leave out vulgar and offensive words and the Sexuality section)'],
    ['no_lgbtq', 'Leave out LGBTQ+ topics'],
    ['show_check_flags', 'Mark best guesses with ⚑ (for native-speaker review)'],
]

function getCsrfToken() {
    if (typeof document !== 'undefined') {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('csrfToken='))
            ?.split('=')[1];
    }
    return null;
}

const api = async (url, opts = {}) => {
    const res = await fetch(`${API}/api/book${url}`, {
        credentials: 'include',
        ...opts,
        headers: opts.body ? { 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrfToken() } : undefined,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.message || data?.error || `Request failed (${res.status})`)
    return data
}

// The edition settings, turned into what the page edits: language order + which are ticked.
const fromEdition = (s) => {
    const L = (s.languages || ALL).filter(l => ALL.includes(l))
    const I = (s.index_languages || ['en']).filter(l => ALL.includes(l))
    return {
        ...s,
        langOrder: [...L, ...ALL.filter(l => !L.includes(l))], langOn: L,
        idxOrder: [...I, ...ALL.filter(l => !I.includes(l))], idxOn: I,
        chapters: s.chapters || [], exclude_sections: s.exclude_sections || [],
        edition_name: s.edition_name || '',
    }
}
const toEdition = (f) => {
    const { langOrder, langOn, idxOrder, idxOn, ...s } = f
    s.languages = langOrder.filter(l => langOn.includes(l))
    s.index_languages = idxOrder.filter(l => idxOn.includes(l) && langOn.includes(l))
    s.edition_name = f.edition_name.trim() || s.languages.join('-')
    return s
}

export default function BookBuilderPage() {
    const [meta, setMeta] = useState(null)
    const [form, setForm] = useState(null)
    const [editions, setEditions] = useState([])
    const [job, setJob] = useState({})
    const [freshData, setFreshData] = useState(false)
    const [status, setStatus] = useState({ text: '', error: false })
    const logRef = useRef(null)

    const say = (text, error = false) => setStatus({ text, error })
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const loadEditions = useCallback(async () => setEditions(await api('/editions')), [])

    const refreshStatus = useCallback(async () => {
        try {
            const j = await api('/status')
            setJob(j)
            if (j.done) loadEditions()
        } catch (e) { say(e.message, true) }
    }, [loadEditions])

    // while a build runs, ask for its progress every 2 seconds
    useEffect(() => {
        if (!job.name || job.done) return
        const t = setTimeout(refreshStatus, 2000)
        return () => clearTimeout(t)
    }, [job, refreshStatus])

    useEffect(() => {
        (async () => {
            try {
                const [m, d] = await Promise.all([api('/meta'), api('/defaults')])
                setMeta(m)
                setForm(fromEdition(d))
                await loadEditions()
                refreshStatus()
            } catch (e) { say(e.message, true) }
        })()
    }, [loadEditions, refreshStatus])

    useEffect(() => { if (logRef.current) logRef.current.scrollTop = 1e9 }, [job.log])

    const summary = useMemo(() => {
        if (!meta || !form) return null
        const s = toEdition(form)
        return { s, n: entryCount(meta, s.chapters, s.exclude_sections, s) }
    }, [meta, form])

    if (!form || !meta) {
        return <div className="ui-page"><PageTitle title="Book builder" />
            {status.text ? <p className={`ui-status ${status.error ? 'is-error' : ''}`}>{status.text}</p> : <p className="ui-help">Loading the dictionary…</p>}</div>
    }

    const building = job.name && !job.done

    const save = async () => {
        const s = toEdition(form)
        if (!s.languages.length) { say('Tick at least one language.', true); return null }
        const r = await api('/editions', { method: 'POST', body: JSON.stringify(s) })
        set('edition_name', r.name)
        await loadEditions()
        return r.name
    }
    const onSave = async () => {
        try { const n = await save(); if (n) say(`Saved as ${n}`) } catch (e) { say(e.message, true) }
    }
    const onBuild = async (format = 'pdf') => {
        try {
            const name = await save()
            if (!name) return
            await api('/build', { method: 'POST', body: JSON.stringify({ name, freshData, format }) })
            say('')
            refreshStatus()
        } catch (e) { say(e.message, true) }
    }
    const onLoad = async (name) => {
        if (!name) return
        try { setForm(fromEdition(await api(`/editions/${encodeURIComponent(name)}`))); say(`Loaded ${name}`) }
        catch (e) { say(e.message, true) }
    }
    const pdfUrl = (name, download) => `${API}/api/book/pdf/${encodeURIComponent(name)}${download ? '?download=1' : ''}`

    return (
        <div className="ui-page">
            <PageTitle title="Book builder" actions={
                <div className="ui-actions">
                    <button className="ui-btn ui-btn-secondary" onClick={onSave}>Save</button>
                    <button className="ui-btn ui-btn-secondary" onClick={() => onBuild('epub')} disabled={building} title="Ebook for Kindle, Apple Books, Kobo, Google Play">Save & build EPUB</button>
                    <button className="ui-btn ui-btn-primary" onClick={() => onBuild()} disabled={building}>{building ? 'Building…' : 'Save & build PDF'}</button>
                </div>
            }>
                Choose the languages, chapters and look of an edition of the dictionary, then build its PDF.
                Dictionary data from {meta.updated}: {meta.total.toLocaleString()} entries.
            </PageTitle>

            {status.text && <p className={`ui-status ${status.error ? 'is-error' : 'is-success'}`}>{status.text}</p>}

            <section className="ui-card">
                <div className="ui-card-head"><h3>Edition</h3><p>Load a saved edition, or name a new one. Saving with an existing name overwrites it.</p></div>
                <div className="ui-card-body grid gap-4 md:grid-cols-2">
                    <label className="ui-field"><span className="ui-label">Load saved edition</span>
                        <select className="ui-input" value="" onChange={e => onLoad(e.target.value)}>
                            <option value="">Choose…</option>
                            {editions.map(e => <option key={e.name} value={e.name}>{e.name}</option>)}
                        </select></label>
                    <label className="ui-field"><span className="ui-label">Edition name</span>
                        <input className="ui-input" type="text" placeholder="e.g. en-gr-family" value={form.edition_name} onChange={e => set('edition_name', e.target.value)} /></label>
                </div>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
                <section className="ui-card">
                    <div className="ui-card-head"><h3>Languages: columns and order</h3><p>The first one is the main language.</p></div>
                    <div className="ui-card-body">
                        <OrderList order={form.langOrder} on={form.langOn} onChange={(o, on) => setForm(f => ({ ...f, langOrder: o, langOn: on }))} />
                    </div>
                </section>
                <section className="ui-card">
                    <div className="ui-card-head"><h3>Indexes at the back</h3><p>One A–Z index per ticked language. Each adds roughly 150 pages for the full book.</p></div>
                    <div className="ui-card-body">
                        <OrderList order={form.idxOrder} on={form.idxOn} onChange={(o, on) => setForm(f => ({ ...f, idxOrder: o, idxOn: on }))} />
                    </div>
                </section>
                <section className="ui-card">
                    <div className="ui-card-head"><h3>Content</h3></div>
                    <div className="ui-card-body flex flex-col gap-2">
                        <VariantPicker meta={meta} languages={form.langOrder.filter(l => form.langOn.includes(l))}
                            value={form.variants} onChange={v => set('variants', v)} />
                        {CONTENT_FLAGS.map(([k, label]) => (
                            <label key={k} className="ui-check"><input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)} /> {label}</label>
                        ))}
                        <GrammarNotesPicker value={form.show_grammar_notes} onChange={v => set('show_grammar_notes', v)} />
                        <PronunciationPicker languages={form.langOrder.filter(l => form.langOn.includes(l))} value={form.show_pronunciation} onChange={v => set('show_pronunciation', v)} />
                    </div>
                </section>
                <section className="ui-card">
                    <div className="ui-card-head"><h3>Look</h3></div>
                    <div className="ui-card-body flex flex-col gap-3">
                        <label className="ui-field"><span className="ui-label">Page size</span>
                            <select className="ui-input" value={form.page_size} onChange={e => set('page_size', e.target.value)}>
                                {PAGE_SIZES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                            </select></label>
                        <label className="ui-field"><span className="ui-label">Text size (points): smaller = fewer pages</span>
                            <input className="ui-input ui-input-sm" type="number" min="5" max="12" step="0.1" value={form.text_size} onChange={e => set('text_size', +e.target.value)} /></label>
                        <label className="ui-check"><input type="checkbox" checked={!!form.black_and_white} onChange={e => set('black_and_white', e.target.checked)} /> Black and white (cheaper to print)</label>
                    </div>
                </section>
            </div>

            <section className="ui-card">
                <div className="ui-card-head"><h3>Cover and front pages</h3></div>
                <div className="ui-card-body flex flex-col gap-3">
                    <div className="grid gap-3 md:grid-cols-2">
                        {TEXT_FIELDS.map(([k, label]) => (
                            <label key={k} className="ui-field"><span className="ui-label">{label}</span>
                                <input className="ui-input" type="text" value={form[k] || ''} onChange={e => set(k, e.target.value)} /></label>
                        ))}
                    </div>
                    <label className="ui-field"><span className="ui-label">Foreword (leave empty for none; a blank line starts a new paragraph)</span>
                        <textarea className="ui-input" rows={6} value={form.foreword || ''} onChange={e => set('foreword', e.target.value)} /></label>
                    <label className="ui-field"><span className="ui-label">Last page, “More editions” (leave empty for the default: the other language editions on your website)</span>
                        <textarea className="ui-input" rows={3} value={form.back_text || ''} onChange={e => set('back_text', e.target.value)} /></label>
                    <label className="ui-check"><input type="checkbox" checked={!!form.draft} onChange={e => set('draft', e.target.checked)} /> Mark as DRAFT</label>
                </div>
            </section>

            <section className="ui-card">
                <div className="ui-card-head">
                    <h3>Chapters and sections</h3>
                    <p>Untick a chapter to leave it out, or open it to leave out single sections.</p>
                </div>
                <div className="ui-card-body">
                    <div className="ui-actions mb-3">
                        <button className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => setForm(f => ({ ...f, chapters: [], exclude_sections: [] }))}>All</button>
                        <button className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => set('chapters', [meta.chapters[0].name])}>Just chapter 1 (quick test)</button>
                    </div>
                    <ChapterPicker meta={meta} chapters={form.chapters} exclude={form.exclude_sections} settings={form}
                        onChange={(chapters, exclude_sections) => setForm(f => ({ ...f, chapters, exclude_sections }))}
                        onError={m => say(m, true)} />
                </div>
            </section>

            <section className="ui-card">
                <div className="ui-card-head"><h3>Build</h3></div>
                <div className="ui-card-body flex flex-col gap-3">
                    <p>
                        <b>{summary.s.edition_name}</b> · {summary.s.languages.map(l => NAMES[l]).join(' | ') || 'no languages'} · {summary.n.toLocaleString()} entries
                        {form.family_friendly ? ' (family-friendly)' : ''}{form.no_lgbtq ? ' (no LGBTQ+)' : ''} · index: {summary.s.index_languages.map(l => NAMES[l]).join(', ') || 'none'} · {form.page_size}
                    </p>
                    <label className="ui-check"><input type="checkbox" checked={freshData} onChange={e => setFreshData(e.target.checked)} /> Re-read the dictionary first (use after editing words; adds a few seconds)</label>
                    {job.name && (
                        <p className={`ui-status ${!job.done ? '' : job.ok ? 'is-success' : 'is-error'}`}>
                            {!job.done && (job.waiting
                                ? <>Waiting for {job.waiting} other book{job.waiting > 1 ? 's' : ''} to finish…</>
                                : <>Building {job.name}… (a few minutes for the full book)</>)}
                            {job.done && job.ok && (job.format === 'epub'
                                ? <>Done: <a href={`${API}/api/book/epub/${encodeURIComponent(job.name)}`}>download {job.name}.epub</a></>
                                : <>Done: <a href={pdfUrl(job.name)} target="_blank" rel="noreferrer">open {job.name}.pdf</a></>)}
                            {job.done && !job.ok && <>The build of {job.name} failed. See the log below.</>}
                        </p>
                    )}
                    {job.log && <pre ref={logRef} className="ui-code" style={{ maxHeight: 240, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{job.log}</pre>}
                </div>
            </section>

            <section className="ui-card">
                <div className="ui-card-head"><h3>Saved editions</h3></div>
                <div className="ui-card-body">
                    <table className="ui-table">
                        <thead><tr><th>Edition</th><th>PDF</th><th /></tr></thead>
                        <tbody>
                            {editions.map(e => (
                                <tr key={e.name}>
                                    <td>{e.name}</td>
                                    <td>{e.pdf ? <>{(e.pdf.size / 1048576).toFixed(1)} MB<div className="ui-cell-sub">{new Date(e.pdf.built).toLocaleString()}</div></> : <span className="ui-help">not built</span>}</td>
                                    <td className="ui-cell-actions">
                                        <button className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => onLoad(e.name)}>Load</button>
                                        {e.pdf && <a className="ui-btn ui-btn-secondary ui-btn-sm" href={pdfUrl(e.name)} target="_blank" rel="noreferrer">Open</a>}
                                        {e.pdf && <a className="ui-btn ui-btn-secondary ui-btn-sm" href={pdfUrl(e.name, true)}>Download</a>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
