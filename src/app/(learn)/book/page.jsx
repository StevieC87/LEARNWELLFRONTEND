'use client'
// Public page: anyone (no login) makes their own PDF of the dictionary — the languages,
// column order and chapters they want — or downloads the ready-made free edition.
// Backend: /api/book/public/* (routes/bookRouter.js); admins make full editions at /dash/book.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NAMES, MAX_LANGS, PAGE_SIZES, OrderList, VariantPicker, ChapterPicker, PronunciationPicker, GrammarNotesPicker, entryCount } from '@/features/book/bookChoices.jsx'

const API = process.env.NEXT_PUBLIC_API_URL || ''
const BASE = `${API}/api/book/public`

const api = async (url, opts = {}) => {
    const res = await fetch(`${BASE}${url}`, {
        credentials: 'include',
        ...opts,
        headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.message || `Something went wrong (${res.status})`)
    return data
}

const mb = (bytes) => `${(bytes / 1048576).toFixed(0)} MB`

export default function BookPage() {
    const [meta, setMeta] = useState(null)
    const [free, setFree] = useState(null)
    const [langOrder, setLangOrder] = useState(['en', 'gr', 'fr', 'de', 'es'])
    const [langOn, setLangOn] = useState(['en', 'gr'])
    const [indexOn, setIndexOn] = useState(['en'])
    const [chapters, setChapters] = useState([])
    const [exclude, setExclude] = useState([])
    const [opts, setOpts] = useState({ family_friendly: false, no_lgbtq: false, show_grammar_notes: true, black_and_white: false, page_size: 'A4', variants: {} })
    const [job, setJob] = useState(null) // { id, state, waiting }
    const [error, setError] = useState('')

    useEffect(() => {
        Promise.all([api('/meta'), api('/free')])
            .then(([m, f]) => { setMeta(m); setFree(f) })
            .catch(e => setError(e.message))
    }, [])

    const checkJob = useCallback(async (id) => {
        try { setJob(await api(`/status/${id}`)) }
        catch (e) { setJob(null); setError(e.message) }
    }, [])

    // while the book is being made, check on it every 3 seconds
    useEffect(() => {
        if (!job || job.state === 'done' || job.state === 'failed') return
        const t = setTimeout(() => checkJob(job.id), 3000)
        return () => clearTimeout(t)
    }, [job, checkJob])

    const languages = langOrder.filter(l => langOn.includes(l))
    const entries = useMemo(() => meta ? entryCount(meta, chapters, exclude, opts) : 0, [meta, chapters, exclude, opts])
    const busy = job && (job.state === 'queued' || job.state === 'running')

    // Any change to the choices means a different book.
    const change = (fn) => (...a) => { fn(...a); setJob(null); setError('') }

    const make = async () => {
        setError('')
        if (!languages.length) { setError('Choose at least one language.'); return }
        try {
            setJob(await api('/build', {
                method: 'POST',
                body: JSON.stringify({
                    ...opts, languages, chapters, exclude_sections: exclude,
                    index_languages: languages.filter(l => indexOn.includes(l)),
                }),
            }))
        } catch (e) { setError(e.message) }
    }

    return (
        <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-bold">Make your own dictionary</h1>
                <p className="text-gray-600 mt-2">
                    Choose your languages, the order of the columns and the topics you want, and get your own PDF.
                    {meta && <> The dictionary has {meta.total.toLocaleString()} entries in English, French, German and Greek.</>}
                </p>
            </header>

            {free?.available && (
                <section className="border border-gray-300 rounded p-4">
                    <h2 className="text-xl font-semibold">The whole book, all four languages</h2>
                    <p className="text-sm text-gray-600 mt-1">Ready to download, free ({mb(free.size)}).</p>
                    <a href={`${BASE}/free.pdf`} className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded">Download the free edition</a>
                </section>
            )}

            {!meta && !error && <p className="text-gray-600">Loading…</p>}

            {meta && (
                <>
                    <section>
                        <h2 className="text-xl font-semibold mb-1">1. Languages</h2>
                        <p className="text-sm text-gray-600 mb-3">Tick the languages you want. Up to {MAX_LANGS}. Use the arrows to set the column order: the first is the language the book is sorted by.</p>
                        <OrderList look="site" max={MAX_LANGS} order={langOrder} on={langOn}
                            onChange={change((o, on) => { setLangOrder(o); setLangOn(on) })} />
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-1">2. Topics</h2>
                        <p className="text-sm text-gray-600 mb-3">Untick a chapter to leave it out, or open it to choose single sections.</p>
                        <div className="flex gap-2 mb-2">
                            <button type="button" className="border border-gray-300 rounded px-3 py-1 text-sm" onClick={change(() => { setChapters([]); setExclude([]) })}>Select all</button>
                        </div>
                        <ChapterPicker look="site" meta={meta} chapters={chapters} exclude={exclude} settings={opts}
                            onChange={change((c, x) => { setChapters(c); setExclude(x) })} onError={setError} />
                    </section>

                    <section className="flex flex-col gap-3">
                        <h2 className="text-xl font-semibold">3. Options</h2>
                        <div>
                            <span className="text-sm font-semibold">A–Z index at the back for</span>
                            <div className="flex flex-wrap gap-4 mt-1">
                                {languages.map(l => (
                                    <label key={l} className="flex items-center gap-2">
                                        <input type="checkbox" checked={indexOn.includes(l)}
                                            onChange={change(() => setIndexOn(i => i.includes(l) ? i.filter(x => x !== l) : [...i, l]))} />
                                        {NAMES[l]}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <VariantPicker look="site" meta={meta} languages={languages} value={opts.variants}
                            onChange={change(v => setOpts(o => ({ ...o, variants: v })))} />
                        <GrammarNotesPicker look="site" value={opts.show_grammar_notes}
                            onChange={change(v => setOpts(o => ({ ...o, show_grammar_notes: v })))} />
                        <PronunciationPicker look="site" languages={languages} value={opts.show_pronunciation}
                            onChange={change(v => setOpts(o => ({ ...o, show_pronunciation: v })))} />
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={opts.family_friendly} onChange={change(e => setOpts(o => ({ ...o, family_friendly: e.target.checked })))} />
                            Family-friendly (leave out vulgar and offensive words and the Sexuality section)
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={opts.no_lgbtq} onChange={change(e => setOpts(o => ({ ...o, no_lgbtq: e.target.checked })))} />
                            Leave out LGBTQ+ topics
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={opts.black_and_white} onChange={change(e => setOpts(o => ({ ...o, black_and_white: e.target.checked })))} />
                            Black and white (for printing at home)
                        </label>
                        <label className="flex flex-col gap-1 max-w-xs">
                            <span className="text-sm font-semibold">Page size</span>
                            <select value={opts.page_size} onChange={change(e => setOpts(o => ({ ...o, page_size: e.target.value })))} className="border p-2 rounded">
                                {PAGE_SIZES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                            </select>
                        </label>
                    </section>

                    <section className="border-t border-gray-300 pt-6 flex flex-col gap-3">
                        <p>
                            <b>Your book:</b> {languages.map(l => NAMES[l]).join(' · ') || 'no languages yet'}, {entries.toLocaleString()} entries
                            {chapters.length ? `, ${chapters.length} of ${meta.chapters.length} chapters` : ', all chapters'}.
                        </p>
                        {error && <p className="text-red-600">{error}</p>}
                        {job?.state === 'done' ? (
                            <a href={`${BASE}/pdf/${job.id}`} className="self-start bg-green-600 text-white px-5 py-3 rounded">Download your PDF</a>
                        ) : (
                            <button type="button" onClick={make} disabled={busy || !languages.length}
                                className="self-start bg-blue-600 text-white px-5 py-3 rounded disabled:opacity-50">
                                {busy ? 'Making your book…' : 'Make my book'}
                            </button>
                        )}
                        {busy && (
                            <p className="text-sm text-gray-600">
                                {job.waiting ? `Waiting for ${job.waiting} other book${job.waiting > 1 ? 's' : ''} to finish first. ` : ''}
                                This takes from a few seconds to a few minutes, depending on how much you chose. You can leave this page open.
                            </p>
                        )}
                        {job?.state === 'failed' && <p className="text-red-600">Sorry, making your book failed. Please try again, or choose fewer topics.</p>}
                    </section>
                </>
            )}
        </main>
    )
}
