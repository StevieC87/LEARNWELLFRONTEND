'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';

export default function ShowAllCategorywords() {
    const category1 = useParams().category1;
    const [wordsarray, setWordsArray] = useState([])

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
            setWordsArray(data.querysubcategorywords);
        }
        fetchWords();
    }, [category1])

    return (
        <div>
            {wordsarray && wordsarray.length > 0 ? (

                <div className="flex flex-wrap flex-2 gap-3">
                    {wordsarray.map((word, index) => (
                        <>
                            <div className="card" key={index}>
                                <p>{word.Englishword}</p>
                                <p>{word.Frenchword}</p>
                                <p>{word.Germanword}</p>
                            </div>
                        </>
                    ))}
                </div>
            ) : (
                <p>Nos subcategories available.</p>
            )}
        </div>
    )
}