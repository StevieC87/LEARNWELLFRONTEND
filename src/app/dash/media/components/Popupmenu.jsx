'use client'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsPopupInfoOpen, setPopupInfo } from "@/redux/slices/UISlice";
import './Popupmenu.css'

export default function Popupinfo(props) {

  const { type, filepath, filename, currentfolder, currentpath, refreshfetch } = props;
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

  const deletefilefolder = async () => {
    // console.log(currentpath, "currentpath from Popupinfo");
    // console.log(currentfolder, "currentfolder from Popupinfo");
    console.log("Deleting file:", filepath);
    console.log('filename:', filename);
    let fullpathandfile = filepath + "/" + filename;
    console.log("Full path and file:", fullpathandfile);
    let splitonpath = fullpathandfile.split("/");
    console.log("Split on path:", splitonpath);
    //i want to delte everything before'media  
    let mediaindex = splitonpath.indexOf("media");
    console.log("Media index:", mediaindex);
    let filepath2 = splitonpath.slice(mediaindex + 1).join("/");
    //add / in begining of filepath2
    filepath2 = "/" + filepath2;
    console.log("Filepath to delete:", filepath2);
    //filepath 2 is like it's save din the db, so AFTER the public/media/ 

    let objecttosend = {
      filepath: filepath2, //this is without the filename
      filename: filename,

    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/deletefilefolder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ objecttosend }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      const result = await response.json();
      console.log("File deleted successfully:", result);
      setIsOpen(false); // Close the popup after deletion
      refreshfetch()
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };


  return (
    <>
      {isOpen && (
        <>
          <div id="popupmenudiv" className="popupmenudiv p-3" /* style={{ left: positionx, top: positiony }} */>
            <div className="popupmenuitemsdiv">
              {type === "folder" && (
                <button className="popupmenuitemitem"> Rename</button>
              )}
              <button className="popupmenuitemitem"
                onClick={() => {
                  deletefilefolder(filepath);
                }}
              >Delete</button>


            </div>



          </div>
        </>
      )

      }
    </>
  );
}