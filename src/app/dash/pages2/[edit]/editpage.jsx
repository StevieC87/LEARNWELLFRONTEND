'use client';
import './editpage.css'
import { use, useEffect, useState } from 'react';
import { ObjectId } from 'bson';
import FieldRenderer from './FieldRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, setSlugDuplicateWarning } from '../../../../redux/slices/PagesSlice';
import { setSelectedLanguage, setMultilingualSharedId, setPageExistsThisLanguage } from '../../../../redux/slices/DashSlice';
import { useRouter } from 'next/navigation';

export default function EditPageComp(props) {
  const router = useRouter();
  const dispatch = useDispatch();

  //. SO I THINK: UNFILTERED FIELDS: all languages
  //. filteredFieldsS: only selected language (FOR DISPLAY)

  const { schema, settings, pagefieldsdata, pagedata, neworexisting, pageid, pagetype } = props;

  console.log(schema, "schema1234");
  console.log(settings, "settings");
  console.log(pagedata, "pagedata123");
  console.log(pagefieldsdata, "pagefieldsdata777777777");
  console.log(neworexisting, "neworexisting1234");
  console.log(pageid, "pageid");
  console.log(pagetype, "pagetype1234");

  const selectedLanguage = useSelector((state) => state.DashSlice.selectedLanguage);

  const pagetitle = schema?.title;


  const [pagefields, setPageFields] = useState(schema.fields);
  const [pagedataS, setPageDataS] = useState(pagedata);
  //const pageid = pagedata._id; //string

  const fieldData = useSelector((state) => state.PagesSlice.fields);

  const [filteredFieldsS, setFilteredFieldsS] = useState([]);

  const [mergedfields, setMergedFields] = useState([]);
  const [initialmerge, setInitialMerge] = useState(false);

  const [issaving, setIsSaving] = useState(false);
  const [errorsave, setErrorSave] = useState(false);
  const [showsaved, setShowSaved] = useState(false);

  const [multilingalBool, setMultilingualBool] = useState(settings.multilingualyesno || false);
  const [multilingualLangs, setMultilingualLangs] = useState(settings.languages || []);
  const [defaultlang, setDefaultLang] = useState(settings.defaultlanguage || null);

  //to prevent publishing if made changes prior to publishing
  const [hasChanges, setHasChanges] = useState(true);

  const multilingualsharedid = useSelector((state) => state.DashSlice.multilingualsharedid);
  const pageexiststhislanguage = useSelector((state) => state.DashSlice.pageexiststhislanguage);
  //to show message if slug existed and was renamed
  // const [slugduplicatewarning, setSlugDuplicateWarning] = useState(false);

  // const [selectedLang, setSelectedLang] = useState(defaultlang || multilingualLangs[0] || null);

  useEffect(() => {
    console.log("pagefields333", pagefields);
    console.log("pagefieldsdata333", pagefieldsdata);
    //merge pagefields with pagefieldsdata
    const mergedinitial = pagefields.map((fieldObj) => {
      const match = pagefieldsdata.find((item) => item.field === fieldObj.name);
      console.log(match, "match3333333333");
      let createID = new ObjectId().toString();
      return {
        ...fieldObj,
        content: match ? match.content : '',
        _id: match ? match._id : createID,
        locale: match ? match.locale : selectedLanguage,
        type: fieldObj.type,
        name: fieldObj.name || match?.field || null,
        schema: match ? match.schema : null,
        //  pagename: match.pagename,
      };
    }

      // let createID = new ObjectId().toString();
      // id: match ? match._id : createID,
    );
    console.log(mergedinitial, "mergedinitial");
    setInitialMerge(mergedinitial);
    setFilteredFieldsS(mergedinitial);
  }, [pagefields, pagefieldsdata])

  /*  useEffect(() => {
     console.log('initialmerge', initialmerge);
 
     if (initialmerge && initialmerge.length > 0) {
       console.log('yesyesyyes')
       const filteredFields = initialmerge.map((field) => {
         console.log(field, "field333");
          const langContent = field.content.find(c => c.locale === selectedLang); 
       console.log(langContent, "langContent3333");
         //const currentVersion = langContent?.versions.find(v => v.isCurrent);
 
 
         return {
           _id: field._id || createID,
           locale: langContent?.locale || selectedLang,
           content: currentVersion?.content || '',
           type: field.type,
           name: field.name || field.field,
           schema: field.schema,
         };
 
       });
       console.log("filteredFields", filteredFields);
       setFilteredFieldsS(filteredFields);
 
     }
 
   }, [initialmerge, selectedLang]); */


  useEffect(() => {
    console.log("filteredFieldsS", filteredFieldsS);
    filteredFieldsS.forEach((item) => {
      dispatch(updateField({ name: item.name, content: item.content, id: item._id, locale: item.locale, type: item.type, schema: item.schema }));
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

  const changelanguage = async (e) => {
    //first save current progress, before switching language
    /*  if (hasChanges) {
       onSave();
     } */
    dispatch(setSelectedLanguage(e.target.value));
    //WE NEED TO SEE HERE IF THERE IS A PAGE FOR THIS SELECTED LANGUAGE 
    //EASY: WE DO A FETCH, WE RETURN BACK - IF IT'S NEW OR EXISTING FOR THIS SPECIFIC LANGUAGE
    // PUT IT IN REDUX - AND SEND APPROPRAITE FETCH 
    let url = `${process.env.NEXT_PUBLIC_API_URL}/checkexistslanguage?pagetype=${pagetype}&pageid=${pageid}&language=${e.target.value}`;
    const response = await fetch(url)
    if (!response.ok) {
      console.log(response, "response not ok");
    }
    else if (response.ok) {
      const data = await response.json();
      console.log(data, "data from checkexistslanguage");
      let exists = data.exists;
      dispatch(setPageExistsThisLanguage(exists));
      dispatch(setMultilingualSharedId(data.multilingualsharedid));
      console.log(exists, "exists");
    }
  }


  const onSave = async () => {
    setHasChanges(false);
    setIsSaving(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/schema`;


    //we do fetch post to backend


    //FIRST WE GET EVERYTHING FROM THE REDUX STORE
    //NEXT_PUBLIC_API_URL 
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
        locale: selectedLanguage,
        schema: pagedataS.schema,
        pagetype: pagetype,
        pagedata: pagedataS,
        neworexisting: neworexisting,
        multilingualsharedid: multilingualsharedid,
        pageexiststhislanguage: pageexiststhislanguage

      }),
    })

    if (!response.ok) {
      setErrorSave(true);
      console.log(response, "response not ok");
      //print error message
      const errorData = await response.json();
      console.log(errorData, "errorData");
      if (errorData.errorthing === "titlemissing") {
        alert("Please add a field with name 'title' to the schema of the page");
      }
      setIsSaving(false);


    }
    else if (response.ok) {
      console.log(response, "response saved ok");
      const data = await response.json();
      setIsSaving(false);
      setErrorSave(false);
      const pageid = data.pageid;
      const pagetype = data.pagetype;
      const slugduplicatewarningv = data.slugexists;
      console.log(slugduplicatewarningv, "slugduplicatewarning");
      console.log(data.multilingualsharedid, "multilingualsharedid11111111111111");
      dispatch(setMultilingualSharedId(data.multilingualsharedid));
      console.log(data.locale, "locale22222222222222");
      if (slugduplicatewarningv) {
        dispatch(setSlugDuplicateWarning(true));
        setTimeout(() => {
          dispatch(setSlugDuplicateWarning(false));
        }, 4000);
      }
      //const url = `${process.env.NEXT_PUBLIC_API_URL}/dash/pages2/${pageid}?pagetype=${pagetype}`;
      //if page post redirect to edit version of itself
      if (neworexisting === "new") {
        const url = `${pageid}?pagetype=${pagetype}`;
        router.push(url);

      }
      setShowSaved(true);
      setTimeout(() => {
        setShowSaved(false);
      }, 2000);

    }
    setHasChanges(false);

  }
  const onPublish = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/publish`;

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
        locale: selectedLanguage,
        schema: pagedataS.schema,
        pagetype: pagetype,
        pagedata: pagedataS,
        neworexisting: neworexisting,
        slug: fieldData.slug ? fieldData.slug.content : "", //slug field

      }),
    })
    console.log(response, "response55555555");
    if (response.ok) {
      const data = await response.json();
      setIsSaving(false);
      setErrorSave(false);
      const pageid = data.pageid;
      const pagetype = data.pagetype;
      //const url = `${process.env.NEXT_PUBLIC_API_URL}/dash/pages2/${pageid}?pagetype=${pagetype}`;
      //if page post redirect to edit version of itself
      if (neworexisting === "new") {
        const url = `${pageid}?pagetype=${pagetype}`;
        router.push(url);

      }
      // setShowSaved(true);
      // setTimeout(() => {
      //   setShowSaved(false);
      //  }, 2000);

    }
    else if (!response.ok) {
      //console.log(response, "response not ok");
      //print error message
      const errorData = await response.json();
      console.log(errorData, "errorData");
      if (errorData.errorthing === "titlemissing") {
        alert("Please add a field with name 'title' to the schema of the page");
      }
      //setIsSaving(false);
      // setErrorSave(true);

    }
    /*  setHasChanges(false);
     setIsSaving(true);
     let url = `${process.env.NEXT_PUBLIC_API_URL}/publish`;
     console */
  }

  return (
    <>
      <div className="editpagecontainer">

        <div className="topbuttons p-4">
          {multilingualLangs && (
            <div className="langpicker flex flex-row gap-5">
              <label htmlFor="lang" className="block text-sm font-medium text-gray-700 self-center">
                Language</label>

              <select name="" id=""
                /*  onChange={(e) => setSelectedLang(e.target.value)} */
                onChange={(e) => changelanguage(e)}
                value={selectedLanguage}
              >
                //! i want here to show the language from redux
                {multilingualLangs.map((lang) => {
                  return (
                    <option key={lang} value={lang}

                    >
                      {lang}
                    </option>
                  );
                })}
              </select>


            </div>
          )}
          <div className="flex flex-row">
            <button onClick={() => onSave()} className="button button-primary">
              {issaving && (
                <span>Saving</span>
              )}

              {!issaving && !showsaved && (
                <span>Save</span>
              )}
              {errorsave && (
                <span className="text-red-500">Error</span>
              )}
              {showsaved && !issaving && (
                <span className="text-green-500">Saved</span>
              )}

            </button>

            {neworexisting === 'existing' && (
              <button onClick={() => onPublish()} /* className="button button-primary" */
                className={!hasChanges ? "button button-primary" : "button button-primary disabled"}>
                Publish
              </button>
            )}
          </div>

        </div>

        {neworexisting === 'new' && (
          <h1 >New {pagetitle}</h1 >
        )}
        {neworexisting === 'existing' && (
          <h1> Edit {pagetitle}</h1>
        )}

        {(filteredFieldsS.length === 0) && (
          <div className="emptyfields">
            <h2>No fields found</h2>
            <p>Please add a field to get started.</p>
          </div>
        )}

        {/* (mergedfields.length > 0) && mergedfields.map((field) => { */

          (filteredFieldsS.length !== 0) && filteredFieldsS.map((field) => {
            // const fieldData = useSelector((state) => state.PagesSlice.fields[field.name]) || {};
            //  console.log(field, 'field555555')
            //   console.log(field.name, "field.name111");
            let fieldData1 = fieldData[field.name] || {};
            // console.log(fieldData1, "fieldData1");
            //console.log(fieldData1.id, "fieldData1.content");
            return (
              <FieldRenderer
                key={field.name}
                type={field.type}
                name={field.name}
                label={field.name}
                fielddata={fieldData1}
                value={fieldData1.content || ""}
                onChange2={(e) => {

                  setHasChanges(true);
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