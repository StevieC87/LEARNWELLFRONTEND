'use client'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsPopupInfoOpen, setPopupInfo } from "@/redux/slices/UISlice";
import './Popupmenu.css'

export default function Popupinfo(props) {
  const [isOpen, setIsOpen] = useState(true);
  /* const dispatch = useDispatch();
  const ispopupinfoopen = useSelector((state) => state.UISlice.ispopupinfoopen);
  const popupinfo = useSelector((state) => state.UISlice.popupinfo);
  const positions = useSelector((state) => state.UISlice.popupinfoposition);

  const positionx = positions.x;
  const positiony = positions.y;
  console.log(ispopupinfoopen, "ispopupinfoopenispopupinfoopenispopupinfoopenispopupinfoopenispopupinfoopen"); */
  /*ispopupinfoopen: false,
    popupinfo:*/

  //const { propinfo, position, openstatus } = props

  return (
    <>
      {isOpen && (
        <>
          <div id="popupmenudiv" className="popupmenudiv p-3" /* style={{ left: positionx, top: positiony }} */>
            <div className="popupmenuitemsdiv">
              <button className="popupmenuitemitem"> Rename</button>
              <button className="popupmenuitemitem">Delete</button>


            </div>



          </div>
        </>
      )

      }
    </>
  );
}