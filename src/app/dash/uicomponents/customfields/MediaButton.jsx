
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setShowMediaLibraryModal, setSelectedImagefromGalleryModal } from '@/redux/slices/UISlice';
import MediaComponent from '@/app/dash/media/Mediacomponent';
import './mediabutton.css';
import { updateField, setCurrentImageField } from '@/redux/slices/PagesSlice';



export default function MediaButton(props) {

  const dispatch = useDispatch();

  const { name, id, locale, schema, type, value, placeholder, required } = props;

  const showMediaLibraryModal = useSelector((state) => state.UISlice.showMediaLibraryModal);
  const selectedImagefromGalleryModal = useSelector((state) => state.UISlice.selectedImagefromGalleryModal);

  const thisfieldvalue = useSelector((state) => state.PagesSlice.fields[name]) || {};
  console.log(thisfieldvalue, "thisfieldvalueinmediabutton");

  const openMediaLibrary = () => {
    //, Here we specify in a separate field in redux WHICH media field we are currently working with - because otherwise would just put image in the last media field 
    dispatch(setCurrentImageField({
      name: name,
      id: id,
      locale: locale,
      content: thisfieldvalue?.content || {},
      schema: schema,
      type: type,
      placeholder: placeholder,
      required: required || false
    }));
    dispatch(setShowMediaLibraryModal(!showMediaLibraryModal));
    {
    }
  }
  const onChangehandler = (e) => {

  }

  const removeimage = () => {
    dispatch(updateField({
      name: name,
      id: id,
      locale: locale,
      content: {
        imageidstring: '',
        imagepath: '',
        thumbnail: ''
      },
      schema: schema,
      type: type,
      placeholder: placeholder,
      required: required
    }));
  }

  return (
    <>
      {name}
      <div className="mediabuttondiv">
        {thisfieldvalue?.content?.imagepath && (
          <>
            {/*  <img src={`${process.env.NEXT_PUBLIC_API_URL}/public/media${thisfieldvalue?.content?.imagepath}`} alt="" /> */}
            <img src={`${process.env.NEXT_PUBLIC_API_URL}/${thisfieldvalue?.content?.thumbnail}`} alt="11" />

          </>
        )}
        <div className="flex flex-row">
          <button onClick={() => openMediaLibrary()}
            //we pass the field name to the MediaComponent so we can dispatch the selected image to the correct field
            className="button  button-outline">
            Choose
          </button>
          <input type="text"
            className="width200"
            onChange={() => onChangehandler()}
            value={thisfieldvalue?.content?.imagepath || ''}
            name={name}
            id={id}
            locale={locale}
            schema={schema}
            placeholder={placeholder}
            required={required || false}

          />
          {thisfieldvalue?.content?.imagepath && (

            <button className="button button-outline gray " onClick={() => removeimage()}>Remove</button>
          )}
        </div>
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
