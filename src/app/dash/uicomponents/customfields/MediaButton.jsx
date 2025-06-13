
'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setShowMediaLibraryModal, setSelectedImagefromGalleryModal } from '@/redux/slices/UISlice';
import MediaComponent from '@/app/dash/media/Mediacomponent';
import './mediabutton.css';

export default function MediaButton(props) {

  const dispatch = useDispatch();

  const { name, id, locale, schema, type, value, placeholder, required } = props;

  const showMediaLibraryModal = useSelector((state) => state.UISlice.showMediaLibraryModal);
  const selectedImagefromGalleryModal = useSelector((state) => state.UISlice.selectedImagefromGalleryModal);


  const openMediaLibrary = () => {

    dispatch(setShowMediaLibraryModal(!showMediaLibraryModal));
    //  setMediaLibVisibility(prevValue => prevValue === "visible" ? "hidden" : "visible")

    {
      // setMediaLibVisibility("visible");
    }
    // setMediaLibVisibility("visible");
  }


  return (
    <>

      <button onClick={() => openMediaLibrary()} className="button  button-outline">
        Choose from Media Library
      </button>
      <input type="text" value={selectedImagefromGalleryModal} onChange={(e) => dispatch(setSelectedImagefromGalleryModal(e.target.value))} />



      {showMediaLibraryModal === true &&
        <div className="medialibrarymodal">
          <MediaComponent />
        </div>
      }
      {/* visibility={showMediaLibraryModal} */}


    </>
  )

}

{/*   <div id="medialibrarymodal" visibility={mediaLibVisibility} >
        <MediaComponent visibility={mediaLibVisibility} />

      </div> */}
{/*  <div id="medialibrarymodal"  style={{ visibility: showMediaLibraryModal }}> */ }
{/*  </div> */ }
/* WHAT THIS DOES 
-opens a modal with media library
-user selects a preexisting image
-we need an input field to hold the image path and filename 

-What if already has image - e.g. when load - then we hold the value of the path 

 BUT WE CAN KEEP THE INPUT PATH HIDDEN - and just display the path 
*/