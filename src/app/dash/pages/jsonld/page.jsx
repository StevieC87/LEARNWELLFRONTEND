'use client';
import { use, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import FieldRendererJSONLD from './FieldRendererJSONLD';
import { updateBlocksAndFields } from '@/redux/slices/JSONLDSlice';
import { useDispatch, useSelector } from 'react-redux';


export default function JsonLDPage() {
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const pageid = searchParams.get('pageid');
  const schema = searchParams.get('schema');
  const pagetype = searchParams.get('pagetype');
  const language = searchParams.get('language');


  const [schemablocks, setSchemaBlocks] = useState([]);
  // const [formValues, setFormValues] = useState({});
  console.log(pageid, schema, pagetype, language, "search params");


  useEffect(() => {
    const getjsonldschema = async () => {
      const response = await fetch(`http://localhost:3000/getjsonldschema?schema=${schema}`, {
        method: "GET",
        credentials: 'include', // Include cookies in the request
      });
      if (!response.ok) {
        console.log("Response not ok");
        console.log(response, "response");
      }
      else if (response.ok) {
        const data = await response.json();
        console.log(data, "data")
        setSchemaBlocks(data.schema.jsonldblocks);
        let schemablocks = data.schema.jsonldblocks;
        dispatch(updateBlocksAndFields({

          schemablocks



        }));
      }
    }

    /*  pageid,
              schema,
              pagetype, */
    getjsonldschema();
  }, []);


  useEffect(() => {
    console.log('schemablocks', schemablocks);


  }, [schemablocks]);



  return (

    <div className="jsonld-page">
      <h1 className="text-2xl font-bold mb-4">JSON-LD Configuration</h1>

      {schemablocks.length > 0 && schemablocks.map((block, index) => (
        <div key={index} className="jsonld-block">
          <h2 className="text-xl font-semibold mb-2">{block.name}</h2>
          <div className="jsonld-fields">
            {Array.isArray(block.fields) && block.fields.length > 0 && block.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="jsonld-field">
                <FieldRendererJSONLD
                  type={field.type}
                  name={field.name}
                  // value={formValues[block.name]?.fields?.[field.name] || field.value || ""}
                  label={field.label}
                  placeholder={field.placeholder || ""}
                  parentblock={block.name}
                />
              </div>
            ))}
          </div>
        </div>
      ))}



    </div>
  )
}
