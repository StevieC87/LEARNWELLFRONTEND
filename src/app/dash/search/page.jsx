'use client'
import { useState } from 'react'

export default function SearchWordsPage() {
    const [q, setQ] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [results, setResults] = useState([])
    const [raw, setRaw] = useState(null)

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setResults([])
        setRaw(null)
        try {
            if (!q.trim()) {
                setError('Please enter a word')
                return
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/search/words?q=${encodeURIComponent(q.trim())}`
            const res = await fetch(url)
            const data = await res.json()
            setRaw(data)
            if (!res.ok) {
                setError(data?.message || data?.error || 'No matches found')
                return
            }
            setResults(Array.isArray(data.results) ? data.results : [])
        } catch (err) {
            setError(err?.message || 'Request failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Search ENWord</h1>
            <form onSubmit={onSubmit} className="flex gap-2 mb-4">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Enter exact English word"
                    className="border p-2 rounded w-full"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Searching…' : 'Search'}
                </button>
            </form>
            {error && <div className="text-red-600 mb-3">{error}</div>}

            {results.length > 0 && (
                <div className="overflow-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">Order</th>
                                <th className="border px-2 py-1">EN</th>
                                <th className="border px-2 py-1">FR</th>
                                <th className="border px-2 py-1">DE</th>
                                <th className="border px-2 py-1">GR</th>
                                <th className="border px-2 py-1">Category1</th>
                                <th className="border px-2 py-1">Category2</th>
                                <th className="border px-2 py-1">Category3</th>
                                <th className="border px-2 py-1">Category4</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row) => (
                                <tr key={row.id || row._id}>
                                    <td className="border px-2 py-1">{row.id || row._id}</td>
                                    <td className="border px-2 py-1">{row.order_number ?? ''}</td>
                                    <td className="border px-2 py-1 font-semibold">{row.ENWord ?? ''}</td>
                                    <td className="border px-2 py-1">{row.FRWord ?? ''}</td>
                                    <td className="border px-2 py-1">{row.DEWord ?? ''}</td>
                                    <td className="border px-2 py-1">{row.GRWord ?? ''}</td>
                                    <td className="border px-2 py-1">{row.Category1 ?? ''}</td>
                                    <td className="border px-2 py-1">{row.Category2 ?? ''}</td>
                                    <td className="border px-2 py-1">{row.Category3 ?? ''}</td>
                                    <td className="border px-2 py-1">{row.Category4 ?? ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {raw && (
                <details className="mt-4">
                    <summary className="cursor-pointer text-gray-600 text-sm">Raw response</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-96">{JSON.stringify(raw, null, 2)}</pre>
                </details>
            )}
        </div>
    )
}
