'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import './categories.css'
import { parentCategoriesOrder } from './categories.js'

export default function Categories() {
    const [categories1, setCategories] = useState([])
    useEffect(() => {
        const functionfetchcategory1 = async () => {
            try {
                let fetchcategories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getcategories1?category1=${categories1}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (!fetchcategories) {
                    console.log('nofetch');
                }
                const data = await fetchcategories.json();
                if (data) {
                    console.log(data, 'data');
                    const sortedSubcategories = data.sort((a, b) => {
                        const orderA = parentCategoriesOrder.indexOf(a);
                        console.log(orderA, 'ordera');
                        const orderB = parentCategoriesOrder.indexOf(b);
                        console.log(orderB, 'orderb');

                        // If a category is not in the order array, place it at the end
                        const rankA = orderA === -1 ? Infinity : orderA;
                        const rankB = orderB === -1 ? Infinity : orderB;

                        return rankA - rankB;
                    });
                    setCategories(sortedSubcategories)
                }
                console.log(data, 'fetched categories');
            }
            catch (error) {
                console.log(error, 'error');
            }


        }
        functionfetchcategory1()

    }, [])

    return (
        <div>
            {categories1.map((category, index) => (
                <Link key={index} href={`./categories/${encodeURIComponent(category)}`}>
                    <div className="card categorycard" >
                        {/* {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()} */}
                        {category}
                    </div>
                </Link>
            ))}
        </div>
    )
}