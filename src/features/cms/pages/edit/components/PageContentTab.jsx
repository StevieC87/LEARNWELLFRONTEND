'use client';
import '../editpage.css'
import { useEffect, useRef, useState } from 'react';
import FieldRenderer from '../FieldRenderer';
import VisualPreview from './VisualPreview';
import BlocksField from './BlocksField';
import { foldBlocks, unfoldBlocks, previewTypes, blocksLayout, blockActions } from '../blocks';
import MediaComponent from '@/features/cms/media/Mediacomponent';
import { setShowMediaLibraryModal, setCallingFrom } from '@/redux/slices/UISlice';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, setSlugDuplicateWarning, setTriggerSEORefresh, setHasChanges, setCurrentImageField } from '@/redux/slices/PagesSlice';
import { setSelectedLanguage, setMultilingualSharedId, setPageExistsThisLanguage } from '@/redux/slices/DashSlice';
import { useRouter } from 'next/navigation';
import { set } from 'react-hook-form';

// Save refusals said in the editor's words, by the server's errorthing; any
// other refusal shows the server's own error text.
const SAVE_MESSAGES = {
  badslugpath: "That address can't contain . or .. and must stay under its language.",
};

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

  // visual editor: the page in a frame next to the fields
  const formRef = useRef(null);
  // 'fields' = form only, 'split' = form + page, 'page' = only the page, typed on directly
  const [view, setView] = useState('fields');
  const visual = view !== 'fields';
  const [autosavePending, setAutosavePending] = useState(false); // after a section change in page view

  // save/publish errors from the server (edit conflict, required fields...)
  const [serverMessage, setServerMessage] = useState('');
  // the page's lastModified this editor has - the server refuses a save if someone saved after it
  const lastModifiedRef = useRef(pagedata?.lastModified || null);
  useEffect(() => {
    if (pagedata?.lastModified) lastModifiedRef.current = pagedata.lastModified;
  }, [pagedata?.lastModified]);
  const [previewReload, setPreviewReload] = useState(0);
  //we allow set ont he front end - not on the backend 

  // ── Inline "Add Field" state (only for dynamic content types) ──────────────
  const INLINE_FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'wysi', label: 'Rich Text (WYSIWYG)' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean (toggle)' },
    { value: 'datetime', label: 'Date & Time' },
    { value: 'select', label: 'Select (dropdown)' },
    { value: 'medialibrary', label: 'Media Library' },
    { value: 'relation', label: 'Relation' },
    { value: 'url', label: 'URL' },
    { value: 'email', label: 'Email' },
    { value: 'color', label: 'Color' },
    { value: 'blocks', label: 'Sections (blocks)' },
  ];
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [addFieldError, setAddFieldError] = useState('');
  const [addFieldSaving, setAddFieldSaving] = useState(false);

  function toFieldName(str) {
    return str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  }

  const addFieldInline = async () => {
    const safeName = newFieldName ? toFieldName(newFieldName) : toFieldName(newFieldLabel);
    if (!safeName) { setAddFieldError('Name is required'); return; }
    if (!/^[a-z][a-z0-9_]*$/.test(safeName)) { setAddFieldError('Lowercase letters, numbers, underscores only'); return; }
    const allExistingNames = pagefields.map((f) => f.name);
    if (allExistingNames.includes(safeName)) { setAddFieldError('A field with this name already exists'); return; }
    setAddFieldError('');
    setAddFieldSaving(true);
    try {
      function getC() {
        if (typeof document === 'undefined') return null;
        return document.cookie.split('; ').find((r) => r.startsWith('csrfToken='))?.split('=')[1];
      }
      // adds one field - the schema here can be role-filtered, so never PUT the whole list from the editor
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contenttypes/${schema.contentTypeId}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': getC() },
        credentials: 'include',
        body: JSON.stringify({ name: safeName, label: newFieldLabel || safeName, type: newFieldType }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Error saving field — please try again');
      const newField = data.field;
      const updatedFields = [...pagefields, newField];
      // Update local states so the new field renders immediately
      setPageFields(updatedFields);
      const removedStd = updatedFields.filter((f) => f.name !== 'title' && f.name !== 'slug' && f.name !== 'slugpath');
      setFilteredFieldsS(removedStd);
      dispatch(updateField({
        name: newField.name, content: '', id: null, locale: languageui || defaultlanguage || null,
        type: newField.type, belongsto: pageid, required: false, placeholder: '', label: newField.label,
      }));
      setNewFieldName('');
      setNewFieldLabel('');
      setNewFieldType('text');
      setShowAddField(false);
    } catch (err) {
      setAddFieldError(err.message);
    } finally {
      setAddFieldSaving(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const [currentdraftcreationdate, setCurrentDraftCreationDate] = useState(latestdraftcreationdate);

  const userrole = useSelector((state) => state.DashSlice.userrole) || '';

  // const [clickedundo, setClickedUndo] = useState(false);

  useEffect(() => {
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
    if (!language) {
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
    const mergedinitial = pagefields.map((fieldObj) => {
      const match = pagefieldsdataS.find((item) => item.name === fieldObj.name);

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

    //remove them from the array
    const removedstandardfields = mergedinitial.filter((field) => field.name !== 'title' && field.name !== 'slug' && field.name !== 'slugpath');

    setInitialMerge(removedstandardfields);
    setFilteredFieldsS(removedstandardfields);

    //, SET THE MERGED FIELDS TO REDUX STORE
    mergedinitial.forEach((item) => {
      dispatch(updateField({
        name: item.name, content: item.content, id: item.id, locale: item.locale, type: item.type, schema: item.schema, belongsto: item.belongsto, createdAt: item.createdAt, required: item.required, placeholder: item.placeholder, label: item.label, fields: item.fields, relation: item.relation //for relation field
      }));
      // sections: each block field gets its own redux field (see ../blocks.js)
      if (item.type === 'blocks') {
        unfoldBlocks(item.name, item.content, schema.blocktypes).forEach((sub) => {
          dispatch(updateField({ ...sub, locale: item.locale, belongsto: item.belongsto }));
        });
      }
    }
    )
  }, [pagefields, pagefieldsdataS, languageui])

  useEffect(() => {
  }, [totalnumberofdrafts, remainingdrafts, precedingdrafts])

  const changelanguage = async (e) => {
    setLanguageUI(e.target.value);


  }

  //. ON SAVE FUNCTION ========================

  const triggerSEOrefresh = useSelector((state) => state.PagesSlice.triggerSEOrefresh);

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

    //we do fetch post to backend


    // cleared now, not after the response: an edit made while the request is in flight sets it
    // again and must stay marked unsaved. A failed save puts it back.
    const hadChanges = hasChanges;
    dispatch(setHasChanges(false));

    //FIRST WE GET EVERYTHING FROM THE REDUX STORE
    //NEXT_PUBLIC_API_URL 
    let response;
    try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-CSRF-Token': csrfToken, // Include CSRF token in the headers
        //  Authorization: `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({
        schemaname: schema.name,
        fields: foldBlocks(fieldData, pagefields, schema.blocktypes),
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
        lastmodified: lastModifiedRef.current,
        currentdraftcreationdate: currentdraftcreationdate, //this is so we can delete any later drafts (assuming user did undo and changed stuff)
        haschanges: hasChanges, //this is so we can delete any later drafts (assuming user did undo and changed stuff)
        nochangesonlyundosave: nochangesonlyundosave


      }),
    })
    } catch {
      setErrorSave(true);
      setServerMessage('Could not reach the server.');
      setIsSaving(false);
      if (hadChanges) dispatch(setHasChanges(true));
      return false;
    }

    if (!response.ok) {
      setErrorSave(true);
      const errorData = await response.json().catch(() => ({}));
      setServerMessage(SAVE_MESSAGES[errorData.errorthing] || errorData.error || 'Could not save.');
      setIsSaving(false);
      if (hadChanges) dispatch(setHasChanges(true));
      return false;

    }
    else if (response.ok) {
      const data = await response.json();
      setIsSaving(false);
      setErrorSave(false);
      setServerMessage('');
      if (data.lastModified) lastModifiedRef.current = data.lastModified;
      const pageid = data.pageid;
      const pagetype = data.pagetype;
      const language = data.language;
      const schema = data.schema;
      const slugduplicatewarningv = data.slugexists;
      dispatch(setMultilingualSharedId(data.multilingualsharedid));
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
      setPrecedingDrafts(data.precedingdrafts);

      dispatch(setTriggerSEORefresh(triggerSEOrefresh + 1));
      setPreviewReload((n) => n + 1);
      setShowSaved(true);

      setTimeout(() => {
        setShowSaved(false);
      }, 2000);
      // Trigger refresh in parent component

    }
    // Trigger SEO refresh in parent component
    return true;

  }

  //. ON PUBLISH FUNCTION ========================  
  const onPublish = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/pagesposts/publish`;
    setIsPublishing(true);
    // publish copies the saved version - save unsaved edits first
    if (hasChanges) {
      const saved = await onSave({ preventDefault() { } }, true);
      if (!saved) {
        setIsPublishing(false);
        return;
      }
    }
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
    if (response.ok) {
      const data = await response.json();
      setIsSaving(false);
      setPublishchange(false);
      setErrorSave(false);
      setServerMessage('');
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
      const errorData = await response.json().catch(() => ({}));
      setServerMessage(errorData.error || 'Could not publish.');
      setIsPublishing(false);
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
      let responsepublihsed = data.published;
      setPublishSwitchStatus(responsepublihsed);
    }
  }

  const preview = async () => {
    let slug = previewPath;
    let previewtoken;
    //createpreviewtoken
    const createpreviewtoken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/createpreviewtoken?slugpath=${encodeURIComponent(slug || '/')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    })
    if (!createpreviewtoken.ok) {
      return;
    }
    else {
      let data = await createpreviewtoken.json();
      previewtoken = data.previewtoken;
      window.open(`${[process.env.NEXT_PUBLIC_FRONTENDURL]}${slug}?preview=true&previewtoken=${previewtoken}`);
    }



  }

  const undoredo = async (e, undoredo) => {
    e.preventDefault();
    //WE SHOULDNT SAVE IF LAST VERSION
    //coz then overwrites with 
    let haschangesforundo = false; //THIS IT NOT SKIP ONE BACK 
    let previousdraftcreationdate = currentdraftcreationdate;
    if (hasChanges) {
      await new Promise(async (resolve) => {
        let savefirst = await onSave(e, true);
        haschangesforundo = true;
        if (!savefirst) {
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
      return;
    }
    const data = await response.json();
    const fieldsfromundoredo = data.fields;
    setCurrentDraftCreationDate(data.creationdate);


    setPageFieldsDataS(fieldsfromundoredo);
    //note: creationdate is a string


    setRemainingDrafts(data.remainingdrafts);
    setPrecedingDrafts(data.precedingdrafts);
    setNumberOfDrafts(data.totalnumberofdrafts);
    setAllowSaveWithoutChanges(true);



    //! now replace field values... 

  }
  // the page's address: its slugpath field if the schema has one, else the path saved on the page
  const previewPath = reduxslugpathfield.content || pagedata?.slugpath || '/';

  //. PAGE VIEW - edits made on the page itself
  const showMediaLibraryModal = useSelector((state) => state.UISlice.showMediaLibraryModal);
  const currentImageField = useSelector((state) => state.PagesSlice.currentimagefield);

  const editOnPage = (name, content) => {
    dispatch(updateField({ ...(fieldData[name] || {}), name, content }));
    dispatch(setHasChanges(true));
  };

  const pickMediaOnPage = (name) => {
    dispatch(setCurrentImageField({
      name, id: '', locale: languageui, content: fieldData[name]?.content || {}, schema: schema.name, type: 'medialibrary', placeholder: '', required: false,
    }));
    dispatch(setCallingFrom(''));
    dispatch(setShowMediaLibraryModal(true));
  };

  // section changes need the site to re-render the page: save a draft, which reloads the preview
  const blockOnPage = (action, field, id, type) => {
    const actions = blockActions({ dispatch, updateField, setHasChanges, fields: fieldData, blocktypes: schema.blocktypes || [] });
    if (action === 'up') actions.move(field, id, -1);
    else if (action === 'down') actions.move(field, id, 1);
    else if (action === 'duplicate') actions.duplicate(field, id);
    else if (action === 'remove') actions.remove(field, id);
    else if (action === 'add') actions.add(field, type, id);
    else return;
    setAutosavePending(true);
  };
  // runs after redux has the change, so onSave sends it
  useEffect(() => {
    if (!autosavePending) return;
    setAutosavePending(false);
    onSave({ preventDefault() { } }, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldData]);

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
        <div className={view === 'split' ? 'vp-split' : undefined}>
        <form ref={formRef} onSubmit={(e) => {
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
                  <button type="button" onClick={(e) => undoredo(e, 'undo')} id="undobutton" className={`ui-btn ui-btn-secondary ui-btn-icon ${precedingdrafts > 0 ? "" : "text-gray-400"}`}
                    disabled={precedingdrafts <= 0 ? true : false}

                  >   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                      <title>Undo</title>
                      <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
                      <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
                    </svg></button>
                  <button type="button" onClick={(e) => undoredo(e, 'redo')} id="redobutton" className={`ui-btn ui-btn-secondary ui-btn-icon ${remainingdrafts > 0 ? "" : "text-gray-400"}`}
                    disabled={remainingdrafts <= 0 ? true : false}
                  >   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                      <title>Redo</title>
                      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                    </svg></button>
                </div>
              )}

              <button id="savedraft" type="submit" className={`ui-btn ${hasChanges ? "ui-btn-primary" : "ui-btn-secondary"} savedraftbutton`}>
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

                <div className="ui-actions" role="group" aria-label="Editor view" style={{ gap: '0.4rem' }}>
                  {[['fields', 'Fields'], ['split', 'Split'], ['page', 'Page']].map(([id, label]) => (
                    <button key={id} type="button" className={view === id ? 'ui-btn ui-btn-primary' : 'ui-btn ui-btn-secondary'} onClick={() => setView(id)} aria-pressed={view === id}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
              {neworexisting === 'existing' && (
                <button type="button" className="ui-btn ui-btn-secondary ui-btn-icon" onClick={() => preview()} >
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

                      <button type="button" className={`ui-btn ${publishchanges ? 'ui-btn-primary' : 'ui-btn-secondary'}`} onClick={() => onPublish()}>
                        <>
                          {!ispublishing && (
                            publishchanges ? 'Publish Changes' : 'Publish'
                          )}
                          {ispublishing && (
                            <span> Publishing...</span>
                          )}

                        </>

                      </button>

                    )}




                    <a href={`${process.env.NEXT_PUBLIC_FRONTENDURL}/${slugpathfieldaR.content}`} target="_blank" rel="noopener noreferrer" className="ui-btn ui-btn-secondary ui-btn-icon">
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
          {serverMessage && (
            <p className="ui-status is-error" role="alert" style={{ margin: '1.2rem 0' }}>{serverMessage}</p>
          )}
          {view !== 'page' && (<>
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
              // const fieldData = useSelector((state) => state.PagesSlice.fields[field.name]) || {};
            //  console.log(field, 'field555555')
            //   console.log(field.name, "field.name111");

            let fieldData1 = fieldData[field.name] || {};
            //console.log(fieldData1.id, "fieldData1.content");
            if (field.type === 'blocks') {
              return <BlocksField key={field.name} field={field} blocktypes={schema.blocktypes || []} />;
            }
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
                options={field.options?.list || []} // select choices: redux keeps no options, so pass the schema's like BlocksField does
              />

            )
          })}

          {/* ── Inline Add Field (dynamic content types only) ─────────────────── */}
          {schema.contentTypeId && (userrole === 'admin' || userrole === 'superadmin') && (
            <div className="ui-card" style={{ marginTop: '3.2rem' }}>
              <div className="ui-card-head">
                <div>
                  <h3>Fields</h3>
                  <p>New fields are added to every {pagetype === 'post' ? 'entry' : 'page'} of this type.</p>
                </div>
                <a className="ui-btn ui-btn-link" href={`/dash/customtype/${schema.contentTypeId}`}>Manage fields</a>
              </div>
              <div className="ui-card-body">
                {!showAddField ? (
                  <div className="ui-actions">
                    <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => setShowAddField(true)}>
                      + Add field
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="ui-actions" style={{ alignItems: 'flex-end' }}>
                      <div className="ui-field">
                        <label className="ui-label" htmlFor="newfield-type">Type</label>
                        <select id="newfield-type" className="ui-input" value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)}>
                          {INLINE_FIELD_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="ui-field">
                        <label className="ui-label" htmlFor="newfield-label">Label</label>
                        <input
                          id="newfield-label"
                          type="text"
                          className="ui-input"
                          value={newFieldLabel}
                          onChange={(e) => {
                            // name follows the label until it's edited by hand
                            if (newFieldName === toFieldName(newFieldLabel)) setNewFieldName(toFieldName(e.target.value));
                            setNewFieldLabel(e.target.value);
                          }}
                          placeholder="e.g. Author bio"
                        />
                      </div>
                      <div className="ui-field">
                        <label className="ui-label" htmlFor="newfield-name">Field name (API)</label>
                        <input
                          id="newfield-name"
                          type="text"
                          className="ui-input ui-mono"
                          value={newFieldName}
                          onChange={(e) => setNewFieldName(toFieldName(e.target.value))}
                          placeholder="e.g. author_bio"
                        />
                      </div>
                      <button type="button" className="ui-btn ui-btn-primary" onClick={addFieldInline} disabled={addFieldSaving}>
                        {addFieldSaving ? 'Adding…' : 'Add'}
                      </button>
                      <button type="button" className="ui-btn ui-btn-secondary" onClick={() => { setShowAddField(false); setAddFieldError(''); }}>
                        Cancel
                      </button>
                    </div>
                    {addFieldError && <p className="ui-status is-error">{addFieldError}</p>}
                  </>
                )}
              </div>
            </div>
          )}
          </>)}

        </form >
        {visual && (
          <VisualPreview
            mode={view}
            formRef={formRef}
            slugpath={previewPath}
            values={fieldData}
            types={previewTypes(pagefields, fieldData, schema.blocktypes)}
            layout={blocksLayout(pagefields, fieldData)}
            reloadKey={previewReload}
            blockFields={pagefields.filter((f) => f.type === 'blocks')}
            blocktypes={schema.blocktypes || []}
            onEdit={editOnPage}
            onPickMedia={pickMediaOnPage}
            onBlock={blockOnPage}
          />
        )}
        {view === 'page' && showMediaLibraryModal && (
          <div className="medialibrarymodal">
            <MediaComponent fieldname={currentImageField?.name} type="medialibrary" locale={languageui} schema={schema.name} id="" />
          </div>
        )}
        </div>
      </div >

    </>
  )
}