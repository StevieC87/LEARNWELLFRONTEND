'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Sortable from 'sortablejs';
import { useParams } from 'next/navigation';
import './categories.css';

export default function WordsTable(props) {
    const { category1 = '', subcategory = '', subsubcategory = '', subsubsubcategory = '', subsubsubsubcategory = '' } = props;
    console.log(props, 'props');
    console.log(category1, 'categories11');
    console.log(subcategory, 'subcategory11');
    console.log(subsubcategory, 'subsubcategory11');
    console.log(subsubsubcategory, 'subsubsubcategory11');
    console.log(subsubsubsubcategory, 'subsubsubsubcategory11');
    const [groupedWords, setGroupedWords] = useState({});
    const [words, SetWords] = useState([])
    const tableRef = useRef(null); // Single table reference
    const sortableRef = useRef(null); // Single Sortable instance

    // Fetch data
    useEffect(() => {
        const fetchspecificsubcatwords = async () => {
            const subcategoryURLENCODE = encodeURIComponent(subcategory);
            const subsubcategoryURLENCODE = encodeURIComponent(subsubcategory);
            const subsubsubcategoryURLENCODE = encodeURIComponent(subsubsubcategory);
            const subsubsubsubcategoryURLENCODE = encodeURIComponent(subsubsubsubcategory);


            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/fetchspecificwords?category1=${category1}&subcategory=${subcategoryURLENCODE}&subsubcategory=${subsubcategoryURLENCODE}&subsubsubcategory=${subsubsubcategoryURLENCODE}&subsubsubsubcategory=${subsubsubsubcategoryURLENCODE}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );
            const data = await res.json();
            console.log(data, 'data111');
            SetWords(data.querysubcategorywords)

            setGroupedWords(data.querysubcategorywords);
            console.log(data.querysubcategorywords, 'querysubcategorywords');
        };
        fetchspecificsubcatwords();
    }, [category1, subcategory]);

    // Drag-end handler for the entire table
    const handleDragEnd = useCallback((evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;

        setGroupedWords(prev => {
            const current = [...prev];
            const [moved] = current.splice(oldIndex, 1);
            current.splice(newIndex, 0, moved);
            const updated = current.map((w, i) => ({ ...w, order_number: i + 1 }));
            updateOrderInBackend(updated);
            return updated;
        });
    }, []);

    // Attach Sortable to the table
    useEffect(() => {
        if (tableRef.current) {
            sortableRef.current = Sortable.create(tableRef.current, {
                animation: 150,
                draggable: 'tr.sortable-row',
                onEnd: handleDragEnd,
                axis: 'y', // Restrict sorting to vertical movement
                handle: '.sortable-row', // Optional: Add a handle for dragging
            });
        }

        return () => {
            sortableRef.current?.destroy();
            sortableRef.current = null;
        };
    }, [handleDragEnd]);

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


            {subsubcategory && <h3 className="text-xl font-bold mb-4">{decodeURIComponent(subsubcategory)}</h3>}
            {subsubsubsubcategory && <h3 className="text-xl font-bold mb-4">{decodeURIComponent(subsubsubsubcategory)}</h3>}
            <table className="table-auto border-collapse border border-gray-400 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-400 px-4 py-2">Order</th>
                        <th className="border border-gray-400 px-4 py-2">English</th>
                        <th className="border border-gray-400 px-4 py-2">French</th>
                        <th className="border border-gray-400 px-4 py-2">German</th>
                        <th className="border border-gray-400 px-4 py-2">Greek</th>
                        <th className="border border-gray-400 px-4 py-2">Cat1</th>
                        <th className="border border-gray-400 px-4 py-2">Cat2</th>
                        <th className="border border-gray-400 px-4 py-2">Cat3</th>
                        <th className="border border-gray-400 px-4 py-2">Cat4</th>

                    </tr>
                </thead>

                <tbody ref={tableRef}>
                    {words && words.length > 0 && words.map((word, index) => (
                        <tr key={word.id || word._id} className="sortable-row">
                            <td className="border border-gray-400 px-4 py-2">{word.order_number}</td>
                            <td className="border border-gray-400 px-4 py-2">{word.ENWord}</td>
                            <td className="border border-gray-400 px-4 py-2">{word.FRWord}</td>
                            <td className="border border-gray-400 px-4 py-2">{word.DEWord}</td>
                            <td className="border border-gray-400 px-4 py-2">{word.GRWord}</td>
                            <td className="border border-gray-400 px-4 py-2">{word.Category1}</td>
                            <td className="border border-gray-400 px-4 py-2">{word.Category2}</td>
                            <td className="border border-gray-400 px-4 py-2">{word.Category3}</td>
                            <td className="border border-gray-400 px-4 py-2">{word.Category4}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
