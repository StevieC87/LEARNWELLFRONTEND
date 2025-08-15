'use client'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsPopupInfoOpen, setPopupInfo } from "@/redux/slices/UISlice";
import './Popupmenu.css'
import { current } from "@reduxjs/toolkit";
import ModalYesNo from '@/components/global/ModalYesNo';
export default function Popupinfo(props) {

  const { type, filepath, filename, foldername, currentfolder, currentpath, refreshfetch, elipsisOpen, clickelipsis } = props;

  function getCsrfToken() {
    if (typeof document !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrfToken='))
        ?.split('=')[1];
    }
    return null; // Return null if running on the server
  }
  const csrfToken = getCsrfToken();


  const [showModal, setShowModal] = useState(false);
  /* const [isOpen, setIsOpen] = useState(true); */
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

  console.log(currentfolder, "currentfolderfromPopupinfo");
  console.log(currentpath, "currentpathfromPopupinfo");

  const onclickDelete = async (e) => {
    setShowModal(true);
  }


  const deletefilefolder = async () => {
    // console.log(currentpath, "currentpath from Popupinfo");
    // console.log(currentfolder, "currentfolder from Popupinfo");

    //filepath 2 is like it's save din the db, so AFTER the public/media/ 



    let objecttosend
    if (type === "folder") {
      console.log('currenttypefolder')
      //WE NEED TO EXCLUDE DEFAULT FOLDERS FROM DELETEIONS
      console.log(foldername, "foldername from Popupinfo");
      console.log(currentfolder, "currentfolder from Popupinfo"),
        console.log(currentpath, "currentpath from Popupinfo");
      if (!currentpath && !currentfolder) {
        console.log('we are at root level');
      }

      objecttosend = {
        // filepath: filepath2, //this is without the filename
        type: 'folder',
        currentpath: currentpath,
        foldername: foldername,
        currentfolder: currentfolder
      }
    }
    else if (type === "file") {
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
      objecttosend = {
        type: 'file',
        currentpath: currentpath,
        currentfolder: currentfolder,
        // filepath: filepath2, //this is without the filename
        filename: filename,

      }
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/deletefilefolder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // Include CSRF token in the headers
        },
        body: JSON.stringify({ objecttosend }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      const result = await response.json();
      console.log("File deleted successfully:", result);
      //  setIsOpen(false); // Close the popup after deletion
      refreshfetch()
    } catch (error) {
      console.log("Error deleting file:", error);
    }

  };

  const getModalAnswer = (answer) => {
    if (answer) {
      //IF YES, DO TRASH PAGE
      deletefilefolder();
      setShowModal(false);
      clickelipsis()
    }
    else {
      //IF NO, CLOSE MODAL
      setShowModal(false);
    }
  }



  return (
    <>
      <ModalYesNo
        textchoice={`${type === 'folder' ? 'Are you sure you want to permanently delete this folder and all its contents?' : 'Are you sure you want to permanently delete this file?'}`}
        isOpen={showModal}
        changeOpen={setShowModal}
        getModalAnswer={getModalAnswer}
        buttontextconfirm="Yes"
        buttontextcancel="No"

      />
      {elipsisOpen && (
        <>
          <div id="popupmenudiv" className="popupmenudiv p-3" >
            <div className="popupmenuitemsdiv">
              {/* {type === "folder" && (
                <button className="popupmenuitemitem"> Rename</button>
              )} */}
              <button className="popupmenuitemitem"
                onClick={() => {
                  onclickDelete();
                }}
              >Delete</button>


            </div>



          </div>
        </>
      )}
    </>
  );
}