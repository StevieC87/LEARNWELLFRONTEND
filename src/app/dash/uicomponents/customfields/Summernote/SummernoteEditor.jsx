'use client';

import { useEffect, useRef, useState } from 'react';
/* import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // includes Popper
import 'bootstrap/dist/css/bootstrap.min.css'; */
import './summernote/summernote-lite.css';
import './summernote/summernote-lite.js';
import $ from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '../../../../../redux/slices/PagesSlice.js';

// optional if you want consistent styling

export default function Summernote(props) {
  const { key, name, value, id, locale, schema, type } = props;
  console.log('Summernote props:', props);
  const dispatch = useDispatch();

  const editorRef = useRef(null);
  const [content, setContent] = useState('');

  useEffect(() => {
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
          console.log('Content changed:', contents);
          console.log(contents.length, 'datacontent.length');      // logs character count
        }
      }
    });
    return () => {
      $(editorRef.current).summernote('destroy');
    };
  }, []);

  return <textarea ref={editorRef} defaultValue={value} />;

}