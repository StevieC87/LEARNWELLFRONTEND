'use client'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsPopupInfoOpen, setPopupInfo } from "@/redux/slices/UISlice";
import './Popup.css'

export default function Popupinfo(props) {
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


          <div id="popupinfodiv" className="popupinfodiv" style={{ left: positionx, top: positiony }}>

            {popupinfo.info}

            <button onClick={() => dispatch(ispopupinfoopen(false))}>Closepopup</button>
          </div>
        </>
      )

      }
    </>
  );
}