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
    const [subsubsubcategories, setSubSubSubCategories] = useState([])
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
            console.log(data, 'data2222');
            setWordsSubCat(data.words);
            setSubCategories(data.subcategories);
            console.log(data.subcategoriesWithCategory3, 'subcategoriesWithCategory3');
            setSubSubCategories(data.subcategoriesWithCategory3)
            setSubSubSubCategories(data.subsubcategories4)
            console.log(data.subsubcategories4, 'subsubcategories4')

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

                            <div key={i} className="  flex flex-col items-start justify-center ">
                                <div className="font-bold">{subcategory}</div>
                                <Link
                                    href={`${encodeURIComponent(category1)}/${encodeURIComponent(subcategory)}`}
                                    key={i}
                                    className="grow-0"
                                > </Link>
                                {matchedSubcategory && matchedSubcategory.category3.length > 0 ? (
                                    <ul className="mt-2 ml-10">
                                        {matchedSubcategory.category3.map((subsubcategory, index) => {
                                            // Find the matching subsubcategory in subsubsubcategories
                                            const matchedSubsubcategory = subsubsubcategories.find(
                                                (item) => item.category3 === subsubcategory
                                            );

                                            return (
                                                <div className="yes" key={index}>
                                                    <li className="text-gray-600">
                                                        <Link href={`${category1}/${encodeURIComponent(subcategory)}/${encodeURIComponent(subsubcategory)}`}>
                                                            {subsubcategory}
                                                        </Link>
                                                        {matchedSubsubcategory && matchedSubsubcategory.category4.length > 0 ? (
                                                            <ul className="mt-2 ml-10">
                                                                {matchedSubsubcategory.category4
                                                                    .filter((subsubsubcategory) => subsubsubcategory && subsubsubcategory !== '\\N') // Filter out invalid values
                                                                    .map((subsubsubcategory, idx) => (
                                                                        <li key={idx} className="text-gray-600">
                                                                            <Link href={`${category1}/${encodeURIComponent(subcategory)}/${encodeURIComponent(subsubcategory)}/${encodeURIComponent(subsubsubcategory)}`}>
                                                                                {subsubsubcategory}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-gray-500 text-xs mt-2">No category4 available</p>
                                                        )}
                                                    </li>
                                                </div>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-xs mt-2">No category3 available</p>
                                )}
                            </div>

                        );
                    })}
                </div>
            ) : (
                <p>No subcategories available.</p>
            )
            }

        </div >
    );
}