'use client'
import { validateSlug } from './utilities/validation';
import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '@/redux/slices/PagesSlice';
import { useState } from 'react';


//! ADD ID OF THE FIELD  - PASS TO REDUX 

const FieldRenderer = ({ type, name, value, label, onChange2, fielddata }) => {
  ;
  const dispatch = useDispatch();
  const slugduplicatewarning = useSelector((state) => state.PagesSlice.slugduplicatewarning);
  // const fieldData1 = useSelector((state) => state.PagesSlice.fields[name]);

  console.log(fielddata, "fielddata33333333");

  const onChange = (e) => {
    const newValue = e.target.value;
    dispatch(updateField({
      name: name,
      content: newValue, id: fielddata.id,
      locale: fielddata.locale,
      schema: fielddata.schema,
      type: type
    }));
    //setHasChanges(true);
    onChange2();
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

          />
          {name === "slug" && slugduplicatewarning && (
            <p className="text-red-500 mt-1">
              This slug is already in use, has been renamed.
            </p>
          )}
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
          />
        </div>
      );

    default:
      return null;
  }
};

export default FieldRenderer;
