
'use client';

import { useState } from 'react';

import MediaComponent from '@/app/dash/media/Mediacomponent';
import './mediabutton.css';

export default function MediaButton(props) {

  const [mediaLibVisibility, setMediaLibVisibility] = useState("hidden");
  /*   name={name}
            id={fielddata.id}
            locale={fielddata.locale}
            schema={fielddata.schema}
            type={type}
            value={value}
            placeholder={placeholder}
            required={required || false} */

  const { name, id, locale, schema, type, value, placeholder, required } = props;


  const openMediaLibrary = () => {
    setMediaLibVisibility(prevValue => prevValue === "visible" ? "hidden" : "visible")

    {
      // setMediaLibVisibility("visible");
    }
    // setMediaLibVisibility("visible");
  }

  return (
    <>
      {mediaLibVisibility === 'visible' ? 'visible' : 'hidden'}
      <button onClick={() => openMediaLibrary()} className="btn btn-primary">
        Choose from Media Library
      </button>
      <input type="text" />

      {/*   <div id="medialibrarymodal" visibility={mediaLibVisibility} >
        <MediaComponent visibility={mediaLibVisibility} />

      </div> */}
      <div id="medialibrarymodal" className="medialibrarymodal" style={{ visibility: mediaLibVisibility }}>
        {mediaLibVisibility === "visible" && <MediaComponent visibility={mediaLibVisibility} />}
      </div>

    </>
  )

}


/* WHAT THIS DOES 
-opens a modal with media library
-user selects a preexisting image
-we need an input field to hold the image path and filename 

-What if already has image - e.g. when load - then we hold the value of the path 

 BUT WE CAN KEEP THE INPUT PATH HIDDEN - and just display the path 
*/