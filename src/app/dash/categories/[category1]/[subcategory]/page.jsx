'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Sortable from 'sortablejs';
import { useParams } from 'next/navigation';
import '../../categories.css';

export default function Category1() {
    const { category1, subcategory } = useParams();
    const [groupedWords, setGroupedWords] = useState({});
    const tableRefs = useRef({});
    const sortablesRef = useRef({});

    // Fetch data
    useEffect(() => {
        const fetchspecificcatwords = async () => {
            const subcategoryURLENCODE = encodeURIComponent(subcategory);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/fetchspecificcatwords?category1=${category1}&subcategory=${subcategoryURLENCODE}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );
            const data = await res.json();

            const grouped = data.querysubcategorywords.reduce((acc, word) => {
                const key = word.Category3 && word.Category3 !== '\\N' ? word.Category3 : '';
                if (!acc[key]) acc[key] = [];
                acc[key].push(word);
                return acc;
            }, {});
            setGroupedWords(grouped);
        };
        fetchspecificcatwords();
    }, [category1, subcategory]);

    // Drag-end handler (within one group)
    const handleDragEnd = useCallback((evt, category) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;

        setGroupedWords(prev => {
            const current = prev[category] ? [...prev[category]] : [];
            const [moved] = current.splice(oldIndex, 1);
            current.splice(newIndex, 0, moved);
            const updated = current.map((w, i) => ({ ...w, order_number: i + 1 }));
            updateOrderInBackend(updated);
            return { ...prev, [category]: updated };
        });
    }, []);

    // Create/destroy Sortable instances exactly once per tbody
    const attachSortable = useCallback((category, el) => {
        const prevEl = tableRefs.current[category];

        // Element removed: destroy instance
        if (!el) {
            if (sortablesRef.current[category]) {
                sortablesRef.current[category].destroy();
                delete sortablesRef.current[category];
            }
            if (prevEl) delete tableRefs.current[category];
            return;
        }

        // Same element already initialised
        if (prevEl === el && sortablesRef.current[category]) return;

        // If element changed, destroy old instance first
        if (sortablesRef.current[category]) {
            sortablesRef.current[category].destroy();
            delete sortablesRef.current[category];
        }

        tableRefs.current[category] = el;

        sortablesRef.current[category] = Sortable.create(el, {
            animation: 150,
            draggable: 'tr.sortable-row',
            onEnd: (evt) => handleDragEnd(evt, category),
        });
    }, [handleDragEnd]);

    // Destroy all on unmount (covers StrictMode double effects)
    useEffect(() => {
        return () => {
            Object.values(sortablesRef.current).forEach(inst => inst?.destroy());
            sortablesRef.current = {};
            tableRefs.current = {};
        };
    }, []);

    const updateOrderInBackend = async (updatedWords) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateOrder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updatedWords }),
            });
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    };

    return (
        <div>
            <h1>{category1}</h1>
            <h2 className="text-2xl font-bold mb-4">{subcategory}</h2>

            {Object.entries(groupedWords).map(([category, rows]) => (
                <div key={category} className="mb-6">
                    <h2 className="text-lg font-bold mb-2">{category || 'Uncategorised'}</h2>

                    <table className="table-auto border-collapse border border-gray-400 w-full">
                        <thead>
                            <tr>
                                <th className="border border-gray-400 px-4 py-2">Order</th>
                                <th className="border border-gray-400 px-4 py-2">English</th>
                                <th className="border border-gray-400 px-4 py-2">French</th>
                                <th className="border border-gray-400 px-4 py-2">German</th>
                                <th className="border border-gray-400 px-4 py-2">Greek</th>
                            </tr>
                        </thead>
                        <tbody ref={(el) => attachSortable(category, el)}>
                            {rows.map((word) => (
                                <tr key={word.id || word._id} className="sortable-row">
                                    <td className="border border-gray-400 px-4 py-2">{word.order_number}</td>
                                    <td className="border border-gray-400 px-4 py-2">{word.ENWord}</td>
                                    <td className="border border-gray-400 px-4 py-2">{word.FRWord}</td>
                                    <td className="border border-gray-400 px-4 py-2">{word.DEWord}</td>
                                    <td className="border border-gray-400 px-4 py-2">{word.GRWord}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}
