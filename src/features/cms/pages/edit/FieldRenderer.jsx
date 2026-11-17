'use client'
import { validateSlug } from './utilities/validation';
import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '@/redux/slices/PagesSlice';
import { useEffect, useState } from 'react';
import SummernoteField from '../../fields/Summernote/SummernoteField';
import MediaButton from '../../fields/MediaButton';
import { updateSharedFields } from '@/redux/slices/SharedSlice';
import Relationfield from '../../fields/Relationfield';
//! ADD ID OF THE FIELD  - PASS TO REDUX 

const FieldRenderer = ({ type, name, value, label, onChange2, fielddata, placeholder, required, disabled, autofocus, inputcssclass, inputdivcssclass, labelcssclass, fields, onChange3, fieldarray, fieldarrayparent, indexis, subfield, source, relation, neworexisting, options }) => {
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
    }

  }, [value, type, fieldvalue1, fieldvalueuserprofile]);


  const dispatch = useDispatch();
  const slugduplicatewarning = useSelector((state) => state.PagesSlice.slugduplicatewarning);


  const [fieldvaluebeforedispatch, setFieldValueBeforeDispatch] = useState({});
  useEffect(() => {
    setFieldValue(value || '');
  }, [value]);


  const onBlur = (e) => {
    const newValue = e.target.value;
    if (source === 'shared') {
      dispatch(updateSharedFields({
        name,
        content: newValue,
        type,
        placeholder,
        required: required || false,
        fields: fields || null,
      }));
    } else {
      dispatch(updateField({
        name,
        content: newValue,
        id: fielddata.id || '',
        locale: fielddata.locale || '',
        schema: fielddata.schema || '',
        type: type || 'text',
        placeholder: placeholder || '',
        required: required || false,
        fields: fields || null,
      }));
    }
    onChange2();
  };


  const onChange = (e) => {
    setFieldValue(e.target.value);
  };

  const changeArrayfield = (e) => {
    // alert('hello')
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

      return (
        //! add custom class maybe after? 
        <div className={inputdivcssclass || 'fielddivblock'}>
          <label htmlFor={name} className={`block text-sm font-medium text-gray-700 ${labelcssclass}`}>{label}</label>
          {/*  <p>NameforFrontend: {name}</p> */}
          <input
            key={name}
            name={name}
            type="text"
            //value={fieldValue}
            value={fieldValue}

            fieldarray={fieldarray || 'false'}
            fieldarrayparent={fieldarrayparent || ''}
            onChange={(e) => onChange(e, fieldarray, fieldarrayparent, indexis, subfield, name)}
            onBlur={(e) => onBlur(e)}
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
          <p>NameforFrontend: {name}</p>
          <textarea
            key={name}
            name={name}
            // value={fieldValue}
            value={fieldValue}
            required={required || false}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
          />
        </div>
      );
    case "wysi":
      return (

        <div className="fielddivblock">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
          <p>NameforFrontend: {name}</p>
          <SummernoteField
            /*  key={name} */
            name={name}
            id={fielddata.id || ''}
            locale={fielddata.locale}
            schema={fielddata.schema}
            type={type}
            //value={fieldValue}
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
          <p>NameforFrontend: {name}</p>
          <input
            key={name}
            name={name}
            type="number"
            //value={fieldValue}
            value={fieldValue}
            onChange={onChange}
            onBlur={onBlur}
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
            onBlur={onBlur}

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
            //value={fieldValue}
            value={fieldValue}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}

            required={required || false}
          />
        </div>
      );
    case "medialibrary":
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
      return (
        <>
          <div className="fielddivblock border border-gray-300 p-4 rounded-md">
            {fields.map((fieldObj, index) => {
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
              <button className="ui-btn ui-btn-primary ui-btn-icon">+</button>
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
            // value={fieldValue}
            value={fieldValue}
            label={label}
            onChange={onChange}
            onBlur={onBlur}
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

    case "url":
    case "email":
    case "color":
    case "datetime":
      return (
        <div className="fielddivblock">
          <label htmlFor={name} className="ui-label">{label}</label>
          <input
            id={name}
            name={name}
            type={type === "datetime" ? "datetime-local" : type}
            className={type === "color" ? "" : "ui-input"}
            value={fieldValue || (type === "color" ? "#000000" : "")}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required || false}
            disabled={disabled || false}
          />
        </div>
      );
    case "boolean":
      return (
        <div className="fielddivblock">
          <label className="ui-check">
            <input
              name={name}
              type="checkbox"
              checked={fieldValue === true || fieldValue === "true"}
              disabled={disabled || false}
              onChange={(e) => {
                setFieldValue(e.target.checked);
                onBlur({ target: { value: e.target.checked } });
              }}
            />
            {label}
          </label>
        </div>
      );
    case "select":
      return (
        <div className="fielddivblock">
          <label htmlFor={name} className="ui-label">{label}</label>
          <select
            id={name}
            name={name}
            className="ui-input"
            value={fieldValue || ""}
            disabled={disabled || false}
            required={required || false}
            onChange={(e) => {
              setFieldValue(e.target.value);
              onBlur(e);
            }}
          >
            <option value="">Choose…</option>
            {(options || fielddata?.options?.list || []).map((o) => (
              <option key={o.value} value={o.value}>{o.title}</option>
            ))}
          </select>
        </div>
      );
    default:
      return null;
  }
};

export default FieldRenderer;
