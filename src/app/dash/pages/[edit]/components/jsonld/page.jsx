'use client';
import { useRef, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import FieldRendererJSONLD from './FieldRendererJSONLD';
import { updateBlocksAndFields, cleanBlocksandFields } from '@/redux/slices/JSONLDSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';


export default function JsonLDPage() {
  const dispatch = useDispatch();
  const effectRan = useRef(false);
  const params = useParams();
  console.log(params, "paramsinJsonLDPage");
  const pageid = params.edit; // Assuming the pageid is passed as a URL parameter
  const searchParams = useSearchParams();
  // const pageid = searchParams.get('pageid');
  console.log(pageid, "pageidpageidpageid");
  const schema = searchParams.get('schema');
  const pagetype = searchParams.get('pagetype');
  const language = searchParams.get('language');
  const slug = searchParams.get('slug');

  //! INTERSETING
  const blocksandfields = useSelector((state) => state.JSONLDSlice.blocksandfields);

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


  const [webpageblockfieldvalues, setWebpageBlockFieldValues] = useState([]);
  const [articleblogblockfieldvalues, setArticleBlogBlockFieldValues] = useState([]);

  //. FETCH JSON-LD SCHEMA;  THEIR VALUES FROM DB
  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    dispatch(cleanBlocksandFields()); // Clear previous blocks and fields

    const getjsonldschema = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/getjsonldschema?schema=${schema}&pageid=${pageid}`, {
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
        console.log(data.blocksandfieldsdb, "blocksandfieldsdb");
        let schemablocks = data.schema.jsonldblocks;
        console.log(schemablocks, "schemablocks");
        dispatch(updateBlocksAndFields({
          schemablocks
        }));


        let getfieldvaluesifany = data.getfieldvaluesifany || {};
        console.log(getfieldvaluesifany, "getfieldvaluesifany");

        setWebpageBlockFieldValues(getfieldvaluesifany.webpageblock); // Set webpage block field values if available
        setArticleBlogBlockFieldValues(getfieldvaluesifany.articleblogblock || {});


        /*  if (data.blocksandfieldsdb && data.blocksandfieldsdb.length > 0) {
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
         } */

      }
    }

    getjsonldschema();
  }, []);

  /*   useEffect(() => {
  
  
    }, [blocksandfields]
   */

  const saveJsonLD = async () => {
    const response = await fetch(`${[process.env.NEXT_PUBLIC_API_URL]}/savejsonld`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken // Include CSRF token in the request headers

      },
      body: JSON.stringify({
        blocksandfields: blocksandfields,
        schema: schema,
        slug: slug,
        pageid: pageid,
        pagetype: pagetype,
        language: language,
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

  const matchfieldnameblockwithvalue = (blockName, fieldName) => {
    if (blockName === "WebPage Block") {
      console.log(fieldName, "fieldname in matchfieldnameblockwithvalue");
      // Check if the field exists in the webpage block field values
      console.log(webpageblockfieldvalues, "webpageblockfieldvalues in matchfieldnameblockwithvalue");
      const field = webpageblockfieldvalues.find(f => f[fieldName] !== undefined);
      if (field) {
        console.log(field, "fieldmatchmatchmatch")
        console.log(field[fieldName], "fieldvaluefieldvaluefieldvalue");
        return field ? field[fieldName] : "";
      }
    }
    else if (blockName === "Article Block" || blockName === "BlogPosting Block") {
      // Check if the field exists in the article/blog block field values
      const field = articleblogblockfieldvalues.find(f => f[fieldName] !== undefined);
      if (field) {
        console.log(field, "fieldmatchmatchmatch")
        console.log(field[fieldName], "fieldvaluefieldvaluefieldvalue");
        return field ? field[fieldName] : "";
      }
    }
    /*   const block = blocksandfields.find(b => b.name === blockName);
      if (block) {
        const field = block.fields.find(f => f.name === fieldName);
        return field ? field.value : "";
      }
      return ""; */
    //fieldvalues
  }


  return (

    <div className="jsonldouterdiv" >
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
                  value={matchfieldnameblockwithvalue(block.name, field.name) || field.value || ""}
                  //  value={formValues[block.name]?.fields?.[field.name] || field.value || ""}
                  /*                   value={field.value || ""}
                                    
                   */               /* value={
(block.fields.find(f => f.name === field.name)?.value) ?? ""
} */
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
