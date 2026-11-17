'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// Public page linked from the printed/PDF book: /suggest?id=<Entries.id>
const API = process.env.NEXT_PUBLIC_API_URL || ''
const LANGS = [
    { value: 'general', label: 'General (whole entry)' },
    { value: 'EN', label: 'English' },
    { value: 'FR', label: 'French' },
    { value: 'DE', label: 'German' },
    { value: 'GR', label: 'Greek' },
]

function SuggestForm() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const [entry, setEntry] = useState(null)
    const [loadError, setLoadError] = useState('')
    const [form, setForm] = useState({ lang: 'general', suggested: '', comment: '', email: '', website: '' })
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState(false)

    useEffect(() => {
        if (!id || !/^\d+$/.test(id)) {
            setLoadError('No valid entry id in the link.')
            return
        }
        const load = async () => {
            try {
                const res = await fetch(`${API}/api/suggest/entry/${id}`, { credentials: 'include' })
                const data = await res.json()
                if (!res.ok) {
                    setLoadError(data?.message || 'Entry not found')
                    return
                }
                setEntry(data.entry)
            } catch (err) {
                setLoadError('Could not load the entry. Please try again later.')
            }
        }
        load()
    }, [id])

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!form.suggested.trim() && !form.comment.trim()) {
            setError('Please enter a correction or a comment.')
            return
        }
        setSending(true)
        try {
            const res = await fetch(`${API}/api/suggest`, { credentials: 'include',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, entry_id: Number(id) }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                setError(data?.message || 'Could not send your suggestion.')
                return
            }
            setDone(true)
        } catch (err) {
            setError('Could not send your suggestion. Please try again later.')
        } finally {
            setSending(false)
        }
    }

    if (loadError) return <p className="text-red-600">{loadError}</p>
    if (!entry) return <p className="text-gray-600">Loading…</p>

    return (
        <>
            <div className="border border-gray-300 rounded p-3 mb-4">
                {entry.categories.length > 0 && (
                    <div className="text-xs text-gray-600 mb-2">{entry.categories.join(' › ')}</div>
                )}
                <dl className="grid grid-cols-[3rem_1fr] gap-y-1 text-base">
                    {['EN', 'FR', 'DE', 'GR'].map((l) => (
                        <div key={l} className="contents">
                            <dt className="font-semibold text-gray-500">{l}</dt>
                            <dd className="break-words">{entry.words[l] || '—'}</dd>
                        </div>
                    ))}
                </dl>
                <div className="text-xs text-gray-400 mt-2">Entry #{entry.id}</div>
            </div>

            {done ? (
                <div className="border border-green-400 bg-green-50 rounded p-4">
                    <p className="font-semibold">Thank you!</p>
                    <p className="text-sm mt-1">Your suggestion has been received and will be reviewed.</p>
                </div>
            ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">Language</span>
                        <select value={form.lang} onChange={set('lang')} className="border p-2 rounded text-base">
                            {LANGS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                        </select>
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">Suggested correction</span>
                        <input value={form.suggested} onChange={set('suggested')} maxLength={500}
                            className="border p-2 rounded text-base" placeholder="The correct word or phrase" />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">Comment</span>
                        <textarea value={form.comment} onChange={set('comment')} maxLength={2000} rows={4}
                            className="border p-2 rounded text-base" placeholder="What is wrong, and why?" />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">Email (optional)</span>
                        <input type="email" value={form.email} onChange={set('email')} maxLength={255}
                            className="border p-2 rounded text-base" placeholder="Only if you'd like a reply" />
                    </label>
                    {/* Honeypot: hidden from people, bots tend to fill it */}
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                        <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
                    </div>
                    {error && <div className="text-red-600">{error}</div>}
                    <button type="submit" disabled={sending}
                        className="bg-blue-600 text-white px-4 py-3 rounded disabled:opacity-50 text-base">
                        {sending ? 'Sending…' : 'Send suggestion'}
                    </button>
                </form>
            )}
        </>
    )
}

export default function SuggestPage() {
    return (
        <div className="p-4 max-w-xl mx-auto w-full">
            <h1 className="text-2xl font-bold mb-4">Suggest a correction</h1>
            <Suspense fallback={<p className="text-gray-600">Loading…</p>}>
                <SuggestForm />
            </Suspense>
        </div>
    )
}
