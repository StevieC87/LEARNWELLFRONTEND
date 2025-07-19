'use client';
import '../editpage.css'
import { useEffect, useState } from 'react';
import { ObjectId } from 'bson';
import FieldRenderer from '../FieldRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, setSlugDuplicateWarning, setTriggerSEORefresh, setHasChanges } from '../../../../../redux/slices/PagesSlice';
import { setSelectedLanguage, setMultilingualSharedId, setPageExistsThisLanguage } from '../../../../../redux/slices/DashSlice';
import { useRouter } from 'next/navigation';
import { set } from 'react-hook-form';

export default function PageContentTab(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  //.  GET DATA FROM PROPS  ------------------------

  const { schema, settings, pagefieldsdata, pagedata, neworexisting, pageid, pagetype, language, pagetitle, publishstatus, triggerrefreshonsavechild, frontendcomponent,
    numberofdrafts, latestdraftcreationdate, remainingdraftsv, precedingdraftsv, totalnumberofdraftsv, islatestversion
  } = props;
  //console.log('remainingdraftsv prop', remainingdraftsv);
  //console.log('precedingdraftsv prop', precedingdraftsv);
  // console.log('totalnumberofdraftsv prop', totalnumberofdraftsv);
  console.log(pagefieldsdata, "pagefieldsdatafromprops");
  const [pagefields, setPageFields] = useState(schema.fields);
  const [pagefieldsdataS, setPageFieldsDataS] = useState(pagefieldsdata || []);
  const [pagedataS, setPageDataS] = useState(pagedata);
  //. --------------------------

  //const pageid = pagedata._id; //string
  const fieldData = useSelector((state) => state.PagesSlice.fields);
  //..................... FILTERING FIELDS 
  const [filteredFieldsS, setFilteredFieldsS] = useState([]);
  const [initialmerge, setInitialMerge] = useState(false);
  //..................... UI STATES 

  //..................... LANGUAGE RELATED STATES 
  const [multilingalBool, setMultilingualBool] = useState(settings.ismultilingual);
  const [multilingualLangs, setMultilingualLangs] = useState(settings.languages || []);
  const [defaultlang, setDefaultLang] = useState(settings.defaultlanguage || null);
  const multilingualsharedid = useSelector((state) => state.DashSlice.multilingualsharedid);
  const pageexiststhislanguage = useSelector((state) => state.DashSlice.pageexiststhislanguage);
  const selectedLanguage = useSelector((state) => state.DashSlice.selectedLanguage);
  const defaultlanguage = useSelector((state) => state.DashSlice.settings.defaultlanguage);
  const [languageui, setLanguageUI] = useState(language || defaultlanguage || "");

  const reduxtitlefield = useSelector((state) => state.PagesSlice.fields?.title) || '';
  const reduxrelationfield = useSelector((state) => state.PagesSlice.fields?.relation) || '';
  const reduxslugfield = useSelector((state) => state.PagesSlice.fields?.slug) || '';
  const reduxslugpathfield = useSelector((state) => state.PagesSlice.fields?.slugpath) || '';
  console.log(reduxslugpathfield, "reduxslugpathfieldreduxslugpathfieldreduxslugpathfieldreduxslugpathfield");
  const hasChanges = useSelector((state) => state.PagesSlice.hasChanges) || false;
  //  const [hasChanges, setHasChanges] = useState(false);
  const [issaving, setIsSaving] = useState(false);
  const [showsaved, setShowSaved] = useState(false);
  const [ispublishing, setIsPublishing] = useState(false);
  const [publishchanges, setPublishchange] = useState(false);
  const [errorsave, setErrorSave] = useState(false);
  const [publishswitchstatus, setPublishSwitchStatus] = useState(publishstatus || false);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const [totalnumberofdrafts, setNumberOfDrafts] = useState(totalnumberofdraftsv || 0);
  const [remainingdrafts, setRemainingDrafts] = useState(remainingdraftsv || 0);
  const [precedingdrafts, setPrecedingDrafts] = useState(precedingdraftsv);

  const [allowsavewithoutchanges, setAllowSaveWithoutChanges] = useState(false);
  //we allow set ont he front end - not on the backend 

  const [currentdraftcreationdate, setCurrentDraftCreationDate] = useState(latestdraftcreationdate);

  const userrole = useSelector((state) => state.DashSlice.userrole) || '';

  // const [clickedundo, setClickedUndo] = useState(false);

  useEffect(() => {
    console.log(currentdraftcreationdate, "currentdraftcreationdatefromuseeffect");
  }, [currentdraftcreationdate])
  const [initialonloadlatestedraftcreationdate, setInitialOnLoadLatestDraftCreationDate] = useState(latestdraftcreationdate);
  //LEAVE MAYBE REDUX LATER if logic turns oout we need it
  /*   const currentdraftpagecreationdate = useSelector((state) => state.PagesSlice.currentdraftpagescreationdate) || ''; */


  //field from medialibarary
  // const selectedImagefromGalleryModal = useSelector((state) => state.UISlice.selectedImagefromGalleryModal) || '';

  function getCsrfToken() {
    if (typeof document !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrfToken='))
        ?.split('=')[1];
    }
    return null; // Return null if running on the server
  }
  const csrfToken = getCsrfToken();

  const slugpathfieldaR = useSelector((state) => state.PagesSlice.fields?.slugpath) || '';
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

  //WHEN click save -> and it refreshes the fetch , update the pagefieldsdataS state so it is reflected in the UI
  useEffect(() => {
    setPageFieldsDataS(pagefieldsdata);
  }, [pagefieldsdata])

  //to show message if slug existed and was renamed
  // const [slugduplicatewarning, setSlugDuplicateWarning] = useState(false);

  // const [selectedLang, setSelectedLang] = useState(defaultlang || multilingualLangs[0] || null);

  //. MERGE SCHEMA FIELDS WITH PAGEFIELDSDATA
  // (if new page:we just we create id, add locale)

  useEffect(() => {
    //,merge pagefields with pagefieldsdata
    console.log(pagefields, "pagefieldspagefields55");
    console.log(pagefieldsdataS, "pagefieldsdataSsasas");
    const mergedinitial = pagefields.map((fieldObj) => {
      console.log(fieldObj, 'fieldObj')
      const match = pagefieldsdataS.find((item) => item.name === fieldObj.name);
      console.log(match, "match3333333333");

      //  let createID = new ObjectId().toString();
      return {
        ...fieldObj,
        content: match ? match.content : '',
        id: match ? match._id : null, //createID
        locale: match ? match.locale : languageui || defaultlanguage || null,
        type: fieldObj.type,
        name: fieldObj.name || match?.field || null,
        schema: match ? match.schema : null,
        belongsto: fieldObj.belongsto || pageid || null,
        createdAt: fieldObj.createdAt || null,
        required: fieldObj.required || null,
        placeholder: fieldObj.placeholder || null,
        label: fieldObj.label || match?.label || null,
        fields: fieldObj.fields || null,
        relation: fieldObj.relation || '', //for relation field
        //  pagename: match.pagename,
      };
    }

      // let createID = new ObjectId().toString();
      // id: match ? match._id : createID,
    );
    console.log(mergedinitial, "mergedinitial");

    //remove them from the array
    const removedstandardfields = mergedinitial.filter((field) => field.name !== 'title' && field.name !== 'slug' && field.name !== 'slugpath');
    console.log(removedstandardfields, "removedstandardfields");

    setInitialMerge(removedstandardfields);
    setFilteredFieldsS(removedstandardfields);

    //, SET THE MERGED FIELDS TO REDUX STORE
    mergedinitial.forEach((item) => {
      console.log(item, 'mergedinitialitem')
      dispatch(updateField({
        name: item.name, content: item.content, id: item.id, locale: item.locale, type: item.type, schema: item.schema, belongsto: item.belongsto, createdAt: item.createdAt, required: item.required, placeholder: item.placeholder, label: item.label, fields: item.fields, relation: item.relation //for relation field
      }));
    }
    )
  }, [pagefields, pagefieldsdataS, languageui])

  useEffect(() => {
    console.log(totalnumberofdrafts, "totalnumberofdrafts");
    console.log(remainingdrafts, "remainingdrafts");
    console.log(precedingdrafts, "precedingdraftsUSEEFFECT");
  }, [totalnumberofdrafts, remainingdrafts, precedingdrafts])

  const changelanguage = async (e) => {
    console.log(language, "language from changelanguage");
    setLanguageUI(e.target.value);


  }

  //. ON SAVE FUNCTION ========================

  const triggerSEOrefresh = useSelector((state) => state.PagesSlice.triggerSEOrefresh);
  console.log(triggerSEOrefresh, "triggerSEOrefresh");

  const onSave = async (e, contextundo, nochangescozundonsave) => {
    e.preventDefault();

    setPublishchange(true)
    setIsSaving(true);
    function getCsrfToken() {
      if (typeof document !== 'undefined') {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith('csrfToken='))
          ?.split('=')[1];
      }
      return null; // Return null if running on the server
    }
    const csrfToken = getCsrfToken();

    let url = `${process.env.NEXT_PUBLIC_API_URL}/pagesposts/schema`;
    let nochangesonlyundosave;
    if (nochangescozundonsave === 'nochangescozundonsave') {
      nochangesonlyundosave = true;
    }
    console.log(nochangesonlyundosave, "nochangesonlyundosave");

    //we do fetch post to backend


    //FIRST WE GET EVERYTHING FROM THE REDUX STORE
    //NEXT_PUBLIC_API_URL 
    console.log(url, "url");
    console.log(languageui, "languageuilanguageuilanguageuilanguageui");
    console.log(fieldData, 'fielddataonsave')
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-CSRF-Token': csrfToken, // Include CSRF token in the headers
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
        frontendcomponent: frontendcomponent, //frontend component name
        currentdraftcreationdate: currentdraftcreationdate, //this is so we can delete any later drafts (assuming user did undo and changed stuff)
        haschanges: hasChanges, //this is so we can delete any later drafts (assuming user did undo and changed stuff)
        nochangesonlyundosave: nochangesonlyundosave


      }),
    })

    if (!response.ok) {
      setErrorSave(true);
      console.log(response, "response not ok");
      //print error message
      const errorData = await response.json();
      console.log(errorData, "errorData");
      if (errorData.errorthing === "titlemissing") {
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
      setCurrentDraftCreationDate(data.lastinsertdraftcreationdate);

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
        setIsTransitioning(true); // Start the transition
        setTimeout(() => {
          router.replace(url); // Navigate to the new route
          setIsTransitioning(false); // End the transition
        }, 300); // Duration matches the CSS animation
        router.replace(url);

      }
      else if (neworexisting === "existing") {
        if (!contextundo) {
          triggerrefreshonsavechild();
        }
      }
      setNumberOfDrafts(data.totalnumberofdrafts);
      setRemainingDrafts(data.remainingdrafts);
      console.log('remainingdraftsONSAVE', data.remainingdrafts);
      console.log('precedingdraftsONSAVE', data.precedingdrafts);
      setPrecedingDrafts(data.precedingdrafts);
      console.log('triggerSEOrefresh22', triggerSEOrefresh);

      dispatch(setTriggerSEORefresh(triggerSEOrefresh + 1));
      setShowSaved(true);

      setTimeout(() => {
        setShowSaved(false);
      }, 2000);
      // Trigger refresh in parent component

    }
    //  setHasChanges(false);
    dispatch(setHasChanges(false)); // Reset hasChanges state in Redux
    // Trigger SEO refresh in parent component
    return true;

  }

  //. ON PUBLISH FUNCTION ========================  
  const onPublish = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/pagesposts/publish`;
    setIsPublishing(true);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-CSRF-Token': csrfToken, // Include CSRF token in the headers
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
        slug: fieldData.slug ? fieldData.slug.content : "",
        slugpath: fieldData.slugpath ? fieldData.slugpath.content : "", //slug field
        multilingalBool: multilingalBool,
        frontendcomponent: frontendcomponent, //frontend component name
      }),
    })
    console.log(response, "response55555555");
    if (response.ok) {
      const data = await response.json();
      setIsSaving(false);
      setPublishchange(false);
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
      triggerrefreshonsavechild()
      setTimeout(() => {
        setIsPublishing(false);
      }, 2000);
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
    if (!publishswitchstatus) {
      onPublish()
    }
    console.log("change publish status");
    let url = `${process.env.NEXT_PUBLIC_API_URL}/pagesposts/changepublishstatus`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-CSRF-Token': csrfToken, // Include CSRF token in the headers
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({
        pageid: pageid,
        published: !publishswitchstatus, //toggle the publish status
        pagetype: pagetype, // 'page' or 'post'
        //!change this 
      }),

    });


    if (response.ok) {
      const data = await response.json();
      console.log(data, "data from change publish status");
      let responsepublihsed = data.published;
      setPublishSwitchStatus(responsepublihsed);
    }
  }

  const preview = async () => {
    let slug = reduxslugpathfield.content;
    let previewtoken;
    console.log(slug, "slugfrombutton");
    //createpreviewtoken
    const createpreviewtoken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/createpreviewtoken`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    })
    if (!createpreviewtoken.ok) {
      console.log(createpreviewtoken, "createpreviewtoken not ok");
      return;
    }
    else {
      console.log(createpreviewtoken, "createpreviewtoken ok");
      let data = await createpreviewtoken.json();
      previewtoken = data.previewtoken;
      console.log(previewtoken, "previewtokenfromcreatepreviewtoken");
      window.open(`http://localhost:3001${slug}?preview=true&previewtoken=${previewtoken}`);
    }



  }

  const undoredo = async (e, undoredo) => {
    e.preventDefault();
    console.log('helloooooooo')
    //WE SHOULDNT SAVE IF LAST VERSION
    //coz then overwrites with 
    let haschangesforundo = false; //THIS IT NOT SKIP ONE BACK 
    let previousdraftcreationdate = currentdraftcreationdate;
    if (hasChanges) {
      await new Promise(async (resolve) => {
        let savefirst = await onSave(e, true);
        haschangesforundo = true;
        if (!savefirst) {
          console.log("onSave fail skip undoredo");
          return resolve(false);
        }
        setCurrentDraftCreationDate(previousdraftcreationdate);
        resolve(true);
      });
      /*  let savefirst = await onSave(e, true);
       haschangesforundo = true;
 
       if (!savefirst) {
         console.log("onSave did not return true, skipping undoredo");
         return;
       }
       setCurrentDraftCreationDate(previousdraftcreationdate) */
    }
    //put this in other variable/usestate after
    // let currentdraftpagescreationdate = "";
    console.log(undoredo, "undoredo");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pagesposts/undoredo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken, // Include CSRF token in the headers
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({
        pageid: pageid,
        undoorredo: undoredo, // 'undo' or 'redo'
        currentdraftpagecreationdate: currentdraftcreationdate,
        haschangesforundo: haschangesforundo,
        pagetype: pagetype,
      }),
    });
    if (!response.ok) {
      console.log(response, "response not ok");
      return;
    }
    const data = await response.json();
    const fieldsfromundoredo = data.fields;
    console.log(fieldsfromundoredo, "fieldsfromundoredo");
    console.log(data.creationdate, "data.creationdate");
    setCurrentDraftCreationDate(data.creationdate);


    setPageFieldsDataS(fieldsfromundoredo);
    //note: creationdate is a string

    console.log('remainingdrafts', data.remainingdrafts);
    console.log('precedingdrafts', data.precedingdrafts);
    console.log('totalnumberofdrafts222', data.totalnumberofdrafts);

    setRemainingDrafts(data.remainingdrafts);
    setPrecedingDrafts(data.precedingdrafts);
    setNumberOfDrafts(data.totalnumberofdrafts);
    setAllowSaveWithoutChanges(true);


    console.log(data, "data from undoredo");

    //! now replace field values... 

  }
  const [pagecontent, setPageContent] = useState(true);
  const [seocontentvisible, setSEOVisible] = useState(false);
  const [jsonldvisible, setJsonldVisible] = useState(false);
  const toggleTabs = (tab) => {
    if (tab === "metatags") {
      setSEOVisible(true);
      setJsonldVisible(false);
    } else if (tab === "jsonld") {
      setSEOVisible(false);
      setJsonldVisible(true);
    }
  }


  return (
    <>
      <div className={`editpagecontainer fade-in2 ${isTransitioning ? '' : 'visible'} flex flex-column`}>
        <form onSubmit={(e) => {
          if (!hasChanges & !allowsavewithoutchanges) {
            e.preventDefault();
            return;
          }
          else if
            (!hasChanges & allowsavewithoutchanges) {
            onSave(e, false, 'nochangescozundonsave')
          }
          else {
            onSave(e, false);
          }
        }
        }>
          <div className="topbuttons flex flex-row gap-5 items-start justify-between">
            <div className="flex flex-row gap-5 items-start">
              {neworexisting === 'existing' && (
                <div id="undoredo" className="undoredo flex gap-3 ">
                  <button onClick={(e) => undoredo(e, 'undo')} id="undobutton" className={`${precedingdrafts > 0 ? "" : "text-gray-400"} button button-outline button-noborder`}

                    disabled={precedingdrafts <= 0 ? true : false}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                      <title>Undo</title>
                      <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
                      <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
                    </svg>
                  </button>
                  <button onClick={(e) => undoredo(e, 'redo')} id="redobutton" className={`${remainingdrafts > 0 ? "" : "text-gray-400"}  button button-outline button-noborder`}
                    disabled={remainingdrafts <= 0 ? true : false}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                      <title>Redo</title>
                      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                    </svg>
                  </button>
                </div>
              )}
              <button id="savedraft" type="submit" className={hasChanges ? "button button-primary button-thin savedraftbutton" : "button button-outline button-thin savedraftbutton"}>
                {issaving && (
                  <span>Saving</span>
                )}

                {!issaving && !showsaved && (
                  <span>Save Draft</span>
                )}
                {errorsave && (
                  <span className="text-red-500">Error</span>
                )}
                {showsaved && !issaving && (
                  <span className="text-green-500">Saved</span>
                )}

              </button>
              {neworexisting === 'existing' && (
                <button className="fontprimarycolor button button-outline button-noborder" onClick={() => preview()} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                    <title>Preview draft</title>

                    <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
                    <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
                  </svg>
                </button>

              )}
            </div>

            <div className="flex flex-row gap-5 items-start">

              {neworexisting === 'existing' && (
                <>
                  <div className="flex flex-row gap-5">

                    {userrole !== 'contributor' && (
                      <button className={`${publishchanges ? 'button' : 'button button-outline button-noborder'}`}
                        onClick={() => onPublish()}
                      >
                        <>
                          {!ispublishing && (
                            publishchanges ? 'Publish Changes' : 'Publish'
                          )}
                          {ispublishing && (
                            <span> Published</span>
                          )}

                        </>

                      </button>
                    )}




                    <a href={`${process.env.NEXT_PUBLIC_FRONTENDURL}/${slugpathfieldaR.content}`} target="_blank" rel="noopener noreferrer" className="button button-outline button-noborder">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                        <title>View Published Page live</title>
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                      </svg>
                    </a>

                  </div>

                  <div className="flex flex-col">
                    <div className="switchbuttonmulti flex flex-row items-center">

                      <label htmlFor="">Published: </label>
                      <label className="switch  ml-5">
                        <input type="checkbox" onChange={() => changePublish()} checked={publishswitchstatus} disabled={
                          pagetype === 'page' ? true : false || userrole === 'contributor' ? true : false

                        }

                        />
                        <span className={userrole === 'contributor' ? 'slider round cursor-not-allowed ' : 'cursor-pointer slider round'}></span>

                      </label>

                    </div>
                    <div>
                      {publishswitchstatus && (
                        <span className={!islatestversion ? 'text-red-900 fontsize1p2' : 'fontsize1p2'} >{islatestversion ? 'Latest Draft Published' : 'Unpublished Changes'
                        }</span>
                      )}
                    </div>


                  </div>
                </>
              )}

            </div>



          </div>

          <div>

            <FieldRenderer
              key={reduxtitlefield?.name}
              type={reduxtitlefield?.type}
              name={reduxtitlefield?.name}
              label=''
              fielddata={reduxtitlefield || ''}
              placeholder="Add title"
              value={reduxtitlefield.content || ""}
              onChange2={(e) => {
                //setHasChanges(true);
                dispatch(setHasChanges(true));
                setIsPublishing(false); // Reset publishing state when title changes
              }}
              inputcssclass="titleinput"
              inputdivcssclass="titleinputdiv"
              labelcssclass="titlelabel"
              required={reduxtitlefield.required || false}
            />

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
          <FieldRenderer
            key={reduxslugfield?.name}
            type={reduxslugfield?.type}
            name={reduxslugfield?.name}
            /* label={titlefield?.label || titlefield?.name} */
            label={reduxslugfield?.label || reduxslugfield?.name}
            fielddata={reduxslugfield || ''}
            /* placeholder={titlefield?.placeholder || ""} */
            placeholder={reduxslugfield.placeholder || "Add slug"}
            value={reduxslugfield.content || ""}
            onChange2={(e) => {
              // setHasChanges(true);
              dispatch(setHasChanges(true));
              setIsPublishing(false);
            }}
          />
          <FieldRenderer
            key={reduxslugpathfield?.name}
            type={reduxslugpathfield?.type}
            name={reduxslugpathfield?.name}
            /* label={titlefield?.label || titlefield?.name} */
            label={reduxslugpathfield?.label || reduxslugpathfield?.name}
            fielddata={reduxslugpathfield || ''}
            /* placeholder={titlefield?.placeholder || ""} */
            placeholder={reduxslugpathfield.placeholder || "Add slug path e.g: /articles/webdesign/myarticletitle) (leave empty for default: /articles/myarticletitle)"}
            value={reduxslugpathfield.content || ""}
            reduxrelationfield onChange2={(e) => {
              //setHasChanges(true);
              dispatch(setHasChanges(true));
              setIsPublishing(false);
            }}
          />
          {(filteredFieldsS.length !== 0) && filteredFieldsS.map((field) => {
            console.log(field, 'fieldfieldfield')  // const fieldData = useSelector((state) => state.PagesSlice.fields[field.name]) || {};
            //  console.log(field, 'field555555')
            //   console.log(field.name, "field.name111");

            let fieldData1 = fieldData[field.name] || {};
            console.log(fieldData1, "fieldData1");
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
                  dispatch(setHasChanges(true));
                  //setHasChanges(true);
                  setIsPublishing(false);
                }}
                required={field.required || false}
                disabled={field.disabled || false}
                autofocus={field.autofocus || false}
                fields={field.fields || null}
                relation={field.relation || ''} //for relation field


              />

            )
          })}

        </form >
      </div >

    </>
  )
}