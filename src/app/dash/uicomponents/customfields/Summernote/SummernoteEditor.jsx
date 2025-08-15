'use client';

import { useEffect, useRef, useState } from 'react';
/* import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // includes Popper
import 'bootstrap/dist/css/bootstrap.min.css'; */
import './summernote/summernote-lite.css';
import './summernote/summernote-lite.js';
import $ from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '../../../../../redux/slices/PagesSlice.js';
import { setHasChanges } from '@/redux/slices/PagesSlice.js'; // Import the action to set hasChanges

// optional if you want consistent styling

export default function Summernote(props) {
  const { key, name, value, id, locale, schema, type } = props;
  const initialized = useRef(false);

  console.log('Summernote props:', props);
  const dispatch = useDispatch();
  console.log(value, "valueinSummernoteEditorSummernoteEditor");
  const editorRef = useRef(null);
  const [content, setContent] = useState('');
  const [componentloaded, setComponentLoaded] = useState(false);


  useEffect(() => {
    if (!editorRef.current || initialized.current) return;
    //Ensures the effect does not run until the DOM element (<textarea>) is attached.
    //ensures it only runs once (by checking and setting initialized.current).

    if (typeof window !== 'undefined') {
      window.$ = window.jQuery = $;
    }

    $(editorRef.current).summernote({
      height: 300,
      container: 'body',
      callbacks: {
        onChange: function (contents) {
          setContent(contents);
          dispatch(updateField({
            name: 'wysi',
            content: contents,
            id,
            locale,
            schema,
            type: 'wysi'
          }));
          dispatch(setHasChanges(true));
        }
      }
    });

    // Set initial content (even if it's empty)
    $(editorRef.current).summernote('code', value || '');
    initialized.current = true;


    return () => {
      $(editorRef.current).summernote('destroy');
      initialized.current = false;
    };
  }, [editorRef.current]); // one-time mount


  return (
    <>
      {/*  {value && value.length > 0 ? ( */}
      <textarea ref={editorRef} defaultValue={value} />

      {/* defaultValue={value.length > 0 ? value : '' */}

    </>
  )


}