'use client'
// What both Book builder pages share: the public /book page and the dashboard's /dash/book.
// Language order lists and the chapter/section picker. `look` picks the styling:
// 'dash' uses the dashboard's UI kit (kit.css), 'site' plain Tailwind for the public site.

export const ALL = ['en', 'fr', 'de', 'gr', 'es']
export const NAMES = { en: 'English', fr: 'Français', de: 'Deutsch', gr: 'Ελληνικά', es: 'Español' }
export const MAX_LANGS = 4 // a fifth column would not fit the page
export const PAGE_SIZES = [
    ['7in 10in', '7 × 10 in (17.8 × 25.4 cm)'],
    ['6in 9in', '6 × 9 in (15.2 × 22.9 cm)'],
    ['156mm 234mm', 'Royal (15.6 × 23.4 cm)'],
    ['189mm 246mm', 'Crown Quarto (18.9 × 24.6 cm)'],
    ['8.5in 11in', 'US Letter (21.6 × 27.9 cm)'],
    ['A4', 'A4 (21 × 29.7 cm)'],
]

const LOOK = {
    dash: { check: 'ui-check', btn: 'ui-btn ui-btn-secondary ui-btn-sm', muted: 'ui-help', field: 'ui-field', label: 'ui-label', select: 'ui-input' },
    site: {
        check: 'flex items-center gap-2',
        field: 'flex flex-col gap-1 max-w-xs',
        label: 'text-sm font-semibold',
        select: 'border p-2 rounded',
        btn: 'border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-30',
        muted: 'text-gray-500 text-sm',
    },
}

// A section's entries for this edition (s = the settings): a British book (en 'base') leaves out US-only
// entries (401(k)), an American one ('US') UK-only ones (council tax); family_friendly the adult/vulgar
// ones, no_lgbtq the LGBTQ+ topics. x.by (from the backend's meta) counts entries per "region|f|l".
export const sectionCount = (x, s = {}) => {
    if (!x.by) return x.count
    const drop = { base: 'US', US: 'UK' }[s.variants?.en]
    let n = 0
    for (const [k, c] of Object.entries(x.by)) {
        const [region, f, l] = k.split('|')
        if (!(drop && region === drop) && !(f && s.family_friendly) && !(l && s.no_lgbtq)) n += c
    }
    return n
}

// Entries in the book: the chosen chapters (empty = all) minus the left-out sections.
export const entryCount = (meta, chapters, exclude, s) => {
    let n = 0
    for (const c of meta.chapters) if (!chapters.length || chapters.includes(c.name))
        for (const x of c.sections) if (!exclude.includes(`${c.name} > ${x.name}`)) n += sectionCount(x, s)
    return n
}

// Regional variant per language: value {en: 'notes'|'base'|'US'}. meta.variants (from backend/bookgen/grammar.js)
// says which languages have variants, e.g. {en: {base: 'British', US: 'American'}}; only those are shown.
export function VariantPicker({ meta, languages, value = {}, onChange, look = 'dash' }) {
    const L = LOOK[look]
    return languages.filter(l => meta?.variants?.[l]).map(l => {
        const { base, ...alts } = meta.variants[l]
        const options = [['notes', `${base}, with ${Object.values(alts).join(' / ')} words noted`], ['base', base], ...Object.entries(alts)]
        return (
            <label key={l} className={L.field}>
                <span className={L.label}>{NAMES[l]}</span>
                <select className={L.select} value={value[l] || 'notes'} onChange={e => onChange({ ...value, [l]: e.target.value })}>
                    {options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                </select>
            </label>
        )
    })
}

// Pronunciation: value false (off), true (every language) or a list of languages, e.g. ['en'] for learners of English
export function PronunciationPicker({ languages, value, onChange, look = 'dash' }) {
    const L = LOOK[look]
    const v = value === true ? 'all' : Array.isArray(value) && value.length ? value[0] : ''
    return (
        <label className={L.field}>
            <span className={L.label}>Pronunciation (IPA after the word; adds pages)</span>
            <select className={L.select} value={v} onChange={e => onChange(e.target.value === 'all' ? true : e.target.value ? [e.target.value] : false)}>
                <option value="">None</option>
                <option value="all">Every language</option>
                {languages.map(l => <option key={l} value={l}>{NAMES[l]} only</option>)}
            </select>
        </label>
    )
}

// Grammar notes (plurals, past forms…): every language, or not for the book's own language (the first column:
// a German–English book for German speakers needs no German plurals), or none. Saved as true / "not_first" / false.
export function GrammarNotesPicker({ value, onChange, look = 'dash' }) {
    const L = LOOK[look]
    const v = value === false ? 'none' : value === 'not_first' || Array.isArray(value) ? 'not_first' : 'all'
    return (
        <label className={L.field}>
            <span className={L.label}>Grammar notes (plurals, genders, past forms…)</span>
            <select className={L.select} value={v} onChange={e => onChange({ all: true, not_first: 'not_first', none: false }[e.target.value])}>
                <option value="all">Every language</option>
                <option value="not_first">Not for the first language (the reader&apos;s own)</option>
                <option value="none">None</option>
            </select>
        </label>
    )
}

// A tick list whose order can be changed with ↑/↓ (the book's columns, the indexes).
// max: how many can be ticked (the rest are greyed out until one is unticked)
export function OrderList({ order, on, onChange, look = 'dash', max = Infinity }) {
    const L = LOOK[look]
    const move = (i, d) => {
        const o = [...order];
        [o[i], o[i + d]] = [o[i + d], o[i]]
        onChange(o, on)
    }
    const toggle = (l) => onChange(order, on.includes(l) ? on.filter(x => x !== l) : [...on, l])
    return (
        <ul className="flex flex-col gap-1">
            {order.map((l, i) => (
                <li key={l} className={`flex items-center gap-2 ${on.includes(l) ? '' : 'opacity-50'}`}>
                    <label className={`${L.check} flex-1`}>
                        <input type="checkbox" checked={on.includes(l)} disabled={!on.includes(l) && on.length >= max} onChange={() => toggle(l)} />
                        <b>{i + 1}. {NAMES[l]}</b>
                    </label>
                    <button type="button" className={L.btn} disabled={!i} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
                    <button type="button" className={L.btn} disabled={i === order.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
                </li>
            ))}
        </ul>
    )
}

// Chapters with their sections. chapters: the chosen ones (empty = all); exclude: "Chapter > Section" keys.
// onChange(chapters, exclude); onError(message) when the last chapter would be unticked.
export function ChapterPicker({ meta, chapters, exclude, settings, onChange, onError, look = 'dash' }) {
    const L = LOOK[look]
    const chosen = chapters.length ? chapters : meta.chapters.map(c => c.name)
    const keysOf = (c) => c.sections.map(x => `${c.name} > ${x.name}`)
    // an empty list means "every chapter", so the last one can't be unticked
    const setChoice = (nextChosen, nextExcluded) => {
        if (!nextChosen.length) { onError?.('Keep at least one chapter.'); return }
        onChange(
            nextChosen.length === meta.chapters.length ? [] : meta.chapters.map(c => c.name).filter(c => nextChosen.includes(c)),
            nextExcluded,
        )
    }
    // Ticking or unticking a chapter does the same to all its sections.
    const toggleChapter = (c) => {
        const keys = keysOf(c)
        const rest = exclude.filter(k => !keys.includes(k))
        setChoice(chosen.includes(c.name) ? chosen.filter(n => n !== c.name) : [...chosen, c.name], rest)
    }
    // A section of an unticked chapter brings the chapter back with just that section;
    // unticking a chapter's last section unticks the chapter.
    const toggleSection = (c, key) => {
        const keys = keysOf(c)
        const others = exclude.filter(k => !keys.includes(k))
        if (!chosen.includes(c.name)) return setChoice([...chosen, c.name], [...others, ...keys.filter(k => k !== key)])
        const off = exclude.includes(key) ? exclude.filter(k => k !== key) : [...exclude, key]
        if (keys.every(k => off.includes(k))) return setChoice(chosen.filter(n => n !== c.name), others)
        setChoice(chosen, off)
    }

    return meta.chapters.map((c, i) => {
        const n = c.sections.reduce((a, x) => a + sectionCount(x, settings), 0)
        const on = chosen.includes(c.name)
        const some = on && keysOf(c).some(k => exclude.includes(k))
        return (
            <details key={c.name} className="border-b py-1" style={{ borderColor: look === 'dash' ? 'var(--ui-border)' : undefined }}>
                <summary className="flex items-center gap-2 cursor-pointer py-1">
                    <input type="checkbox" checked={on} ref={el => { if (el) el.indeterminate = some }} onChange={() => toggleChapter(c)} onClick={e => e.stopPropagation()} aria-label={c.name} />
                    <b>{i + 1}. {c.name}</b><span className={`${L.muted} ml-auto`}>{n.toLocaleString()} entries</span>
                </summary>
                <div className="grid gap-1 py-2 pl-6 md:grid-cols-2">
                    {c.sections.map(x => {
                        const key = `${c.name} > ${x.name}`
                        return (
                            <label key={key} className={L.check}>
                                <input type="checkbox" checked={on && !exclude.includes(key)} onChange={() => toggleSection(c, key)} />
                                {x.name} <span className={L.muted}>{sectionCount(x, settings)}</span>
                            </label>
                        )
                    })}
                </div>
            </details>
        )
    })
}
