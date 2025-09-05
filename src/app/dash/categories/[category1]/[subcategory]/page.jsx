'use client';
import { useEffect, useState, useRef } from 'react';
import Sortable from 'sortablejs';
import { useParams } from 'next/navigation';
import '../../categories.css';

export default function Category1() {
    const { category1, subcategory } = useParams();
    const [words, setWords] = useState([]);
    const [groupedWords, setGroupedWords] = useState({});
    const tableRefs = useRef({}); // Store refs for each group

    useEffect(() => {
        const fetchspecificcatwords = async () => {
            const subcategoryURLENCODE = encodeURIComponent(subcategory);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetchspecificcatwords?category1=${category1}&subcategory=${subcategoryURLENCODE}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setWords(data.querysubcategorywords);

            // Group words by Category3
            const grouped = data.querysubcategorywords.reduce((acc, word) => {
                const category = (word.Category3 && word.Category3 !== '\\N') ? word.Category3 : '';
                if (!acc[category]) acc[category] = [];
                acc[category].push(word);
                return acc;
            }, {});
            setGroupedWords(grouped);
        };
        fetchspecificcatwords();
    }, [category1]);

    // Initialize SortableJS for each group
    useEffect(() => {
        Object.keys(groupedWords).forEach((category) => {
            if (tableRefs.current[category]) {
                Sortable.create(tableRefs.current[category], {
                    animation: 150,
                    onEnd: (evt) => handleDragEnd(evt, category),
                });
            }
        });
    }, [groupedWords]);

    const handleDragEnd = (evt, category) => {
        const newOrder = [...groupedWords[category]];
        const [movedItem] = newOrder.splice(evt.oldIndex, 1); // Remove the dragged item
        newOrder.splice(evt.newIndex, 0, movedItem); // Insert it at the new position

        // Update order_number based on new positions
        const updatedWords = newOrder.map((word, index) => ({
            ...word,
            order_number: index + 1, // Assign new order_number
        }));

        // Update state
        setGroupedWords((prev) => ({
            ...prev,
            [category]: updatedWords,
        }));

        // Send updated order to the backend
        updateOrderInBackend(updatedWords);
    };

    const updateOrderInBackend = async (updatedWords) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            {Object.entries(groupedWords).map(([category, words]) => (
                <div key={category} className="mb-6">
                    <h2 className="text-lg font-bold mb-2">{category || 'Uncategorized'}</h2>
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
                        <tbody ref={(el) => (tableRefs.current[category] = el)}>
                            {words.map((word, index) => (
                                <tr key={word.id}>
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