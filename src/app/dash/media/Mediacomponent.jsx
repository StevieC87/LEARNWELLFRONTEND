'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import './media.css';
import { useDispatch, useSelector } from 'react-redux'
import { setShowMediaLibraryModal, setSelectedImagefromGalleryModal } from '@/redux/slices/UISlice';
import ModalCreateFolder from './components/ModalCreateFolder.jsx';


export default function MediaComponent(props) {
  const dispatch = useDispatch();

  const showMediaLibraryModal = useSelector((state) => state.UISlice.showMediaLibraryModal);

  const [basefiles, setBaseFiles] = useState([]);
  const [basefolders, setBaseFolders] = useState([]);
  const [currentfolder, setCurrentFolder] = useState(''); // State to track the current folder
  const [currentpath, setCurrentPath] = useState(''); // State to track the current path

  const [pathhistory, setPathHistory] = useState([""]); // State to track the path history
  const [currentpathforimage, setCurrentPathForImage] = useState(`${process.env.NEXT_PUBLIC_API_URL}/public/media`);

  const [imageshow, setImageShow] = useState(false); // State to track if the image is shown
  const [imageshowindex, setImageShowIndex] = useState(0); // State to track the index of the image being shown
  const [imageshowfile, setImageShowFile] = useState(''); // State to track the file of the image being shown

  const [shownewfolderinputModal, setShowNewFolderInputModal] = useState(false); // State to track if the new folder input modal is shown
  const [newfolderinputvalue, setNewFolderInputValue] = useState(''); // State to track the new folder input value


  useEffect(() => {
    const fetchbasefilesandfolders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/getfoldercontents`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              folderName: currentfolder,
              currentpath: currentpath, // Send the current path if needed
            }) // Send the current folder name if needed
            ,
            credentials: 'include', // Include credentials for session management
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data, "data from media page");
        setBaseFiles(data.files);
        setBaseFolders(data.folders);
        setCurrentPath(data.currentpath); // Update the current path state
        console.log(data.currentpath, "currentpath from media page");
        console.log(data.folders, "folders from media page");
      } catch (error) {
        console.error('Error fetching base files and folders:', error);
      }
    }
    fetchbasefilesandfolders();
  }
    , [currentfolder]);

  const changeFolder = (folderName) => {
    if (!currentpath) {
      console.log('currentpathno');
      setCurrentPath(`/${folderName}`)
      setCurrentPathForImage(`${process.env.NEXT_PUBLIC_API_URL}/public/media/${folderName}`);
      setPathHistory((prevHistory) => [...prevHistory, folderName]); // Update the path history

    }
    else {
      console.log('currentpathyes')
      setCurrentPath((prevPath) => `${prevPath}/${folderName}`);
      setCurrentPathForImage(`${process.env.NEXT_PUBLIC_API_URL}/public/media/${currentpath}`);
      setPathHistory((prevHistory) => [...prevHistory, folderName]); // Update the path history
    }

    setCurrentFolder(folderName);

  }

  useEffect(() => {
    console.log('Path history:', pathhistory);
    console.log('Current path:', currentpath);
    console.log('Current folder:', currentfolder);
    console.log('Current path for image:', currentpathforimage);
  }, [pathhistory, currentpath, currentfolder, currentpathforimage]);

  const history = (direction) => {
    if (direction === 'back') {
      if (pathhistory.length > 1) {
        const newHistory = [...pathhistory];
        newHistory.pop(); // Remove the last folder from history
        setPathHistory(newHistory);
        const previousFolder = newHistory[newHistory.length - 1] || '';
        setCurrentFolder(previousFolder);
        setCurrentPath(newHistory.join('/')); // Update current path based on history
        setCurrentPathForImage(`${process.env.NEXT_PUBLIC_API_URL}/public/media/${newHistory.join('/')}`);
      }
    }
  }
  //
  const clickonImage = (index, file) => {

    if (showMediaLibraryModal) {
      dispatch(setSelectedImagefromGalleryModal(`public/media${currentpath}/${file}`));
      dispatch(setShowMediaLibraryModal(false))
    }
    else if (!showMediaLibraryModal) {
      setImageShow(true);
      setImageShowIndex(index);
      console.log('show image large', index);
      setImageShowFile(`${currentpathforimage}/${file}`)
    }
  }

  const clickevent = (e) => {
    if (
      imageshow &&
      !document.querySelector('.showimagediv')?.contains(e.target) &&
      !e.target.classList.contains('fileimage')
    ) {
      setImageShow(false)
    }
  }

  const prevnextimage = (direction) => {
    if (direction === 'previous') {

      setImageShowIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : basefiles.length - 1));

      setImageShowFile(`${currentpathforimage}/${basefiles[(imageshowindex - 1 + basefiles.length) % basefiles.length]}`);
    }
    else if (direction === 'next') {
      setImageShowIndex((prevIndex) => (prevIndex < basefiles.length - 1 ? prevIndex + 1 : 0));
      setImageShowFile(`${currentpathforimage}/${basefiles[(imageshowindex + 1) % basefiles.length]}`);
    }
  }


  const createfolderCallback = async (value) => {
    console.log(value, "valuefromcreatefolderCallback");
    setShowNewFolderInputModal(false);
    setNewFolderInputValue(value);

    let createfolderbackend = await createnewfolderfetch(
      value,
    )
    if (createfolderbackend) {
      console.log('Folder created successfully');
      // Optionally, you can refresh the folder contents after creating a new folder
      setCurrentFolder(createfolderbackend.currentfolder);
      setCurrentPath(createfolderbackend.currentpath);
      setCurrentPathForImage(`${process.env.NEXT_PUBLIC_API_URL}/public/media/${createfolderbackend.currentpath}`);
      // You might want to re-fetch the folders and files here
      // fetchbasefilesandfolders();
    }
  }

  async function createnewfolderfetch(newfoldername) {
    //also we need current folder before cahnge and current path 
    console.log('newfoldername', newfoldername);
    console.log('currentfolder', currentfolder);
    //if current folder is empty it means we are in the root folder 
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/createfolder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        folderName: newfoldername,
        currentpath: currentpath, // Send the current path if needed
      }),
      credentials: 'include', // Include credentials for session management
    });
    if (!response.ok) {
      console.error('Failed to create folder');
      return;
    }
    else {
      console.log('Folder created successfully');
      let data = await response.json();
      return data;
      // Optionally, you can refresh the folder contents after creating a new folder
      //  setCurrentFolder(currentfolder);
      //   setCurrentPathForImage(`${process.env.NEXT_PUBLIC_API_URL}/public/media/${currentpath}`);
      // You might want to re-fetch the folders and files here
      // fetchbasefilesandfolders();
    }

  }
  return (
    <>
      <div className="mediaouterdiv" onClick={(e) => clickevent(e)}>
        {shownewfolderinputModal && (
          <ModalCreateFolder
            /*   isOpen={shownewfolderinputModal} */
            getnewfolderinputvalue={(value) => createfolderCallback(value)}
            changeOpen={(value) => setShowNewFolderInputModal(value)}
          />
        )}
        {imageshow && (
          <div id="showimagediv" className="showimagediv">
            <button className="showimagecaret" id="imagecaretleft" onClick={() => prevnextimage('previous')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left" viewBox="0 0 16 16">
                <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
              </svg>
            </button>
            <img id="showimageimage" src={imageshowfile} alt={`Image ${imageshowindex}`} className="w-full h-full object-contain" />
            <button className="showimagecaret" id="imagecaretright" onClick={() => prevnextimage('next')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right" viewBox="0 0 16 16">
                <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex flex-col ">
          <div className="flex flex-row justify-between">
            <h1 className="">Media Page</h1>
            {showMediaLibraryModal && (
              <button onClick={() => dispatch(setShowMediaLibraryModal(false))}>Close Media Library</button>
            )}
          </div>

          <div className="mediaouterdiv">
            <>
              {pathhistory.length > 1 && (

                <button onClick={() => history('back')} className="mt-5 mb-5 button button-primary button-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-90deg-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z" />
                  </svg>
                </button>

              )}
              <div className="flex flex-row justify-end">
                <button className="justify-self-end button button-outline button-thin"
                  onClick={() => setShowNewFolderInputModal(true)}
                >
                  <div className="flex flex-row gap-3 items-center">
                    <span> Create Folder</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-folder-plus" viewBox="0 0 16 16">
                      <path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z" />
                      <path d="M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </div>
                </button>

              </div>

            </>
            {basefolders.length > 0 && (
              <div className="folderslistdiv mb-10">
                {basefolders.map((folder, index) => (
                  <button key={index} className="folderitem" onClick={() => changeFolder(folder)}>
                    <Image src="/images/folder-cyan.svg" width={60} height={60} alt="folder"></Image>
                    <span>{folder}</span>
                  </button>
                ))}
              </div>
            )}
            {basefiles.length > 0 && (
              <div className="fileslistdiv">
                {basefiles.map((file, index) => (
                  <div id="fileimagediv" key={index} className="fileitem" onClick={() => clickonImage(index, file)}>
                    <img className="fileimage" src={`${currentpathforimage}/${file}`} width={60} height={60} />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div >
    </>
  )
}
