'use client'
import { validateSlug } from './utilities/validation';
import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '@/redux/slices/PagesSlice';
import { useState } from 'react';
import SummernoteField from '../../uicomponents/customfields/Summernote/SummernoteField';
import MediaButton from '../../uicomponents/customfields/MediaButton';

//! ADD ID OF THE FIELD  - PASS TO REDUX 

const FieldRenderer = ({ type, name, value, label, onChange2, fielddata, placeholder, required, disabled, autofocus, inputcssclass, inputdivcssclass, labelcssclass, fields, onChange3, fieldarray }) => {
  // console.log(fielddata, "fielddata33333333");

  const dispatch = useDispatch();
  const slugduplicatewarning = useSelector((state) => state.PagesSlice.slugduplicatewarning);
  // const fieldData1 = useSelector((state) => state.PagesSlice.fields[name]);

  //console.log(fielddata, "fielddata33333333");

  const onChange = (e, arrayfield) => {
    // alert('chagned')
    alert(arrayfield);
    /*     alert(arrayfield)
        if (arrayfield) {
          alert('arrayfield changed');
        } */
    const newValue = e.target.value;
    dispatch(updateField({
      name: name,
      content: newValue,
      id: fielddata.id,
      locale: fielddata.locale,
      schema: fielddata.schema,
      type: type,
      placeholder: placeholder,
      required: required || false,
      fields: fields || null,
    }));

    onChange2();
  }

  const changeArrayfield = (e) => {
    alert('hello')
    const newValue = e.target.value;
    /*  dispatch(updateField({
       name: name,
       content: newValue,
       id: fielddata.id,
       locale: fielddata.locale,
       schema: fielddata.schema,
     })); */
  }

  switch (type) {
    case "text":

      console.log(required, "requiredrequiredrequiredrequired");
      return (
        //! add custom class maybe after? 
        <div className={inputdivcssclass || 'fielddivblock'}>
          <label htmlFor={name} className={`block text-sm font-medium text-gray-700 ${labelcssclass}`}>{label}</label>
          <input
            key={name}
            name={name}
            type="text"
            value={value}
            fieldarray={fieldarray || 'false'}
            onChange={(e) => onChange(e, fieldarray)}
            placeholder={placeholder}
            required={required || false}
            disabled={disabled || false}
            // autoFocus={autofocus || false}
            autoFocus={name === "title" ? true : false}
            className={inputcssclass || ''}

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
            required={required || false}
            onChange={onChange}
            placeholder={placeholder}
          />
        </div>
      );

    case "wysi":
      return (

        <div className="fielddivblock">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
          <SummernoteField
            /*  key={name} */
            name={name}
            id={fielddata.id}
            locale={fielddata.locale}
            schema={fielddata.schema}
            type={type}
            value={value}
            placeholder={placeholder}
            required={required || false}
          // onChange={onChange}
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

            required={required || false}
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
            placeholder={placeholder}

            required={required || false}
          />
        </div>
      );
    case "medialibrary":
      console.log('medialibraryLABEL', label)
      return (
        <div className="fielddivblock">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
          <MediaButton
            name={name}
            id={fielddata.id}
            locale={fielddata.locale}
            schema={fielddata.schema}
            type={type}
            value={value}
            placeholder={placeholder}
            required={required || false}
          />
        </div>
      );

    case "array":
      console.log(fields, "fieldsfieldsfieldsfields22222");
      return (
        <>
          <div className="fielddivblock border border-gray-300 p-4 rounded-md">
            {fields.map((fieldObj, index) => {
              console.log(fieldObj, "fieldObj3333333333");
              return (
                <FieldRenderer
                  key={index}
                  type={fieldObj.type}
                  name={fieldObj.name}
                  value={fieldObj.value || ''}
                  label={fieldObj.label || ''}
                  fieldarray={'true'}
                  onChange2={onChange2}
                  fielddata={fielddata}
                  placeholder={fieldObj.placeholder || ''}
                  required={fieldObj.required || false}
                  disabled={fieldObj.disabled || false}
                  autofocus={fieldObj.autofocus || false}
                  inputcssclass={fieldObj.inputcssclass || ''}
                  inputdivcssclass={fieldObj.inputdivcssclass || ''}
                  labelcssclass={fieldObj.labelcssclass || ''}
                  fields={fieldObj.fields || null}
                />
              );
            })
            }
            <div className="flex flex-col gap-5" style={{ width: "300px" }}>
              <button className="button button-primary">+</button>
              {/* onClick={CreateNewField} */}

            </div>
          </div>
        </>
      );



    default:
      return null;
  }
};

export default FieldRenderer;
