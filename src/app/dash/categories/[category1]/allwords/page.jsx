'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';

export default function ShowAllCategorywords() {
    const category1 = useParams().category1;
    const [groupedWords, setGroupedWords] = useState({});

    useEffect(() => {
        const fetchWords = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getallcategory1words?category1=${category1}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response) {
                console.log('nowork');
            }
            const data = await response.json();
            console.log(data, 'data');

            // Group words by Category2
            const grouped = data.querysubcategorywords.reduce((acc, word) => {
                const category = word.Category2 || 'Uncategorized';
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(word);
                return acc;
            }, {});

            setGroupedWords(grouped);
        };
        fetchWords();
    }, [category1]);

    return (
        <div>
            {Object.keys(groupedWords).length > 0 ? (
                Object.entries(groupedWords).map(([category, words]) => (
                    <div key={category} className="mb-6">
                        <h2 className="text-lg font-bold mb-2">{category}</h2>
                        <table className="table-auto border-collapse border border-gray-400 w-full">
                            <thead>
                                <tr>
                                    <th className="border border-gray-400 px-4 py-2">English</th>
                                    <th className="border border-gray-400 px-4 py-2">French</th>
                                    <th className="border border-gray-400 px-4 py-2">German</th>
                                    <th className="border border-gray-400 px-4 py-2">Greek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {words.map((word, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-400 px-4 py-2">{word.ENWord}</td>
                                        <td className="border border-gray-400 px-4 py-2">{word.FRWord}</td>
                                        <td className="border border-gray-400 px-4 py-2">{word.DEWord}</td>
                                        <td className="border border-gray-400 px-4 py-2">{word.GRWord}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>No subcategories available.</p>
            )}
        </div>
    );
}