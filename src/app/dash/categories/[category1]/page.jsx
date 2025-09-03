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
            <Link href={`${category1}/allwords?category1=${encodeURIComponent(category1)}`}>All Category Words</Link>
            {/* Ad ditional content can go here */}
            {subcategories && subcategories.length > 0 ? (

                <div className="flex flex-wrap gap-3">
                    {subcategories.map((s, i) => (
                        <Link href={`${encodeURIComponent(category1)}/${encodeURIComponent(s)}`} key={i}
                            className="basis-80 grow-0">
                            <div className="card h-34 flex items-center justify-center text-center">
                                {s}
                            </div>
                        </Link>
                    ))}
                </div>

            ) : (
                <p>No subcategories available.</p>
            )}

        </div>
    );
}