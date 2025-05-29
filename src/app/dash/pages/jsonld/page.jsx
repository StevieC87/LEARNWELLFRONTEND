'use client';
import { useRef, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import FieldRendererJSONLD from './FieldRendererJSONLD';
import { updateBlocksAndFields, cleanBlocksandFields } from '@/redux/slices/JSONLDSlice';
import { useDispatch, useSelector } from 'react-redux';


export default function JsonLDPage() {
  const dispatch = useDispatch();
  const effectRan = useRef(false);

  const searchParams = useSearchParams();
  const pageid = searchParams.get('pageid');
  const schema = searchParams.get('schema');
  const pagetype = searchParams.get('pagetype');
  const language = searchParams.get('language');

  const blocksandfields = useSelector((state) => state.JSONLDSlice.blocksandfields);
  console.log(pageid, schema, pagetype, language, "search params");

  const [blocksnow, setBlocksnow] = useState({});

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    dispatch(cleanBlocksandFields()); // Clear previous blocks and fields
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
        console.log(data.blocksandfvaluesdb, "blocksandfvaluesdb");
        let schemablocks = data.schema.jsonldblocks;

        //WE NEED TO MERGE THE BLOCKS AND FIELDS FROM THE DATABASE WITH THE SCHEMA BLOCKS
        if (data.blocksandfieldsdb && data.blocksandfieldsdb.length > 0) {
          schemablocks = schemablocks.map(block => {
            const dbBlock = data.blocksandfieldsdb.find(b => b.name === block.name);
            if (dbBlock) {
              // Merge fields from the database into the schema block
              return {
                ...block,
                fields: block.fields.map(field => {
                  const dbField = dbBlock.fields.find(f => f.name === field.name);
                  return dbField ? { ...field, value: dbField.value } : field;
                })
              };
            }
            return block; // Return the original block if no match found
          }
          );
        } else {
          console.log("No blocks and fields found in the database for the given schema.");
          // If no blocks and fields found in the database, we can use the schema blocks as is
          console.log("Using schema blocks as is.");
        }
        dispatch(updateBlocksAndFields({
          schemablocks
        }));
      }
    }

    getjsonldschema();
  }, []);

  /*   useEffect(() => {
  
  
    }, [blocksandfields]
   */

  const saveJsonLD = async () => {
    const response = await fetch(`http://localhost:3000/savejsonld`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blocksandfields: blocksandfields,
        schema: schema,
      }),
      credentials: 'include', // Include cookies in the request
    });

    if (!response.ok) {
      console.log("Response not ok");
      console.log(response, "response");
    } else if (response.ok) {
      const data = await response.json();
      console.log(data, "data");
    }
  }


  return (

    <div className="" style={{ maxWidth: '600px' }}>
      <h1 className="text-2xl font-bold mb-4">JSON-LD Configuration</h1>
      <div className="flex flex-row justify-end">
        <button className="button button-primary mb-4" onClick={saveJsonLD}>
          Save
        </button>
      </div>

      {blocksandfields.length > 0 && blocksandfields.map((block, index) => (
        <div key={index} className="jsonld-block">
          <h4 className="text-base font-semibold mb-2">{block.name}</h4>
          <div className="jsonld-fields">
            {Array.isArray(block.fields) && block.fields.length > 0 && block.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="jsonld-field">
                <FieldRendererJSONLD
                  type={field.type}
                  name={field.name}
                  //  value={formValues[block.name]?.fields?.[field.name] || field.value || ""}
/*                   value={field.value || ""}

 */               value={
                    (block.fields.find(f => f.name === field.name)?.value) ?? ""
                  }
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
