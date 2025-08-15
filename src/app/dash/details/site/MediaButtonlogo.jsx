
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setShowMediaLibraryModal, setSelectedImagefromGalleryModal, setCallingFrom } from '@/redux/slices/UISlice';
import MediaComponent from '@/app/dash/media/Mediacomponent';
import './mediabutton.css';
import { updateField } from '@/redux/slices/PagesSlice';


export default function MediaButtonlogo(props) {

  const dispatch = useDispatch();

  const { name, id, locale, schema, type, value, placeholder, required, sendbackimagecallback } = props;
  //alert(name)

  const showMediaLibraryModal = useSelector((state) => state.UISlice.showMediaLibraryModal);

  /*  const thisfieldvalue = useSelector((state) => state.PagesSlice.fields[name]) || {};
   console.log(thisfieldvalue, "thisfieldvalueinmediabutton");
  */

  const logo = useSelector((state) => state.UISlice.logo) || {};

  const openMediaLibrary = () => {

    dispatch(setCallingFrom(name));
    dispatch(setShowMediaLibraryModal(!showMediaLibraryModal));
    //  setMediaLibVisibility(prevValue => prevValue === "visible" ? "hidden" : "visible")

    {
      // setMediaLibVisibility("visible");
    }
    // setMediaLibVisibility("visible");
  }
  const onChangehandler = (e) => {

  }

  const removeimage = () => {
    /*  dispatch(updateField({
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
     })); */
  }

  const [showonlyinputvalue, setShowOnlyInputValue] = useState(value || '');

  const donothing = () => {
  }

  return (
    <>

      <div className="mediabuttondiv">
        {/*   {thisfieldvalue?.content?.imagepath && (
          <>

            <img src={`${process.env.NEXT_PUBLIC_API_URL}/${thisfieldvalue?.content?.thumbnail}`} alt="11" />

          </>
        )} */}
        <div className="flex flex-row">
          <button onClick={() => openMediaLibrary()}
            //we pass the field name to the MediaComponent so we can dispatch the selected image to the correct field
            className="button  button-outline">
            Choose
          </button>
          <input type="text" className="width200" value={logo.imagepath || ""} onChange={() => donothing()}

          /*    onChange={() => onChangehandler()}
             value={thisfieldvalue?.content.imagepath || ''}
             name={name}
             id={id}
             locale={locale}
             schema={schema}
             placeholder={placeholder}
             required={required || false} */

          />
          {/*     {thisfieldvalue?.content?.imagepath && (

            <button className="button button-outline gray " onClick={() => removeimage()}>Remove</button>
          )} */}
        </div>
      </div>


      {showMediaLibraryModal === true &&
        < div className="medialibrarymodal">
          <MediaComponent
            fieldname='ogimage'
            type='medialibrary'


          />
        </div >
      }
      {/* visibility={showMediaLibraryModal} */}


    </>
  )

}
