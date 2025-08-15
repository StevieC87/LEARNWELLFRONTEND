'use client'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsPopupInfoOpen, setPopupInfo } from "@/redux/slices/UISlice";
import { useNonce } from '@/hooks/useNonce'

import './Popup.css'

export default function Popupinfo(props) {
  const noncea = useNonce()

  const dispatch = useDispatch();
  const ispopupinfoopen = useSelector((state) => state.UISlice.ispopupinfoopen);
  const popupinfo = useSelector((state) => state.UISlice.popupinfo);
  const positions = useSelector((state) => state.UISlice.popupinfoposition);

  const positionx = positions.x;
  const positiony = positions.y;
  console.log(ispopupinfoopen, "ispopupinfoopenispopupinfoopenispopupinfoopenispopupinfoopenispopupinfoopen");
  /*ispopupinfoopen: false,
    popupinfo:*/

  //const { propinfo, position, openstatus } = props

  return (
    <>
      {ispopupinfoopen && (
        <>


          <div id="popupinfodiv" className="popupinfodiv popupinfodiv1 p-3">

            {popupinfo.info}

            <button onClick={() => dispatch(ispopupinfoopen(false))}>Closepopup</button>
          </div>
        </>
      )

      }
      <style nonce={noncea}>{`
        .popupinfodiv1 {
          left: ${positionx}px;
          top: ${positiony}px;
        }
      `}</style>
    </>
  );
}