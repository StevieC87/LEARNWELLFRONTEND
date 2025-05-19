'use client';
import './editpage.css'
import { use, useEffect, useState } from 'react';
import { ObjectId } from 'bson';
import FieldRenderer from './FieldRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '../../../../redux/slices/PagesSlice';

export default function EditPageComp(props) {
  const dispatch = useDispatch();

  //. SO I THINK: UNFILTERED FIELDS: all languages
  //. filteredFieldsS: only selected language (FOR DISPLAY)

  const { schema, settings, pagefieldsdata, pagedata } = props;

  console.log(schema, "schema");
  console.log(settings, "settings");
  console.log(pagedata, "pagedata123");
  const hello = useSelector((state) => state.PagesSlice.hello);
  console.log(hello, "hello");

  const pagetitle = schema.title;


  const [pagefields, setPageFields] = useState(schema.fields);
  const [pagefieldsdataS, setPageFieldsDataS] = useState(pagefieldsdata);
  const [pagedataS, setPageDataS] = useState(pagedata);
  const pageid = pagedata._id; //string

  const fieldData = useSelector((state) => state.PagesSlice.fields);

  const [filteredFieldsS, setFilteredFieldsS] = useState([]);
  //  const [selectedLang, setSelectedLang] = useState(settings.languages[0]);
  const [selectedLang, setSelectedLang] = useState('en');
  const [mergedfields, setMergedFields] = useState([]);
  const [initialmerge, setInitialMerge] = useState(false);

  const [issaving, setIsSaving] = useState(false);
  const [errorsave, setErrorSave] = useState(false);

  useEffect(() => {
    console.log("pagefields", pagefields);
    console.log("pagefieldsdata", pagefieldsdata);

    //merge pagefields with pagefieldsdata
    const mergedinitial = pagefields.map((fieldObj) => {
      const match = pagefieldsdataS.find((item) => item.field === fieldObj.name);
      let createID = new ObjectId().toString();
      return {
        ...fieldObj,
        content: match ? match.content : [],
        _id: match ? match._id : createID,
        locale: match ? match.locale : selectedLang,
        type: fieldObj.type,
        name: fieldObj.name || match?.field || null,
        pagename: match ? match.pagename : null,
        //  pagename: match.pagename,
      };
    }

      // let createID = new ObjectId().toString();
      // id: match ? match._id : createID,
    );
    console.log(mergedinitial, "mergedinitial");
    setInitialMerge(mergedinitial);

  }, [pagefields, pagefieldsdata])

  useEffect(() => {
    console.log('initialmerge', initialmerge);

    if (initialmerge && initialmerge.length > 0) {
      console.log('yesyesyyes')
      const filteredFields = initialmerge.map((field) => {
        console.log(field, "field333");
        const langContent = field.content.find(c => c.locale === selectedLang);
        console.log(langContent, "langContent3333");
        const currentVersion = langContent?.versions.find(v => v.isCurrent);


        return {
          _id: field._id || createID,
          locale: langContent?.locale || selectedLang,
          content: currentVersion?.content || '',
          type: field.type,
          name: field.name || field.field,
          pagename: field.pagename,
        };

      });
      console.log("filteredFields", filteredFields);
      setFilteredFieldsS(filteredFields);

    }

  }, [initialmerge]);


  useEffect(() => {
    console.log("filteredFieldsS", filteredFieldsS);
    filteredFieldsS.forEach((item) => {

      dispatch(updateField({ name: item.name, content: item.content, id: item._id, locale: item.locale, type: item.type, pagename: item.pagename }));


    }
    );

    /* console.log("filteredFieldsS", filteredFieldsS);
  
  
    const merged = pagefields.map((fieldObj) => {
      const match = filteredFieldsS.find((item) => item.field === fieldObj.name);
      return {
        ...fieldObj,
        content: match ? match.content : "", // or null if you prefer
        _id: match ? match._id : null,
        locale: match ? match.locale : null,
        type: match ? match.type : null,
  
      };
  
    });
    setMergedFields(merged); */



  }, [filteredFieldsS]);

  useEffect(() => {

    console.log("mergedfields", mergedfields);

  }, [mergedfields]);


  const onSave = async () => {
    setIsSaving(true);
    //we do fetch post to backend


    //FIRST WE GET EVERYTHING FROM THE REDUX STORE
    //NEXT_PUBLIC_API_URL 
    const url = `${process.env.NEXT_PUBLIC_API_URL}/schema`;
    console.log(url, "url");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //  Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        schemaname: schema.name,
        fields: fieldData,
        pageid: pageid,
        locale: selectedLang,
        pagename: pagedataS.pagename,
      }),

      //}
    })
    console.log(response, "response55555555");
    if (response.ok) {
      const data = await response.json();
      setIsSaving(false);
      setErrorSave(false);
    }
    else if (!response.ok) {
      setIsSaving(false);
      setErrorSave(true);
    }
  }

  //MAYE NO WNEED TO MERGE THE TWO 


  return (
    <>
      <div className="editpagecontainer">

        <div className="topbuttons p-4">




          {/*  {multilingalBool && (
            <div className="langpicker flex flex-row gap-5">
              <label htmlFor="lang" className="block text-sm font-medium text-gray-700 self-center">
                Language</label>
              <select name="" id="" onChange={(e) => setSelectedLang(e.target.value)}>
                {multilingualLangs.map((lang) => {
                  return (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  );
                })}
              </select>

            </div>
          )} */}

          <button onClick={onSave} className="button button-primary">
            {issaving && (
              <span>Saving</span>
            )}

            {!issaving && (
              <span>Save</span>
            )}
            {errorsave && (
              <span className="text-red-500">Error</span>
            )}

          </button>
        </div>





        {<h1 className="">Edit {pagetitle}   </h1>}

        {(filteredFieldsS.length === 0) && (
          <div className="emptyfields">
            <h2>No fields found</h2>
            <p>Please add a field to get started.</p>
          </div>
        )}

        {/* (mergedfields.length > 0) && mergedfields.map((field) => { */

          (filteredFieldsS.length !== 0) && filteredFieldsS.map((field) => {
            // const fieldData = useSelector((state) => state.PagesSlice.fields[field.name]) || {};
            console.log(field, 'field555555')
            console.log(field.name, "field.name111");
            let fieldData1 = fieldData[field.name] || {};
            console.log(fieldData1, "fieldData1");
            console.log(fieldData1.id, "fieldData1.content");
            return (
              /*   <span>hello</span> */
              <FieldRenderer
                key={field.name}
                type={field.type}
                name={field.name}
                label={field.name}
                value={fieldData1.content || ""}

                onChange={(e) => {
                  const newValue = e.target.value;
                  dispatch(updateField({ name: field.name, content: newValue, id: fieldData1.id, locale: fieldData1.locale, pagename: fieldData1.pagename, type: field.type }));
                }}
              />

            )
          })}


        <div>
          {/*  {filteredFieldsS.map((field) => (

            <div key={field._id} className="fielddivblock">
              <label htmlFor={field.field} className="block text-sm font-medium text-gray-700">Text Block Title

              </label>
              <input
                type="text"
                className="editfield"
                data-type="blockname"
                id={`${field._id.toString()}-fieldid`}
                name={field.field}
                value={field.field}
                onChange={onChangeField}
              />
              <label htmlFor={field.field} className="block text-sm font-medium text-gray-700">Text Block Content

              </label>
              <input
                type="text"
                data-type="blockcontent"
                id={`${field._id.toString()}-contentid`}
                name={field.content}
                value={field.content}
                onChange={onChangeField}
              />
            </div>

          ))}
 */}

        </div>

        <div className="flex flex-col gap-5" style={{ width: "300px" }}>



        </div>
      </div>

    </>
  )
}

/* */
/* key={field.name}
field={field}
value={field.content || ""} */
/*  onChange={(e) =>
   setFormValues((prev) => ({
     ...prev,
     [field.name]: e.target.value,
   }))
 } */