
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setShowMediaLibraryModal, setSelectedImagefromGalleryModal } from '@/redux/slices/UISlice';
import MediaComponent from '@/app/dash/media/Mediacomponent';
import './mediabutton.css';
import { updateField } from '@/redux/slices/PagesSlice';


export default function MediaButton(props) {

  const dispatch = useDispatch();

  const { name, id, locale, schema, type, value, placeholder, required } = props;

  const showMediaLibraryModal = useSelector((state) => state.UISlice.showMediaLibraryModal);
  const selectedImagefromGalleryModal = useSelector((state) => state.UISlice.selectedImagefromGalleryModal);

  const thisfieldvalue = useSelector((state) => state.PagesSlice.fields[name]) || {};


  const openMediaLibrary = () => {
    dispatch(setShowMediaLibraryModal(!showMediaLibraryModal));
    //  setMediaLibVisibility(prevValue => prevValue === "visible" ? "hidden" : "visible")

    {
      // setMediaLibVisibility("visible");
    }
    // setMediaLibVisibility("visible");
  }
  const onChangehandler = (e) => {

  }

  return (
    <>
      <div className="mediabuttondiv">
        <button onClick={() => openMediaLibrary()}
          //we pass the field name to the MediaComponent so we can dispatch the selected image to the correct field
          className="button  button-outline">
          Choosea
        </button>
        <input type="text"
          onChange={() => onChangehandler()}
          value={thisfieldvalue?.content || ''}
          name={name}
          id={id}
          locale={locale}
          schema={schema}
          placeholder={placeholder}
          required={required || false}

        />
      </div>


      {showMediaLibraryModal === true &&
        <div className="medialibrarymodal">
          <MediaComponent
            fieldname={name}
            type={type}
            locale={locale}
            schema={schema}
            placeholder={placeholder}
            id={id}
            required={required}



          />
        </div>
      }
      {/* visibility={showMediaLibraryModal} */}


    </>
  )

}
