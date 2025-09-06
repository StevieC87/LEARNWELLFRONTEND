'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Sortable from 'sortablejs';
import { useParams } from 'next/navigation';
import '../../categories.css';
import WordsTable from '../../wordsshowsubsubtable';

export default function Category1() {
    const { category1, subcategory } = useParams();
    const [groupedWords, setGroupedWords] = useState([])

    const tableRefs = useRef({});
    const sortablesRef = useRef({});

    // Fetch data

    useEffect(() => {

        const fetchspecificcatwords = async () => {
            const subcategoryURLENCODE = encodeURIComponent(subcategory);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/fetchspecificsubcats?category1=${category1}&subcategory=${subcategoryURLENCODE}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );
            const data = await res.json();

            /* const grouped = data.querysubcategorywords.reduce((acc, word) => {
                const key = word.Category3 && word.Category3 !== '\\N' ? word.Category3 : '';
                if (!acc[key]) acc[key] = [];
                acc[key].push(word);
                return acc;
            }, {}); */
            //  console.log(grouped, 'grouped');
            console.log(data.querysubcategorywords, 'dataquerysubcategorywords');
            setGroupedWords(data.querysubcategorywords);
        };
        fetchspecificcatwords();
    }, [category1, subcategory]);

    return (
        <div>
            <h1>{category1}</h1>
            aaa
            <h2 className="text-2xl font-bold mb-4">{decodeURIComponent(subcategory)}</h2>

            {groupedWords.map((category) => (
                <div key={category} className="mb-6">
                    {/*   <h2 className="text-lg font-bold mb-2">{category || 'Uncategorised'}</h2> */}
                    <WordsTable category1={category1} subcategory={subcategory} subsubcategory={category}></WordsTable>
                </div>
            ))}
        </div>
    );
}
