'use client'
import { validateSlug } from './utilities/validation';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, updateArrayField } from '@/redux/slices/PagesSlice';
import { useEffect, useState } from 'react';
import SummernoteField from '../../uicomponents/customfields/Summernote/SummernoteField';
import MediaButton from '../../uicomponents/customfields/MediaButton';
import { updateSharedFields } from '@/redux/slices/SharedSlice';
import Relationfield from '../../uicomponents/customfields/Relationfield';
//! ADD ID OF THE FIELD  - PASS TO REDUX 

const FieldRenderer = ({ type, name, value, label, onChange2, fielddata, placeholder, required, disabled, autofocus, inputcssclass, inputdivcssclass, labelcssclass, fields, onChange3, fieldarray, fieldarrayparent, indexis, subfield, source, relation }) => {
  //note: source here refers to wher eit's called from e.g. from shared componetns specifically - to set state not in dispatch
  // console.log(fielddata, "fielddata33333333");

  const [fieldValue, setFieldValue] = useState('');

  //this for the sahred
  let fieldvalue1 = useSelector(
    (state) => state.SharedSlice.fields[name]?.content || '')
  let fieldvalueuserprofile = useSelector(
    (state) => state.PagesSlice.fields[name]?.content || '')

  useEffect(() => {
    if (source === 'shared') {
      setFieldValue(fieldvalue1);
    }
    else if (source === 'userprofile') {
      setFieldValue(fieldvalueuserprofile);
    }
    else {
      setFieldValue(value);
      console.log(value, "value3333333333");
    }

  }, [value, type, fieldvalue1, fieldvalueuserprofile]);


  const dispatch = useDispatch();
  const slugduplicatewarning = useSelector((state) => state.PagesSlice.slugduplicatewarning);


  const onChange = (e, arrayfield, arrayfieldparent, indexis, subfield) => {
    const newValue = e.target.value;
    console.log(newValue, "newValue3333333333");
    if (source === 'shared') {
      dispatch(updateSharedFields({
        name: name,
        content: newValue,
        type: type,
        placeholder: placeholder,
        required: required || false,
        fields: fields || null,
      }));
    }
    else {
      console.log(fielddata, 'fieldata11111111111111')
      dispatch(updateField({
        name: name,
        content: newValue,
        id: fielddata.id || '',
        locale: fielddata.locale || '',
        schema: fielddata.schema || '',
        type: type || 'text',
        placeholder: placeholder || '',
        required: required || false,
        fields: fields || null,
      }));


      onChange2();
    }
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
            value={fieldValue}
            fieldarray={fieldarray || 'false'}
            fieldarrayparent={fieldarrayparent || ''}
            onChange={(e) => onChange(e, fieldarray, fieldarrayparent, indexis, subfield)}
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
            value={fieldValue}
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
            id={fielddata.id || ''}
            locale={fielddata.locale}
            schema={fielddata.schema}
            type={type}
            value={fieldValue}
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
            value={fieldValue}
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
            value={fieldValue}
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
            id={fielddata.id || ''}
            locale={fielddata.locale}
            schema={fielddata.schema}
            type={type}
            value={fieldValue}
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
                  /*  value={fieldObj.value || ''} */
                  value={fieldObj.content || ""}

                  label={fieldObj.label || ''}
                  fieldarray={'true'}
                  fieldarrayparent={name}
                  indexis={index}
                  subfield={fieldObj.name}
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
            <div className="flex flex-col gap-5 width300" >
              <button className="button button-primary">+</button>
              {/* onClick={CreateNewField} */}

            </div>
          </div>
        </>
      );

    case "relation":
      return (
        <div className="fielddivblock">
          <Relationfield
            name={name}
            value={fieldValue}
            label={label}
            onChange={onChange}
            options={fielddata.options || []} // Assuming options are passed in fielddata
            placeholder={placeholder}
            required={required || false}
            disabled={disabled || false}
            relation={relation || null} // Assuming relation is part of fielddata
          />
          {/* <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
          <input
            key={name}
            name={name}
            type="text"
            value={fieldValue}
            onChange={onChange}
            placeholder={placeholder}
            required={required || false}
          /> */}

        </div>
      );

    default:
      return null;
  }
};

export default FieldRenderer;
