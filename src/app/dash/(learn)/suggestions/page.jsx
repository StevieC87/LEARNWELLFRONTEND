'use client'
import { useCallback, useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || ''
const STATUSES = ['pending', 'accepted', 'rejected', 'all']

function getCsrfToken() {
    if (typeof document !== 'undefined') {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('csrfToken='))
            ?.split('=')[1];
    }
    return null;
}

export default function SuggestionsPage() {
    const [status, setStatus] = useState('pending')
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [busyId, setBusyId] = useState(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`${API}/api/suggestions?status=${status}`, { credentials: 'include' })
            const data = await res.json()
            if (!res.ok) {
                setError(data?.message || 'Failed to load')
                setRows([])
                return
            }
            setRows(data.results || [])
        } catch (err) {
            setError(err?.message || 'Request failed')
        } finally {
            setLoading(false)
        }
    }, [status])

    useEffect(() => { load() }, [load])

    const act = async (row, newStatus, apply = false) => {
        if (apply && !confirm(`Replace ${row.lang} "${row[row.lang + 'Word']}" with "${row.suggested}"?`)) return
        setBusyId(row.id)
        setError('')
        try {
            const res = await fetch(`${API}/api/suggestions/${row.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrfToken() },
                body: JSON.stringify({ status: newStatus, apply }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                setError(data?.message || data?.error || 'Update failed')
                return
            }
            await load()
        } catch (err) {
            setError(err?.message || 'Request failed')
        } finally {
            setBusyId(null)
        }
    }

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Suggestions</h1>
            <div className="flex gap-2 mb-4 items-center">
                <label className="text-sm">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={load} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
                    {loading ? 'Loading…' : 'Refresh'}
                </button>
            </div>
            {error && <div className="text-red-600 mb-3">{error}</div>}
            {!loading && rows.length === 0 && !error && <div className="text-gray-600">No suggestions.</div>}

            {rows.length > 0 && (
                <div className="overflow-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1">Date</th>
                                <th className="border px-2 py-1">Entry</th>
                                <th className="border px-2 py-1">EN</th>
                                <th className="border px-2 py-1">FR</th>
                                <th className="border px-2 py-1">DE</th>
                                <th className="border px-2 py-1">GR</th>
                                <th className="border px-2 py-1">Lang</th>
                                <th className="border px-2 py-1">Suggested</th>
                                <th className="border px-2 py-1">Comment</th>
                                <th className="border px-2 py-1">Email</th>
                                <th className="border px-2 py-1">Status</th>
                                <th className="border px-2 py-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id}>
                                    <td className="border px-2 py-1 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                                    <td className="border px-2 py-1" title={[r.Category1, r.Category2, r.Category3, r.Category4].filter(Boolean).join(' › ')}>{r.entry_id}</td>
                                    {['EN', 'FR', 'DE', 'GR'].map((l) => (
                                        <td key={l} className={`border px-2 py-1 ${r.lang === l ? 'bg-yellow-100 font-semibold' : ''}`}>{r[l + 'Word'] ?? ''}</td>
                                    ))}
                                    <td className="border px-2 py-1">{r.lang || 'general'}</td>
                                    <td className="border px-2 py-1">{r.suggested ?? ''}</td>
                                    <td className="border px-2 py-1 whitespace-pre-wrap">{r.comment ?? ''}</td>
                                    <td className="border px-2 py-1">{r.email ?? ''}</td>
                                    <td className="border px-2 py-1">{r.status}</td>
                                    <td className="border px-2 py-1">
                                        <div className="flex flex-col gap-1">
                                            {r.status !== 'accepted' && (
                                                <button disabled={busyId === r.id} onClick={() => act(r, 'accepted')}
                                                    className="bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50">Accept</button>
                                            )}
                                            {r.lang && r.suggested && (
                                                <button disabled={busyId === r.id} onClick={() => act(r, 'accepted', true)}
                                                    className="bg-green-800 text-white px-2 py-1 rounded disabled:opacity-50">Accept &amp; apply</button>
                                            )}
                                            {r.status !== 'rejected' && (
                                                <button disabled={busyId === r.id} onClick={() => act(r, 'rejected')}
                                                    className="bg-red-600 text-white px-2 py-1 rounded disabled:opacity-50">Reject</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
