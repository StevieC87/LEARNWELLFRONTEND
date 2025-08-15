'use client'

import { useParams } from 'next/navigation';

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import FieldRenderer from '../../pages/[edit]/FieldRenderer';
import { updateSharedFields } from '@/redux/slices/SharedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';


export default function EditSharedComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  //const sharedfields = useSelector((state) => state.SharedSlice.fields);
  const params = useParams();
  const sharedcomponentidis = params.edit
  console.log(sharedcomponentidis, 'sharedcomponentidis')
  const [isneworedit, setIsNewOrEdit] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (sharedcomponentidis === 'newshared') {
      setIsNewOrEdit('new');
    } else {
      setIsNewOrEdit('edit');
    }
  }, [sharedcomponentidis]);
  const sharedcomponentid = params.edit; // assuming your file is [slug]/page.js
  console.log(sharedcomponentid, "slug in EditSharedComponent")
  const searchParams = useSearchParams()
  console.log(searchParams, "searchParams in EditSharedComponent")

  const schemais = searchParams.get('schema')

  const [schemafields, setSchemaFields] = useState(null);
  const [fieldsdata, setFieldsData] = useState(null);

  const fieldsdatafromredux = useSelector((state) => state.SharedSlice.fields);


  function getCsrfToken() {
    if (typeof document !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrfToken='))
        ?.split('=')[1];
    }
    return null; // Return null if running on the server
  }
  const csrfToken = getCsrfToken();
  const [fieldswithdataifany, setFieldsWithDataIfAny] = useState(null);
  useEffect(() => {
    const fetchfields = async () => {
      const schema = searchParams.get('schema')
      const locale = searchParams.get('locale')

      if (!schema || !locale) {
        console.log("Schema and locale are required")
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shared/getschemafields?schema=${schema}&locale=${locale}&sharedcomponentid=${sharedcomponentid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // This is important for cookies to be sent
          }
        )

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        console.log(data, "Fetched Shared Component Fields")

        setSchemaFields(data.schemaFields)
        setFieldsData(data.fieldsdata)
      } catch (error) {
        console.log('Error fetching shared component fields:', error)
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
    const fieldswithdata = []
    const mergedinitial = schemafields.map((fieldObj) => {
      //  const match = fieldsdata.find((item) => item.name === fieldObj.name);
      let fieldObjname = fieldObj.name;
      //console.log(fieldObjname, "fieldObjname in EditSharedComponent")
      let nameinresultsifany = fieldsdata[fieldObjname] || null;
      // console.log(nameinresultsifany, "nameinresultsifany");
      /*   const match = fieldsdata.name === fieldObj.name;
        console.log(match, "match3333333333"); */
      let object;
      // if (nameinresultsifany) {
      console.log('yesmatchyesmatch')
      object = {
        name: fieldObjname || null,
        content: nameinresultsifany || null,
        type: fieldObj.type || null,
        required: fieldObj.required || null,
        placeholder: fieldObj.placeholder || null,
        label: fieldObj.label || fieldObjname || null,

      }

      fieldswithdata.push(object);

      //   }
      //we need the type fo the field 
    }

    );
    setFieldsWithDataIfAny(fieldswithdata);
    console.log(fieldswithdata, "fieldswithdata in EditSharedComponent")

    //, SET THE MERGED FIELDS TO REDUX STORE
    fieldswithdata.forEach((item) => {
      console.log(item, 'mergedinitialitem')
      dispatch(updateSharedFields({
        name: item.name, content: item.content, type: item.type, required: item.required, placeholder: item.placeholder, label: item.label, fields: item.fields
      }));
    }
    );
  }, [schemafields, fieldsdata])

  useEffect(() => {
    console.log(fieldswithdataifany, "fieldswithdataifany")
  }, [fieldswithdataifany])

  const [fieldsdataforsend, setFieldsDataForSend] = useState(null);
  useEffect(() => {
    // we will only keep the name and the contnet
    let fieldswithdataifany2 = Object.values(fieldsdatafromredux).map((field) => {
      return {
        name: field.name,
        content: field.content,
      }
    })
    console.log(fieldswithdataifany2, "fieldswithdataifany2")
    setFieldsDataForSend(fieldswithdataifany2);
  }, [fieldsdatafromredux])

  const onSubmit = async (e) => {
    e.preventDefault();

    // Handle form submission logic here
    console.log('Form submitted with fields:', fieldsdatafromredux);

    const sendtosave = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shared/savesharedcomponent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken, // Include CSRF token in the headers
      },
      body: JSON.stringify({
        sharedcomponentid: sharedcomponentidis,
        fields: fieldsdataforsend,
        schema: schemais,
        locale: searchParams.get('locale') || 'en', // Default to 'en' if locale is not provided
      }),
      credentials: 'include', // This is important for cookies to be sent
    });
    if (!sendtosave.ok) {
      console.log('Failed to save shared component');
      return;
    }
    const data = await sendtosave.json();
    console.log(data, "result from save shared component");
    let isnew = data.wasnewpage;
    let createdpageid = data.sharedcomponentid;
    if (isnew === 'true') {
      //
      router.push(`/dash/shared/${createdpageid}?schema=${schemais}&locale=${searchParams.get('locale') || 'en'}`);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 1500);

    // You can dispatch an action or make an API call here

  }


  return (
    <>
      <div className="flex flex-col gap-4">

        <h1 className="text-2xl font-bold">
          {isneworedit === 'new' ? 'Create' : 'Edit'} Shared Component</h1>
        <p className="text-gray-600">
          This section allows you to edit shared components across your application.
        </p>

        <button className="button button-primary " onClick={onSubmit}>
          {saved ? 'Saved!' : 'Save'}</button>

      </div>
      {fieldswithdataifany && fieldswithdataifany.length > 0 ? (
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold">Fields Data</h2>

          <div className="flex flex-col">

            {fieldswithdataifany.map((field, index) => (

              <FieldRenderer
                key={index}
                name={field.name}
                value={field.content || ''}
                type={field.type}
                required={field.required || ''}
                placeholder={field.placeholder || ''}
                label={field.label || field.name || ''}
                source="shared"
                onChange2={(e) => {

                }}
              />


            ))}
          </div>

        </div>
      ) : (
        <p className="text-red-600">No fields data available for this component.</p>
      )}
    </>
  )
}

{/* <li key={index} className="mb-2">
                <strong>{field.fieldname}:</strong> {field.fieldcontent || 'No data'}
              </li> */}