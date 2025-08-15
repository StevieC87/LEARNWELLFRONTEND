'use client'

import { useDispatch, useSelector } from 'react-redux';
//import { updateField } from '@/redux/slices/EditPageSlice';
import { useState } from 'react';
import { updateBlocksAndFields, changeBlocksAndFieldsblockupdatefield } from '@/redux/slices/JSONLDSlice';


//! ADD ID OF THE FIELD  - PASS TO REDUX 

const FieldRendererJSONLD = ({ type, name, value, label, onChange2, fielddata, placeholder, parentblock }) => {
  ;
  const dispatch = useDispatch();
  // const fieldData1 = useSelector((state) => state.EditPageSlice.fields[name]);

  //console.log(fielddata, "fielddata33333333");

  const onChange = (e) => {
    const name = e.target.name; // Get the field name from the input's name attribute
    const type = e.target.type; // Get the field type from the input's type attribute
    const content = e.target.value; // Get the field value from the input's value attribute
    const blocknameparentblock = e.target.dataset.parentblock; // Get 

    dispatch(changeBlocksAndFieldsblockupdatefield({
      blocknameparentblock: blocknameparentblock,
      name: name,
      content: content,
      type: type
    }));

    //  onChange2();
  }

  switch (type) {
    case "text":

      return (
        //! add custom class maybe after? 
        <div className="">
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
        <div className="">
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
        <div className="">
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
        <div className="">
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
        <div className="">
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
