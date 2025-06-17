'use client'

import { useParams } from 'next/navigation';

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'


export default function EditSharedComponent() {

  const params = useParams();
  const sharedcomponentid = params.edit; // assuming your file is [slug]/page.js
  console.log(sharedcomponentid, "slug in EditSharedComponent")
  const searchParams = useSearchParams()
  console.log(searchParams, "searchParams in EditSharedComponent")

  const [schemafields, setSchemaFields] = useState(null);
  const [fieldsdata, setFieldsData] = useState(null);

  useEffect(() => {
    const fetchfields = async () => {
      const schema = searchParams.get('schema')
      const locale = searchParams.get('locale')

      if (!schema || !locale) {
        console.error("Schema and locale are required")
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shared/getschemafields?schema=${schema}&locale=${locale}&sharedcomponentid=${sharedcomponentid}`)

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        console.log(data, "Fetched Shared Component Fields")

        setSchemaFields(data.schemaFields)
        setFieldsData(data.fieldsdata)
      } catch (error) {
        console.error('Error fetching shared component fields:', error)
      }
    }
    fetchfields()

  }, [])

  useEffect(() => {
    if (!schemafields || !fieldsdata) {
      console.log("Schema fields or fields data not available yet")
      return
    }

    console.log(fieldsdata, "fieldsdata in EditSharedComponent")
    console.log(schemafields, "schemafields in EditSharedComponent")
    const mergedinitial = schemafields.map((fieldObj) => {
      //  const match = fieldsdata.find((item) => item.name === fieldObj.name);
      let fieldObjname = fieldObj.name;
      console.log(fieldObjname, "fieldObjname in EditSharedComponent")
      let nameinresultsifany = fieldsdata[fieldObjname] || null;
      console.log(nameinresultsifany, "nameinresultsifany");
      const match = fieldsdata.name === fieldObj.name;
      console.log(match, "match3333333333");

      //  let createID = new ObjectId().toString();
      // return {
      /* ...fieldObj,
      content: match ? match.content : '',
      id: match ? match._id : null, //createID
      locale: match ? match.locale : languageui || defaultlanguage || null,
      type: fieldObj.type,
      name: fieldObj.name || match?.field || null,
      schema: match ? match.schema : null,
      belongsto: fieldObj.belongsto || pageid || null,
      createdAt: fieldObj.createdAt || null,
      required: fieldObj.required || null,
      placeholder: fieldObj.placeholder || null,
      label: fieldObj.label || match?.label || null, */
      //  fields: fieldObj.fields || null,
      //  pagename: match.pagename,
      //   };
    }
    );
  }, [schemafields, fieldsdata])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Shared Component</h1>
      <p className="text-gray-600">
        This section allows you to edit shared components across your application.
      </p>
      <p className="text-gray-500">
        Please select a shared component to edit from the list.
      </p>
    </div>
  )
}