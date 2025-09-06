'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import '../categories.css'
export default function Category1() {
    const { category1 } = useParams();
    const category1urlencode = encodeURIComponent(category1);
    const [wordssubcat, setWordsSubCat] = useState([])
    const [subcategories, setSubCategories] = useState([])
    const [subsubcategories, setSubSubCategories] = useState([])
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
            console.log(data, 'data');
            setWordsSubCat(data.words);
            setSubCategories(data.subcategories);
            console.log(data.subcategoriesWithCategory3, 'subcategoriesWithCategory3');
            setSubSubCategories(data.subcategoriesWithCategory3)
        }
        fetchspecificcat();
    }, [category1])

    return (
        <div>
            <h1>Category: {category1}</h1>
            <Link href={`${category1}/allwords?category1=${encodeURIComponent(category1)}`}>All Category Words</Link>
            {/* Ad ditional content can go here */}
            {subcategories && subcategories.length > 0 ? (
                <div className="flex flex-col flex-wrap items-start">
                    {subcategories.map((subcategory, i) => {
                        // Find the matching category3 array for the current subcategory
                        const matchedSubcategory = subsubcategories.find(
                            (item) => item.subcategory === subcategory
                        );

                        return (
                            <Link
                                href={`${encodeURIComponent(category1)}/${encodeURIComponent(subcategory)}`}
                                key={i}
                                className="grow-0"
                            >
                                <div className="  flex flex-col items-start justify-center ">
                                    <div className="font-bold">{subcategory}</div>
                                    {matchedSubcategory && matchedSubcategory.category3.length > 0 ? (
                                        <ul className="mt-2 ml-10">
                                            {matchedSubcategory.category3.map((subsubcategory, index) => (

                                                <Link href={`${category1}/${encodeURIComponent(subcategory)}/${encodeURIComponent(subsubcategory)}`}>
                                                    <li key={index} className="text-gray-600">
                                                        {subsubcategory}
                                                    </li>
                                                </Link>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-xs mt-2">No category3 available</p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <p>No subcategories available.</p>
            )}

        </div>
    );
}