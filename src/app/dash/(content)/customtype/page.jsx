'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { setContentTypesList, removeContentType } from '@/redux/slices/CustomTypesSlice';
import Skeleton from '@/components/ui/Skeleton.jsx';
import PageTitle from "@/components/layout/PageTitle.jsx";

function getCsrfToken() {
    if (typeof document !== 'undefined') {
        return document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrfToken='))
            ?.split('=')[1];
    }
    return null;
}

export default function CustomTypePage() {
    const dispatch = useDispatch();
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/contenttypes`,
                { credentials: 'include' }
            );
            if (!res.ok) throw new Error('Failed to load content types');
            const data = await res.json();
            const list = data.types || [];
            setTypes(list);
            dispatch(setContentTypesList(list)); // keep sidebar in sync
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeleting(id);
        const csrfToken = getCsrfToken();
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/contenttypes/${id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'X-CSRF-Token': csrfToken },
                }
            );
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Delete failed');
            setTypes((prev) => prev.filter((t) => t._id !== id));
            dispatch(removeContentType(id)); // remove from sidebar instantly
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="ui-page">
            <PageTitle icon="page" title="Content types" actions={
                <Link href="/dash/customtype/createtype" className="ui-btn ui-btn-primary">New content type</Link>
            }>The kinds of pages and repeatable entries (a blog, articles) your site has.</PageTitle>

            {loading && <Skeleton kind="table" rows={4} cols={1} />}
            {error && <p className="ui-status is-error" role="alert">{error}</p>}

            {!loading && !error && types.length === 0 && (
                <section className="ui-card">
                    <div className="ui-card-body ui-empty">
                        <p className="ui-help">No content types yet.</p>
                        <Link href="/dash/customtype/createtype" className="ui-btn ui-btn-secondary">Create your first content type</Link>
                    </div>
                </section>
            )}

            {!loading && types.length > 0 && (
                <section className="ui-card">
                    <div className="ui-card-body">
                        <table className="ui-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Kind</th>
                                    <th><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {types.map((t) => (
                                    <tr key={t._id}>
                                        <td>
                                            <Link href={`/dash/customtype/${t._id}`}>{t.name}</Link>
                                            <span className="ui-cell-sub">
                                                <code>{t.apiname}</code>{t.slugpath ? ` · ${t.slugpath}` : ''}
                                            </span>
                                        </td>
                                        <td>{{ page: 'Page', repeatable: 'Repeatable', block: 'Block' }[t.type] || t.type}</td>
                                        <td className="ui-cell-actions">
                                            <Link href={`/dash/customtype/${t._id}`} className="ui-btn ui-btn-quiet ui-btn-sm">Edit fields</Link>
                                            <button type="button" className="ui-btn ui-btn-quiet ui-btn-sm is-danger"
                                                disabled={deleting === t._id}
                                                onClick={() => handleDelete(t._id, t.name)}>
                                                {deleting === t._id ? 'Deleting…' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}


