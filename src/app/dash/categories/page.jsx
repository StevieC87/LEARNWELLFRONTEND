'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import './categories.css'
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
                    setCategories(data)
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
                <Link key={index} href={`./categories/${category.toLowerCase()}`}>
                    <div className="card categorycard" >
                        {/* {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()} */}
                        {category}
                    </div>
                </Link>
            ))}
        </div>
    )
}