'use client'
import { useEffect, useState } from 'react'
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
    const [openCategories, setOpenCategories] = useState({}); // State to manage accordion

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
            setSubSubCategories(data.subcategoriesWithCategory3);
            setSubSubSubCategories(data.subsubcategories4);
        };
        fetchspecificcat();
    }, [category1]);

    const toggleAccordion = (key) => {
        setOpenCategories((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div>
            <h1>Category: {category1}</h1>
            <Link href={`${category1}/allwords?category1=${encodeURIComponent(category1)}`}>All Category Words</Link>
            {subcategories && subcategories.length > 0 ? (
                <div className="flex flex-col flex-wrap items-start">
                    {subcategories.map((subcategory, i) => {
                        const matchedSubcategory = subsubcategories.find(
                            (item) => item.subcategory === subcategory
                        );
                        const subcategoryKey = `subcategory-${i}`;
                        return (
                            <div key={i} className="flex flex-col items-start justify-center">
                                <div className="flex items-center">
                                    {matchedSubcategory && matchedSubcategory.category3.length > 1 ? (
                                        <button
                                            className="mr-2"
                                            onClick={() => toggleAccordion(subcategoryKey)}
                                        >
                                            {openCategories[subcategoryKey] ? '▼' : '▶'}
                                        </button>
                                    ) : (
                                        <div className="mr-2 w-4 h-4 rounded-full bg-black"></div> // Circle placeholder
                                    )}
                                    <Link
                                        href={`${encodeURIComponent(category1)}/${encodeURIComponent(subcategory)}`}
                                        className="font-bold"
                                    >
                                        {subcategory}
                                    </Link>
                                </div>
                                {openCategories[subcategoryKey] && (
                                    <>
                                        {matchedSubcategory && matchedSubcategory.category3.length > 0 ? (
                                            <ul className="mt-2 ml-10">
                                                {matchedSubcategory.category3
                                                    .filter(
                                                        (subsubcategory) =>
                                                            subsubcategory &&
                                                            subsubcategory !== '\\N' &&
                                                            matchedSubcategory.category3.length > 1
                                                    )
                                                    .map((subsubcategory, index) => {
                                                        const matchedSubsubcategory = subsubsubcategories.find(
                                                            (item) => item.category3 === subsubcategory
                                                        );
                                                        const subsubcategoryKey = `${subcategoryKey}-subsubcategory-${index}`;
                                                        return (
                                                            <div key={index}>
                                                                <div className="flex items-center">
                                                                    {matchedSubsubcategory && matchedSubsubcategory.category4.length > 1 ? (
                                                                        <button
                                                                            className="mr-2"
                                                                            onClick={() => toggleAccordion(subsubcategoryKey)}
                                                                        >
                                                                            {openCategories[subsubcategoryKey] ? '▼' : '▶'}
                                                                        </button>
                                                                    ) : (
                                                                        <div className="mr-2 w-4 h-4 rounded-full bg-black"></div> // Circle placeholder
                                                                    )}
                                                                    <Link
                                                                        href={`${category1}/${encodeURIComponent(subcategory)}/${encodeURIComponent(subsubcategory)}`}
                                                                        className="text-gray-600"
                                                                    >
                                                                        {subsubcategory}
                                                                    </Link>
                                                                </div>
                                                                {openCategories[subsubcategoryKey] && matchedSubsubcategory && matchedSubsubcategory.category4.length > 0 && (
                                                                    <ul className="mt-2 ml-10">
                                                                        {matchedSubsubcategory.category4
                                                                            .filter(
                                                                                (subsubsubcategory) =>
                                                                                    subsubsubcategory &&
                                                                                    subsubsubcategory !== '\\N' &&
                                                                                    matchedSubsubcategory.category4.length > 1
                                                                            )
                                                                            .map((subsubsubcategory, idx) => (
                                                                                <li key={idx} className="text-gray-600">
                                                                                    <Link href={`${category1}/${encodeURIComponent(subcategory)}/${encodeURIComponent(subsubcategory)}/${encodeURIComponent(subsubsubcategory)}`}>
                                                                                        {subsubsubcategory}
                                                                                    </Link>
                                                                                </li>
                                                                            ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 text-xs mt-2">No category3 available</p>
                                        )}
                                    </>
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
