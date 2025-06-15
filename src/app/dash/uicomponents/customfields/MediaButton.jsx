
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

  const onChange1 = (e) => {
    alert('hello')

    // const newValue = e.target.value;
    /*  */

    // onChange2();
  }

  const openMediaLibrary = (fieldname) => {
    dispatch(setShowMediaLibraryModal(!showMediaLibraryModal));
    //  setMediaLibVisibility(prevValue => prevValue === "visible" ? "hidden" : "visible")

    {
      // setMediaLibVisibility("visible");
    }
    // setMediaLibVisibility("visible");
  }

  /*   useEffect(() => {
      dispatch(updateField({
        name: name,
        //content: newValue,
        id: id,
        locale: locale,
        schema: schema,
        type: type,
        placeholder: placeholder
      }));
    }, [selectedImagefromGalleryModal]); */

  const hello = () => {
    alert('hello222');
  }

  return (
    <>
      <div className="mediabuttondiv">
        <button onClick={() => openMediaLibrary(name)}
          //we pass the field name to the MediaComponent so we can dispatch the selected image to the correct field
          className="button  button-outline">
          Choosea
        </button>
        <input type="text"
          //  onChange={() => hello()}
          // onChange={(e) => onChange1(e)}
          // onChange={(e) => dispatch(setSelectedImagefromGalleryModal(e.target.value))}
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
          <MediaComponent fieldname={name} />
        </div>
      }
      {/* visibility={showMediaLibraryModal} */}


    </>
  )

}
