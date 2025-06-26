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
  console.log('Summernote props:', props);
  const dispatch = useDispatch();
  console.log(value, "valueinSummernoteEditorSummernoteEditor");
  const editorRef = useRef(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!value && value.length == 0) {
      return
    }
    console.log('Summernote exists?', typeof $.fn.summernote);

    if (typeof window !== 'undefined') {
      window.$ = window.jQuery = $;
    }


    $(editorRef.current).summernote({
      height: 300,
      container: 'body',
      callbacks: {
        onChange: function (contents) {
          setContent(contents); // HTML string
          dispatch(updateField({
            name: 'wysi',
            content: contents,
            id: id, // replace with actual id if needed
            locale: locale, // replace with actual locale if needed
            schema: schema, // replace with actual schema if needed
            type: 'wysi' // or whatever type you need
          }));
          dispatch(setHasChanges(true))
          console.log('Content changed:', contents);
          console.log(contents.length, 'datacontent.length');      // logs character count
        }
      }
    });
    return () => {
      $(editorRef.current).summernote('destroy');
    };

  }, [value]);

  const handleChange = (e) => {
    alert('123123')
  }

  return (
    <>
      {/*  {value && value.length > 0 ? ( */}
      <textarea ref={editorRef} defaultValue={value.length > 0 ? value : ''} />



    </>
  )


}