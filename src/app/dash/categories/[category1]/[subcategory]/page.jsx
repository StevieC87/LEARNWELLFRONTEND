'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import '../../categories.css'
export default function Category1() {
    const { category1, subcategory } = useParams();
    const [wordssubcat, setWordsSubCat] = useState([])
    const [subcategories, setSubCategories] = useState([])
    const [subcategorydecoded, setSubcategorydecoded] = useState(decodeURIComponent(subcategory));
    const [words, setWords] = useState([]);
    const [languages, setLanguages] = useState(['ENWord', 'FRWord', 'DEWord', 'GRWord']);
    const [visibleLanguages, setVisibleLanguages] = useState({
        ENWord: true,
        FRWord: true,
        DEWord: true,
        GRWord: true,
    });

    const toggleLanguageVisibility = (language) => {
        setVisibleLanguages(prev => ({
            ...prev,
            [language]: !prev[language],
        }));
    };

    useEffect(() => {
        const fetchspecificcatwords = async () => {
            const subcategoryURLENCODE = encodeURIComponent(subcategory);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetchspecificcatwords?category1=${category1}&subcategory=${subcategoryURLENCODE}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.log('nowork');
            }
            const data = await response.json();
            console.log(data, 'data');
            setWords(data.querysubcategorywords);
            //   setWordsSubCat(data.words);
            //   setSubCategories(data.subcategories);
        }
        fetchspecificcatwords();
    }, [category1])

    return (
        <div>
            <h1>{category1} </h1>
            <h2 className="text-2xl font-bold mb-4">{subcategorydecoded}</h2>
            <div className="mb-4">
                <label className="mr-4">
                    <input
                        type="checkbox"
                        checked={visibleLanguages.ENWord}
                        onChange={() => toggleLanguageVisibility('ENWord')}
                    />
                    English
                </label>
                <label className="mr-4">
                    <input
                        type="checkbox"
                        checked={visibleLanguages.FRWord}
                        onChange={() => toggleLanguageVisibility('FRWord')}
                    />
                    French
                </label>
                <label className="mr-4">
                    <input
                        type="checkbox"
                        checked={visibleLanguages.DEWord}
                        onChange={() => toggleLanguageVisibility('DEWord')}
                    />
                    German
                </label>
                <label className="mr-4">
                    <input
                        type="checkbox"
                        checked={visibleLanguages.GRWord}
                        onChange={() => toggleLanguageVisibility('GRWord')}
                    />
                    Greek
                </label>
            </div>
            <div className="mb-6">
                {words && words.length === 0 && (
                    <p>No words found for this subcategory.</p>
                )}
                {words && words.length > 0 && (
                    <table className="table-auto border-collapse border border-gray-400 w-full">
                        <thead>
                            <tr>
                                {visibleLanguages.ENWord && <th className="border border-gray-400 px-4 py-2">English</th>}
                                {visibleLanguages.FRWord && <th className="border border-gray-400 px-4 py-2">French</th>}
                                {visibleLanguages.DEWord && <th className="border border-gray-400 px-4 py-2">German</th>}
                                {visibleLanguages.GRWord && <th className="border border-gray-400 px-4 py-2">Greek</th>}
                                <th className="border border-gray-400 px-4 py-2">Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {words.map((word, index) => (
                                <tr key={index}>
                                    {visibleLanguages.ENWord && <td className="border border-gray-400 px-4 py-2">{word.ENWord}</td>}
                                    {visibleLanguages.FRWord && <td className="border border-gray-400 px-4 py-2">{word.FRWord}</td>}
                                    {visibleLanguages.DEWord && <td className="border border-gray-400 px-4 py-2">{word.DEWord}</td>}
                                    {visibleLanguages.GRWord && <td className="border border-gray-400 px-4 py-2">{word.GRWord}</td>}
                                    {visibleLanguages.GRWord && <td className="border border-gray-400 px-4 py-2">
                                        {(word.Category3 && word.Category3 !== '\\N' && word.Category3.trim().length > 0) && (
                                            word.Category3
                                        )}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}