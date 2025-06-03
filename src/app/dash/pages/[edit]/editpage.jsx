'use client';
import './editpage.css'
import { useEffect, useState } from 'react';
import { ObjectId } from 'bson';
import FieldRenderer from './FieldRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, setSlugDuplicateWarning } from '../../../../redux/slices/PagesSlice';
import { setSelectedLanguage, setMultilingualSharedId, setPageExistsThisLanguage } from '../../../../redux/slices/DashSlice';
import { useRouter } from 'next/navigation';

export default function EditPageComp(props) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { schema, settings, pagefieldsdata, pagedata, neworexisting, pageid, pagetype, language, pagetitle, publishstatus, triggerrefreshonsavechild } = props;

  //.  GET DATA FROM PROPS  ------------------------ 
  console.log(schema, "schema1234");
  console.log(settings, "settings");
  console.log(pagedata, "pagedata123");
  console.log(pagefieldsdata, "pagefieldsdata777777777");
  console.log(neworexisting, "neworexisting1234");
  console.log(pageid, "pageid");
  console.log(pagetype, "pagetype1234");
  console.log(language, "language1234");


  //const pagetitle = schema?.title;
  const [pagetitles, setPageTitle] = useState(pagetitle);
  const [pagefields, setPageFields] = useState(schema.fields);
  const [pagedataS, setPageDataS] = useState(pagedata);

  //. --------------------------

  //const pageid = pagedata._id; //string
  const fieldData = useSelector((state) => state.PagesSlice.fields);

  //..................... FILTERING FIELDS 

  const [filteredFieldsS, setFilteredFieldsS] = useState([]);
  const [initialmerge, setInitialMerge] = useState(false);

  //..................... UI STATES 
  const [issaving, setIsSaving] = useState(false);
  const [errorsave, setErrorSave] = useState(false);
  const [showsaved, setShowSaved] = useState(false);
  //to prevent publishing if made changes prior to publishing
  const [hasChanges, setHasChanges] = useState(true);

  const [publishswitchstatus, setPublishSwitchStatus] = useState(publishstatus);

  //..................... LANGUAGE RELATED STATES 
  const [multilingalBool, setMultilingualBool] = useState(settings.ismultilingual);
  const [multilingualLangs, setMultilingualLangs] = useState(settings.languages || []);
  const [defaultlang, setDefaultLang] = useState(settings.defaultlanguage || null);
  const multilingualsharedid = useSelector((state) => state.DashSlice.multilingualsharedid);
  const pageexiststhislanguage = useSelector((state) => state.DashSlice.pageexiststhislanguage);
  const selectedLanguage = useSelector((state) => state.DashSlice.selectedLanguage);
  const defaultlanguage = useSelector((state) => state.DashSlice.settings.defaultlanguage);
  const [languageui, setLanguageUI] = useState(language || defaultlanguage || "");

  //,set multilingual state from props + depedency
  useEffect(() => {
    console.log(multilingalBool, "multilingalBool77777");
    console.log(defaultlanguage, "defaultlanguage44444");
    console.log(language, "language44444");
    console.log(typeof language, "typeof language44444");
    if (!language) {
      console.log(language, "language44444 from useeffect");
      setLanguageUI(defaultlanguage);
    }
    else {
      setLanguageUI(language);
    }

  }, [language, defaultlanguage])
  //to show message if slug existed and was renamed
  // const [slugduplicatewarning, setSlugDuplicateWarning] = useState(false);

  // const [selectedLang, setSelectedLang] = useState(defaultlang || multilingualLangs[0] || null);

  //. MERGE SCHEMA FIELDS WITH PAGEFIELDSDATA
  // (if new page:we just we create id, add locale)
  useEffect(() => {
    //,merge pagefields with pagefieldsdata
    const mergedinitial = pagefields.map((fieldObj) => {
      const match = pagefieldsdata.find((item) => item.field === fieldObj.name);
      console.log(match, "match3333333333");
      let createID = new ObjectId().toString();
      return {
        ...fieldObj,
        content: match ? match.content : '',
        _id: match ? match._id : createID,
        locale: match ? match.locale : languageui || defaultlanguage || null,
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

    //, SET THE MERGED FIELDS TO REDUX STORE
    mergedinitial.forEach((item) => {
      dispatch(updateField({ name: item.name, content: item.content, id: item._id, locale: item.locale, type: item.type, schema: item.schema }));
    }
    )
  }, [pagefields, pagefieldsdata, languageui])

  const changelanguage = async (e) => {
    console.log(language, "language from changelanguage");
    setLanguageUI(e.target.value);


  }

  //. ON SAVE FUNCTION ========================
  const onSave = async (e) => {
    e.preventDefault();
    setHasChanges(false);
    setIsSaving(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/schema`;

    //we do fetch post to backend


    //FIRST WE GET EVERYTHING FROM THE REDUX STORE
    //NEXT_PUBLIC_API_URL 
    console.log(url, "url");
    console.log(languageui, "languageuilanguageuilanguageuilanguageui");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //  Authorization: `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({
        schemaname: schema.name,
        fields: fieldData,
        pageid: pageid,
        locale: languageui,
        schema: pagedataS.schema,
        pagetype: pagetype,
        pagedata: pagedataS,
        neworexisting: neworexisting,
        multilingualsharedid: multilingualsharedid,
        pageexiststhislanguage: pageexiststhislanguage,
        slugpath: fieldData.slugpath ? fieldData.slugpath.content : "", //slug field
        multilingalBool: multilingalBool,

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
      const language = data.language;
      const schema = data.schema;
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
        const url = `${pageid}?pagetype=${pagetype}&schema=${schema}&language=${language}`;
        router.replace(url);

      }
      setShowSaved(true);

      setTimeout(() => {
        setShowSaved(false);
      }, 2000);
      triggerrefreshonsavechild(); // Trigger refresh in parent component

    }
    setHasChanges(false);

  }

  //. ON PUBLISH FUNCTION ========================  
  const onPublish = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/publish`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //  Authorization: `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({
        schemaname: schema.name,
        fields: fieldData,
        pageid: pageid,
        locale: languageui,
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
      setPublishSwitchStatus(true);
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

  //! i need to get existing publish status from the db
  //i gues in the backend before i send it 
  //publishswitchstatus, setPublishSwitchStatus]
  const changePublish = async () => {
    //with previous thing

    console.log("change publish status");
    let url = `${process.env.NEXT_PUBLIC_API_URL}/changepublishstatus`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({
        pageid: pageid,
        published: !publishswitchstatus, //toggle the publish status
        //!change this 
      }),

    });
    setPublishSwitchStatus(setPublishSwitchStatus => !setPublishSwitchStatus);

    if (response.ok) {
      const data = await response.json();
      console.log(data, "data from change publish status");
    }
  }

  return (
    <>
      <div className="editpagecontainer">
        <form onSubmit={(e) => onSave(e)} >
          <div className="topbuttons">
            {neworexisting === 'new' && (
              <h1 >Create {schema.name} {pagetype.charAt(0).toUpperCase() + pagetype.slice(1)} </h1 >
            )}
            {neworexisting === 'existing' && (
              <h1> Edit {schema.name}  {pagetype.charAt(0).toUpperCase() + pagetype.slice(1)} : {pagetitles}</h1>
            )}
            <div className="flex flex-col gap-5">
              <div className="flex flex-row gap-5">
                {/* onClick={(e) => onSave(e)} */}
                <button type="submit" className="button button-primary">
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
              {neworexisting === 'existing' && (
                <div className="switchbuttonmulti flex flex-row items-center">

                  <label htmlFor="">Published: </label>
                  <label className="switch  ml-5">
                    <input type="checkbox" onChange={() => changePublish()} checked={publishswitchstatus} disabled={pagetype === 'page' ? true : false} />
                    <span className="slider round"></span>
                  </label>

                </div>
              )}
            </div>

          </div>


          <div className="flex flex-row items-center">
            {multilingualLangs && (
              <div className="langpicker flex flex-row gap-5">


                {(multilingalBool && pagetype === 'post' && neworexisting === 'new') &&
                  (
                    <div className="flex flex-row gap-2">
                      <label htmlFor="lang" className="block text-sm font-medium text-gray-700 self-center">
                        Language: </label>
                      <select name="" id=""
                        onChange={(e) => changelanguage(e)}
                        value={languageui}
                      >
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
                {((multilingalBool && neworexisting === 'existing') || multilingalBool && neworexisting === 'new' && pagetype == 'page') && (
                  <div className="flex flex-row gap-2">
                    <label htmlFor="lang" className="block text-sm font-medium text-gray-700 self-center">
                      Language: </label>
                    <span>{languageui}</span>
                  </div>
                )}

              </div>
            )}
          </div>
          {(filteredFieldsS.length === 0) && (
            <div className="emptyfields">
              <h2>No fields found</h2>
              <p>Please add a field to get started.</p>
            </div>
          )}

          {(filteredFieldsS.length !== 0) && filteredFieldsS.map((field) => {
            // const fieldData = useSelector((state) => state.PagesSlice.fields[field.name]) || {};
            //  console.log(field, 'field555555')
            //   console.log(field.name, "field.name111");
            let fieldData1 = fieldData[field.name] || {};
            //console.log(fieldData1, "fieldData1");
            //console.log(fieldData1.id, "fieldData1.content");
            return (
              <FieldRenderer
                key={field.name}
                type={field.type}
                name={field.name}
                label={field.label || field.name}
                fielddata={fieldData1}
                placeholder={field.placeholder || ""}
                value={fieldData1.content || ""}
                onChange2={(e) => {

                  setHasChanges(true);
                }}
                required={field.required || false}
                disabled={field.disabled || false}

              />

            )
          })}
        </form>
      </div>

    </>
  )
}