'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import '../categories.css'

export default function Category1() {
    const { category1 } = useParams();
    const category1urlencode = encodeURIComponent(category1);
    const [wordssubcat, setWordsSubCat] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [subsubcategories, setSubSubCategories] = useState([]);
    const [subsubsubcategories, setSubSubSubCategories] = useState([]);

    // Persistence key (scoped to this page + category1)
    const storageKey = (cat) => `accordionState:${cat}`;

    // Replace previous openCategories state & effects with a single controlled block
    const [openCategories, setOpenCategories] = useState({});
    const restoredRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Restore only once per category change
        restoredRef.current = false;
        try {
            const saved = localStorage.getItem(storageKey(category1));
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    setOpenCategories(parsed);
                    restoredRef.current = true;
                }
            }
        } catch { /* ignore corrupt */ }
    }, [category1]);

    const persist = (next) => {
        try { localStorage.setItem(storageKey(category1), JSON.stringify(next)); } catch { /* quota ignore */ }
    };

    const toggleAccordion = (key) => {
        setOpenCategories(prev => {
            const updated = { ...prev, [key]: !prev[key] };
            persist(updated);
            return updated;
        });
    };

    // Optional helper (e.g. attach to a debug button) to reset stored state
    const resetOpenState = () => {
        setOpenCategories({});
        try { localStorage.removeItem(storageKey(category1)); } catch { /* ignore */ }
    };

    useEffect(() => {
        const fetchspecificcat = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subgetcategories1?category1=${category1urlencode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response) {
                console.log('nowork');
            }
            const data = await response.json();
            setWordsSubCat(data.words);
            setSubCategories(data.subcategories);
            console.log(data.subcategories, 'data.subcategories');
            setSubSubCategories(data.subcategoriesWithCategory3);
            console.log(data.subcategoriesWithCategory3, 'data.subcategoriesWithCategory3');
            setSubSubSubCategories(data.subsubcategories4);
            console.log(data.subsubcategories4, 'data.subsubcategories4');
        };
        fetchspecificcat();
    }, [category1]);

    // Helpers to build stable keys (avoid index-based collisions)
    const subKey = (c2) => `c2:${c2}`;
    const c3Key = (c2, c3) => `c3:${c2}::${c3}`;

    // Utility: does a given (Category2, Category3) have any Category4 children?
    const hasC4Children = (c2, c3) =>
        subsubsubcategories.some(
            (item) =>
                item.category2 === c2 &&
                item.category3 === c3 &&
                item.category4 &&
                item.category4.filter(v => v && v !== '\\N').length > 0
        );

    return (
        <div>
            <h1>Category: {category1}</h1>
            <Link href={`${category1}/allwords?category1=${encodeURIComponent(category1)}`}>All Category Words</Link>
            {subcategories && subcategories.length > 0 ? (
                <div className="flex flex-col flex-wrap items-start">
                    {subcategories.map((subcategory) => {
                        const matchedSubcategory = subsubcategories.find(
                            (item) => item.subcategory === subcategory
                        );
                        const subcategoryKey = subKey(subcategory);
                        const category3List = matchedSubcategory
                            ? matchedSubcategory.category3.filter(
                                (c3) => c3 && c3 !== '\\N' && matchedSubcategory.category3.length > 1
                            )
                            : [];

                        return (
                            <div key={subcategory} className="flex flex-col items-start justify-center">
                                <div className="flex items-center">
                                    {category3List.length > 0 ? (
                                        <button
                                            className="mr-2"
                                            onClick={() => toggleAccordion(subcategoryKey)}
                                        >
                                            {openCategories[subcategoryKey] ? '▼' : '▶'}
                                        </button>
                                    ) : (
                                        <div className="mr-2 w-4 h-4 rounded-full bg-black"></div>
                                    )}
                                    <Link
                                        href={`${encodeURIComponent(category1)}/${encodeURIComponent(subcategory)}`}
                                        className="font-bold"
                                    >
                                        {subcategory}
                                    </Link>
                                </div>

                                {openCategories[subcategoryKey] && category3List.length > 0 && (
                                    <ul className="mt-2 ml-10">
                                        {category3List.map((subsubcategory) => {
                                            const subsubcategoryKey = c3Key(subcategory, subsubcategory);

                                            // Find the exact (Category2, Category3) node
                                            const matchedSubsubcategory = subsubsubcategories.find(
                                                (item) =>
                                                    item.category2 === subcategory &&
                                                    item.category3 === subsubcategory
                                            );

                                            const rawC4 = matchedSubsubcategory ? matchedSubsubcategory.category4 : [];
                                            const c4List = rawC4 && rawC4.length > 1
                                                ? rawC4.filter(
                                                    (c4) => c4 && c4 !== '\\N'
                                                )
                                                : [];

                                            const showC4Toggle = c4List.length > 0;

                                            return (
                                                <li key={subsubcategoryKey} className="mb-1">
                                                    <div className="flex items-center">
                                                        {showC4Toggle ? (
                                                            <button
                                                                className="mr-2"
                                                                onClick={() => toggleAccordion(subsubcategoryKey)}
                                                            >
                                                                {openCategories[subsubcategoryKey] ? '▼' : '▶'}
                                                            </button>
                                                        ) : (
                                                            <div className="mr-2 w-4 h-4 rounded-full bg-black"></div>
                                                        )}
                                                        <Link
                                                            href={`${category1}/${encodeURIComponent(subcategory)}/${encodeURIComponent(subsubcategory)}`}
                                                            className="text-gray-600"
                                                        >
                                                            {subsubcategory}
                                                        </Link>
                                                    </div>

                                                    {showC4Toggle &&
                                                        openCategories[subsubcategoryKey] &&
                                                        c4List.length > 0 && (
                                                            <ul className="mt-2 ml-10">
                                                                {c4List.map((subsubsubcategory, idx) => (
                                                                    <li key={`${subsubcategoryKey}-c4-${idx}`} className="text-gray-600">
                                                                        <Link
                                                                            href={`${category1}/${encodeURIComponent(subcategory)}/${encodeURIComponent(subsubcategory)}/${encodeURIComponent(subsubsubcategory)}`}
                                                                        >
                                                                            {subsubsubcategory}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>No subcategories available.</p>
            )}
        </div>
    );
}
