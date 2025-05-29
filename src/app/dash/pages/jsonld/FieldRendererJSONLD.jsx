'use client'

import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '@/redux/slices/PagesSlice';
import { useState } from 'react';
import { updateBlocksAndFields } from '@/redux/slices/JSONLDSlice';


//! ADD ID OF THE FIELD  - PASS TO REDUX 

const FieldRendererJSONLD = ({ type, name, value, label, onChange2, fielddata, placeholder, parentblock }) => {
  ;
  const dispatch = useDispatch();
  // const fieldData1 = useSelector((state) => state.PagesSlice.fields[name]);

  //console.log(fielddata, "fielddata33333333");

  const onChange = (e) => {
    //get parent block from data attribute
    //console.log(e.target, "e.target");
    //console.log(e.target.value, "e.target.value");
    //console.log(e.target.name, "e.target.name");
    //console.log(e.target.type, "e.target.type");
    console.log(e.target.dataset.parentblock, "e.target.dataset.parentblock");
    const newValue = e.target.value;
    dispatch(updateBlocksAndFields({
      blocknameparentblock: e.target.dataset.parentblock,
      name: name,
      content: newValue,
      // locale: fielddata.locale,
      // schema: fielddata.schema,
      type: type
    }));

    //  onChange2();
  }

  switch (type) {
    case "text":

      return (
        //! add custom class maybe after? 
        <div className="fielddivblock">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
          <input
            key={name}
            name={name}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            data-parentblock={parentblock} // Pass the parent block as a data attribute
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
            onChange={onChange}
            placeholder={placeholder}
            data-parentblock={parentblock}
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
            onChange={onChange}
            placeholder={placeholder}
            data-parentblock={parentblock}
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
            onChange={(e) =>
              onChange({ target: { name: name, value: e.target.checked } })
            }
            data-parentblock={parentblock}
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
            onChange={onChange}
            placeholder={placeholder}
            data-parentblock={parentblock}
          />
        </div>
      );

    default:
      return null;
  }
};

export default FieldRendererJSONLD;
