'use client';
import { useState } from 'react';

export default function Fetchnews() {
    // Form state
    const [form, setForm] = useState({
        searchterm: '',
        topics: 'business', // worldnewsapi categories (comma-separated)
        language: 'en',
        from: '',
        to: '',
        country: 'us',
        number: 20,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState([]);
    const [rawResponse, setRawResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults([]);
        try {
            // Build query params
            const params = new URLSearchParams();
            if (form.searchterm) params.append('searchterm', form.searchterm);
            if (form.topics) params.append('topics', form.topics);
            if (form.language) params.append('language', form.language);
            if (form.from) params.append('from', form.from);
            if (form.to) params.append('to', form.to);
            if (form.country) params.append('country', form.country);
            if (form.number) params.append('number', form.number);

            // Backend expects topic as route param (topics may be comma separated)
            const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/news?${params.toString()}`;
            const res = await fetch(url, { credentials: 'include' });
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            setRawResponse(data);
            // worldnewsapi returns data.news (array)
            const list = Array.isArray(data.news) ? data.news : (Array.isArray(data.articles) ? data.articles : []);
            setResults(list);
        } catch (err) {
            setError(err.message || 'Failed to fetch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Fetch News</h1>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Search Term</label>
                    <input name="searchterm" value={form.searchterm} onChange={handleChange} className="border p-2 rounded" placeholder="(optional)" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Topics (comma separated)</label>
                    <input name="topics" value={form.topics} onChange={handleChange} className="border p-2 rounded" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Language</label>
                    <input name="language" value={form.language} onChange={handleChange} className="border p-2 rounded" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">From (YYYY-MM-DD)</label>
                    <input type="date" name="from" value={form.from} onChange={handleChange} className="border p-2 rounded" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">To (YYYY-MM-DD)</label>
                    <input type="date" name="to" value={form.to} onChange={handleChange} className="border p-2 rounded" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Country (source)</label>
                    <input name="country" value={form.country} onChange={handleChange} className="border p-2 rounded" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Number</label>
                    <input type="number" min={1} max={100} name="number" value={form.number} onChange={handleChange} className="border p-2 rounded" />
                </div>
                <div className="flex items-end">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50">
                        {loading ? 'Loading...' : 'Fetch'}
                    </button>
                </div>
            </form>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {!loading && results.length === 0 && !error && rawResponse && <div className="text-sm text-gray-500 mb-4">No results.</div>}
            {results.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-3">Results ({results.length})</h2>
                    <ul className="space-y-4">
                        {results.map(item => (
                            <li key={item.id || item.url} className="border p-4 rounded shadow-sm">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-700 hover:underline">
                                    {item.title || 'Untitled'}
                                </a>
                                <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                                    {item.publish_date && <span>{new Date(item.publish_date).toLocaleString()}</span>}
                                    {item.source_country && <span>Country: {item.source_country}</span>}
                                    {item.language && <span>Lang: {item.language}</span>}
                                </div>
                                {item.image && (
                                    <img src={item.image} alt="" className="mt-2 max-h-40 object-cover rounded" />
                                )}
                                {item.text && (
                                    <p className="text-sm mt-2 line-clamp-4 whitespace-pre-wrap">{item.text.slice(0, 500)}{item.text.length > 500 ? '…' : ''}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {rawResponse && (
                <details className="mt-8">
                    <summary className="cursor-pointer text-sm text-gray-600">Raw response JSON</summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-96">{JSON.stringify(rawResponse, null, 2)}</pre>
                </details>
            )}
        </div>
    );
}