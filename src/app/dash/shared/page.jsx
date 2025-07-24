'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
export default function Shared() {

  const [missingSchemas, setMissingSchemas] = useState([]);
  const [existingSchemas, setExistingSchemas] = useState([]);

  useEffect(() => {
    let datais;
    const fetchSharedSchemas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shared/getschemas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // This is important for cookies to be sent
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data, "Shared Schemas Data");
        setMissingSchemas(data.schemaswithoutdbrecord);
        setExistingSchemas(data.schemaswithdbrecord);
      } catch (error) {
        console.log('Error fetching shared schemas:', error);
      }
    };

    fetchSharedSchemas();

    console.log()

  }, []);


  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Shared Components</h1>
      <p className="text-gray-600">
        This section allows you to manage components that can appear across your application.
      </p>
      {missingSchemas.map((schema) => (
        <div key={`${schema.schema}${schema.locale}`} className="p-4 border rounded shadow">
          <Link href={`/dash/shared/newshared?schema=${schema.schema}&locale=${schema.locale}`} className="text-green-600 hover:underline">
            Create {/* {schema.schema} */}
          </Link>
          <h2 className="text-xl font-semibold">{schema.schema}</h2>
          <p className="text-gray-500">Locale: {schema.locale}</p>
          {/* <p className="text-red-600">This schema is missing in the database.</p> */}
        </div>

      ))}

      {existingSchemas.map((schema) => (
        <div key={schema.id} className="p-4 border rounded shadow">
          <Link href={`/dash/shared/${schema.id}?schema=${schema.schema}&locale=${schema.locale}`} className="text-blue-600 hover:underline">
            Edit
          </Link>
          <h2 className="text-xl font-semibold">{schema.schema}</h2>
          <p className="text-gray-500">Locale: {schema.locale}</p>
          {/*  <p className="text-gray-700">ID: {schema.id}</p> */}
        </div>
      ))}

    </div>
  );
}