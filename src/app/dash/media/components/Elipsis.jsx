'use client';

import { useState } from 'react';
import Popupmenu from './Popupmenu.jsx';

export default function Elipsis(props) {


  const { type, filepath, filename, currentfolder, currentpath, refreshfetch, elipsisopen, clickElipsisHideShow } = props;

  /*   const [elipsisOpen, setElipsisOpen] = useState(elipsisopen); */



  return (
    <>
      <div className="folderfileVelipsis"
        // onClick={() => setElipsisOpen((prevValue) => !prevValue)}
        onClick={() => clickElipsisHideShow()}
      >
        ⋮
        {elipsisopen && (
          <Popupmenu
            type={type}
            filepath={filepath}
            filename={filename}
            currentfolder={currentfolder}
            currentpath={currentpath}
            refreshfetch={refreshfetch}
          />
        )}
      </div>

    </>
  );
}
