'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Sortable from 'sortablejs';
import { useParams } from 'next/navigation';
import '../../../categories.css';
import WordsTable from '../../../wordsshowsubsubtable'

export default function SubSubCategory() {
    const { category1, subcategory, subsubcategory } = useParams();
    console.log(subsubcategory, 'subsubcategorysubsubcategorysubsubcategory');
    const [groupedWords, setGroupedWords] = useState({});
    const tableRefs = useRef({});
    const sortablesRef = useRef({});
    useEffect(() => {
        const fetchspecificcategories = async () => {
            const subcategoryURLENCODE = encodeURIComponent(subcategory);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/fetchspecificsubcats?category1=${category1}&subcategory=${subcategoryURLENCODE}&subsubcategory=${subsubcategory}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );
            const data = await res.json();


            console.log(data.querysubcategorywords, 'dataquerysubcategories111aa');
            /*   let splitgrouppedcomma = data.querysubcategorywords.split(',');
              console.log(splitgrouppedcomma, 'splitgrouppedcomma'); */
            //setGroupedWords(data.querysubcategorywords);
            setGroupedWords(data.querysubcategorywords);
        };
        fetchspecificcategories();
    }, [category1, subcategory]);

    return (
        <>

            {groupedWords && groupedWords.length > 0 && groupedWords.map((category) => (
                <div key={category} className="mb-6">


                    {category !== '\\N' && (
                        <h2 className="text-lg font-bold mb-2">
                            {category || 'Uncategorised'}</h2>
                    )}

                    <WordsTable category1={category1} subcategory={subcategory} subsubcategory={subsubcategory} subsubsubcategory={category}></WordsTable>
                </div>
            ))}
        </>
        /*  <WordsTable category1={category1} subcategory={subcategory} subsubcategory={subsubcategory}></WordsTable> */
    )

}
