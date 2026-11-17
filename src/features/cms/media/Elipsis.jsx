'use client';
import { useDispatch, useSelector } from 'react-redux'
import { setDeleteFileFolderPopupOpen } from '@/redux/slices/UISlice';
import { useState } from 'react';
import Popupmenu from './Popupmenu.jsx';

export default function Elipsis(props) {
  const dispatch = useDispatch();
  const { type, filepath, foldername, filename, currentfolder, currentpath, refreshfetch, } = props;

  const deletefilefolderpopupopen = useSelector((state) => state.UISlice.deletefilefolderpopupopen); // State to track if the delete file/folder popup is open

  const [elipsisOpen, setElipsisOpen] = useState(false);

  const clickelipsis = () => {
    // Toggle the elipsisOpen state

    setElipsisOpen((prevValue) => !prevValue);
    // dispatch(setDeleteFileFolderPopupOpen(!deletefilefolderpopupopen));
  };


  /* dispatch(setDeleteFileFolderPopupOpen(!deletefilefolderpopupopen))} */
  return (
    <>

      <div className="folderfileVelipsis"
        // onClick={() => setElipsisOpen((prevValue) => !prevValue)}
        onClick={() => clickelipsis()}
      >
        ⋮
        <Popupmenu
          type={type}
          filepath={filepath}
          filename={filename}
          foldername={foldername}
          currentfolder={currentfolder}
          currentpath={currentpath}
          refreshfetch={refreshfetch}
          elipsisOpen={elipsisOpen}
          clickelipsis={clickelipsis}

        />

      </div >

    </>
  );
}
