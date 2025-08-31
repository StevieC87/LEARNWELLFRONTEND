'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import '../categories.css'
export default function Category1() {
    const { category1 } = useParams();
    const [wordssubcat, setWordsSubCat] = useState([])
    const [subcategories, setSubCategories] = useState([])

    useEffect(() => {
        const fetchspecificcat = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subgetcategories1?category1=${category1}`, {
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
        }
        fetchspecificcat();
    }, [category1])

    return (
        <div>
            <h1>Category: {category1}</h1>
            <Link href={`${category1}/allwords?category1=${category1}`}>All Category Words</Link>
            {/* Ad ditional content can go here */}
            {subcategories && subcategories.length > 0 ? (

                <div className="flex flex-wrap flex-2 gap-3">
                    {subcategories.map((subcategory, index) => (
                        <div className="card" key={index}>{subcategory}</div>
                    ))}
                </div>
            ) : (
                <p>No subcategories available.</p>
            )}

        </div>
    );
}