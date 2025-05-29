'use client';
import { use, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

export default function JsonLDPage() {
  const searchParams = useSearchParams();
  const pageid = searchParams.get('pageid');
  const schema = searchParams.get('schema');
  const pagetype = searchParams.get('pagetype');
  const language = searchParams.get('language');


  const [schemablocks, setSchemaBlocks] = useState([]);
  const [formValues, setFormValues] = useState({});
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
      }
    }
    getjsonldschema();
  }, []);


  useEffect(() => {
    console.log('schemablocks', schemablocks);

    if (schemablocks.length > 0) {
      const initialarray = [];
      schemablocks.forEach(block => {

        if (Array.isArray(block.fields)) {
          const initial = {};
          console.log(block, 'block33333');
          block.fields.forEach(field => {
            console.log(field, 'field33333');
            console.log(field.name, field.value, 'field name and value');
            initial[field.name] = field.value; // Ensure value is defined
            //

            /* initial[field.name] = field.type === "checkbox" ? !!field.value : (field.value || ""); */
          });
          initialarray.push({
            name: block.name,
            fields: initial
          });
        }
        console.log(initialarray, 'initialarray');
      });
      setFormValues(initialarray);
    }
  }, [schemablocks]);
  function renderField({ type, name, label, value, onChange, slugduplicatewarning, fielddata, placeholder = "" }) {
    console.log(value, name, 'value1111111')
    const handleChange = (e) => {
      onChange({
        target: {
          name: name,

          value: e.target.value,
          //|| (e.target.type === "checkbox" ? e.target.checked : e.target.value),
          type: e.target.type
        }
      });
    };

    switch (type) {
      case "text":
        return (
          <div className="fielddivblock">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label} {name} {value}</label>
            <input
              key={name}
              name={name}
              type="text"
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
            />

          </div>
        );
      case "textarea":
        return (
          <div className="fielddivblock">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea
              key={name}
              name={name}
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
            />
          </div>
        );
      case "number":
        return (
          <div className="fielddivblock">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              key={name}
              name={name}
              type="number"
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
            />
          </div>
        );
      case "checkbox":
        return (
          <div className="fielddivblock">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              key={name}
              name={name}
              type="checkbox"
              checked={value}
              onChange={handleChange}
              placeholder={placeholder}
            />
          </div>
        );
      case "date":
        return (
          <div className="fielddivblock">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              key={name}
              name={name}
              type="date"
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
            />
          </div>
        );
      default:
        return null;
    }
  }

  useEffect(() => {
    console.log('formValues44444444', formValues);
  }, [formValues]);

  return (

    <div className="jsonld-page">
      <h1 className="text-2xl font-bold mb-4">JSON-LD Configuration</h1>

      {schemablocks.length > 0 && schemablocks.map((block, index) => (
        <div key={index} className="jsonld-block">
          <h2 className="text-xl font-semibold mb-2">{block.name}</h2>
          <div className="jsonld-fields">
            {Array.isArray(block.fields) && block.fields.length > 0 && block.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="jsonld-field">
                {renderField({
                  type: field.type,
                  name: field.name,
                  label: field.label,
                  // value: formValues[field.name] ?? "",
                  onChange: (e) => setFormValues(prev => ({
                    ...prev,
                    // [field.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
                    [field.name]: e.target.value || (e.target.type === "checkbox" ? e.target.checked : e.target.value)
                  })),
                  fielddata: field,
                  placeholder: field.placeholder || ""
                })}
              </div>
            ))}
          </div>
        </div>
      ))}



    </div>
  )
}
