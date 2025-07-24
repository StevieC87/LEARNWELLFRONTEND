'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import './media.css';
import { useDispatch, useSelector } from 'react-redux'
import {
  setShowMediaLibraryModal, setSelectedImagefromGalleryModal, setDefaultOGImage,
  setLogo,
} from '@/redux/slices/UISlice';
import ModalCreateFolder from './components/ModalCreateFolder.jsx';
import { createPortal } from 'react-dom';
import UploadMultiple from './components/UploadMultiple.jsx';
import Elipsis from './components/Elipsis.jsx';
import { updateField, setHasChanges } from '@/redux/slices/PagesSlice';
import Imageshow from './components/Imageshow.jsx';
import { current } from '@reduxjs/toolkit';

export default function MediaComponent(props) {
  const dispatch = useDispatch();

  const { fieldname, id, locale, schema, type, placeholder, required } = props;


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

  const [showmultipleupload, setShowMultipleUpload] = useState(false); // State to track if the multiple upload is shown

  const [refreshfetch, setRefreshfetch] = useState(0); // State to trigger re-fetching of datac
  const [imagesdbarray, setImagesDBArray] = useState([]); // State to store images from the database

  const [currentimagepathcleanwfilename, setCurrentImagePathCleanwFilename] = useState(''); // State to store the cleaned current image path

  const callingfrom = useSelector((state) => state.UISlice.callingfrom); // Get the calling from state

  const currentimagefield = useSelector((state) => state.PagesSlice.currentimagefield); // Get the current image field from the PagesSlice

  const userrole = useSelector((state) => state.DashSlice.userrole); // Get the user role from the authSlice

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


  useEffect(() => {
    const fetchbasefilesandfolders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/getfoldercontents`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken, // Include CSRF token in the request headers
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
        setImagesDBArray(data.imagesdbarray); // Set the images from the database
      } catch (error) {
        console.log('Error fetching base files and folders:', error);
      }
    }
    fetchbasefilesandfolders();
  }
    , [currentfolder, refreshfetch, currentpath]);


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
  const clickonImage = async (index, file) => {

    let pathclean = `${currentpath}/${file}`;
    console.log(pathclean, 'pathclean')

    let pathandfname = `${currentpath}/${file}`;

    setCurrentImagePathCleanwFilename(pathandfname); // Set the cleaned current image path
    if (showMediaLibraryModal) {
      // dispatch(setSelectedImagefromGalleryModal(`public/media${currentpath}/${file}`));
      let imageidstring;
      try {
        const fetchimagedetails = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/getimagebypath`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken, // Include CSRF token in the request headers
          },
          body: JSON.stringify({
            filepath: pathclean, // Send the current path if needed
          }),
          credentials: 'include', // Include credentials for session management
        });
        if (!fetchimagedetails.ok) {
          //  throw new Error('Network response was not ok');
          console.log('Failed to fetch image details');
        }
        else {
          let data = await fetchimagedetails.json();
          console.log('successful')
          // console.log(fetchimagedetails.imageid, 'fetchimagedetails.imageid');
          console.log(data, 'fetchimagedetails from clickonImage');
          imageidstring = data.imageid; // Assuming _id is the image ID
          //  dispatch(setSelectedImagefromGalleryModal(imageidstring));

          //this is for when im NOT usign it in a schema - i.e. in the webstie details page 
          if (callingfrom) {
            if (callingfrom === 'defaultogimage') {
              dispatch(setDefaultOGImage({
                imageidstring: imageidstring,
                imagepath: pathclean,
                thumbnail: `public/media/thumbnails/${data.thumbnailfilename}`,
              }))
            }
            else if (callingfrom === 'logo') {
              dispatch(setLogo({
                imageidstring: imageidstring,
                imagepath: pathclean,
                thumbnail: `public/media/thumbnails/${data.thumbnailfilename}`,
              }))
            }

          }
          //this is for standard in a schema as a field 
          else {
            //, we specified earlier which field we want to update 
            let fieldnameyes = currentimagefield.name;
            let idyes = currentimagefield.id;
            let locale = currentimagefield.locale;
            let schema = currentimagefield.schema;
            let type = currentimagefield.type;
            let placeholder = currentimagefield.placeholder;
            let required = currentimagefield.required;
            //  alert(fieldnameyes)
            dispatch(updateField({
              name: fieldnameyes,
              //  content: imageidstring,
              content: {
                imageidstring: imageidstring,
                imagepath: pathclean,
                thumbnail: `public/media/thumbnails/${data.thumbnailfilename}`,
              },
              id: idyes,
              locale: locale,
              schema: schema,
              type: type,
              placeholder: placeholder,
              required: required || false,

            }));
            dispatch(setHasChanges(true))
          }
        }

      }
      catch (error) {
        //    console.log('Error fetching image details:', error);
      }
      dispatch(setShowMediaLibraryModal(false))
    }

    else if (!showMediaLibraryModal) {
      setImageShow(true);
      setImageShowIndex(index);
      console.log('show image large', index);
      setImageShowFile(`${currentpathforimage}/${file}`)
    }
  }
  const closeImagemodal = () => {
    setImageShow(false);
    setImageShowIndex(0);
    setImageShowFile('');
  }

  const changeFolder = (folderName) => {
    if (!currentpath) {
      console.log('currentpathno');
      console.log(folderName, "folderNameinchangeFolder");
      setCurrentPath(`/${folderName}`)
      setCurrentPathForImage(`${process.env.NEXT_PUBLIC_API_URL}/public/media/${folderName}`);
      setPathHistory((prevHistory) => [...prevHistory, folderName]); // Update the path history
    }
    else {
      console.log('currentpathyes')
      //  console.log(currentpath, "currentpathinchangeFolder");
      setCurrentPath((prevPath) => `${prevPath}/${folderName}`);

      setPathHistory((prevHistory) => [...prevHistory, folderName]); // Update the path history
    }

    setCurrentFolder(folderName);

  }
  /* check currentpath quickly */
  useEffect(() => {
    console.log('Currentpathchanged:', currentpath);
    setCurrentPathForImage(`${process.env.NEXT_PUBLIC_API_URL}/public/media${currentpath}`);
  }, [currentpath]);

  useEffect(() => {
    console.log('Pathhistorychanged:', pathhistory);
  }, [pathhistory])

  const clickevent = (e) => {
    if (
      imageshow &&
      !document.querySelector('.showimagediv')?.contains(e.target) &&
      !e.target.classList.contains('fileimage')
    ) {
      setImageShow(false)
    }

    document.querySelector('.popupmenudiv')?.contains(e.target) &&
      !e.target.classList.contains('popupmenudiv')
    {
      // dispatch(setDeleteFileFolderPopupOpen(false))
    }
  }

  const prevnextimage = (direction) => {
    if (direction === 'previous') {

      setImageShowIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : basefiles.length - 1));
      let filename = basefiles[(imageshowindex - 1 + basefiles.length) % basefiles.length];
      console.log(filename, 'filenameinprevnextimage');
      console.log(currentpathforimage, 'currentpathforimageinprevnextimage');
      console.log(currentpath, 'currentpathinprevnextimage');
      let pathwfilename = `${currentpath}/${filename}`;
      setCurrentImagePathCleanwFilename(pathwfilename); // Set the cleaned current image path with filename


      // ! i need to get the cleanpathfile for the image 
      //we should know the current path, folder , and we have the image name we can find it from the index in the basefiles - for this setCurrentImagePathClean - SO I CAN GET ALL THE INFO FROM THE DATABASE - COZ WE QUERY VIA OPATH LIKE test/myimage.png


      setImageShowFile(`${currentpathforimage}/${basefiles[(imageshowindex - 1 + basefiles.length) % basefiles.length]}`);
    }
    else if (direction === 'next') {

      let filename = basefiles[(imageshowindex + 1) % basefiles.length];
      let pathwfilename = `${currentpath}/${filename}`;
      setCurrentImagePathCleanwFilename(pathwfilename); // Set the cleaned current image path with filename

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
      console.log(createfolderbackend)
      setRefreshfetch((prevValue) => prevValue + 1); // Trigger re-fetching of data
      // Optionally, you can refresh the folder contents after creating a new folder
      /*  setCurrentFolder(createfolderbackend.currentfolder);
       setCurrentPath(createfolderbackend.currentpath);
       setCurrentPathForImage(`${process.env.NEXT_PUBLIC_API_URL}/public/media/${createfolderbackend.currentpath}`); */
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
        'X-CSRF-Token': csrfToken, // Include CSRF token in the request headers
      },
      body: JSON.stringify({
        folderName: newfoldername,
        currentpath: currentpath, // Send the current path if needed
      }),
      credentials: 'include', // Include credentials for session management
    });
    if (!response.ok) {
      console.log('Failed to create folder');
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

  const protectedfolders = [
    'ogimages',
    'sitedefault',
    'thumbnails',
    'pages',
    'posts',
  ]

  const getimagesrcfromarray = (file) => {
    // Find the image in the imagesdbarray based on the filename
    const image = imagesdbarray.find(img => img.filename === file);
    if (image) {
      return `${process.env.NEXT_PUBLIC_API_URL}/${image.thumbnailpath}`;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/public/media${currentpath}/${file}`;
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
          <Imageshow prevnextimage={prevnextimage} imageshowindex={imageshowindex} imageshowfile={imageshowfile} setImageShow={setImageShow} closeImagemodal={closeImagemodal}

            currentimagepathcleanwfilename={currentimagepathcleanwfilename}
          />

        )}
        <div className="flex flex-col ">
          <div className="flex flex-row justify-between">
            <h1 className="">Media Library</h1>
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
              <div className="topmediabuttons flex flex-row  justify-end gap-3 mb-5">
                <div className="flex flex-row justify-end">
                  <button className="justify-self-end button button-outline button-thin"
                    onClick={() => setShowMultipleUpload(prevValue => !prevValue)}
                  >
                    <div className="flex flex-row gap-3 items-center">
                      <span>Upload</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-upload" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383" />
                        <path fillRule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z" />
                      </svg>
                    </div>
                  </button>

                </div>
                <div className="flex flex-row justify-end">
                  {(userrole !== 'contributor' && userrole !== 'author') && (
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
                  )}
                </div>
              </div>
            </>
            {showmultipleupload && (

              <UploadMultiple refreshcallback={() => setRefreshfetch((prevValue) => prevValue + 1)} currentpath={currentpath} currentfolder={currentfolder} />

            )}
            {basefolders.length > 0 && (
              <div className="folderslistdiv mb-10">
                {basefolders.map((folder, index) => (
                  <div key={index} className="folderitemdiv">
                    <div className="folderimagetextdiv">
                      <Image className=" folderimage" onClick={() => changeFolder(folder)} src="/images/folder-cyan.svg" width={60} height={60} alt="folder"></Image>
                      <span className="folderfilename">{folder}</span>
                    </div>
                    {!protectedfolders.includes(folder) && (
                      <Elipsis type={'folder'} filepath={currentpathforimage}
                        foldername={folder}
                        currentfolder={currentfolder} currentpath={currentpath}
                        refreshfetch={() => setRefreshfetch((prevValue) => prevValue + 1)}
                      />
                    )}

                  </div>
                ))}
              </div>
            )}
            {basefiles.length > 0 && (
              <div className="fileslistdiv">
                {basefiles.map((file, index) => (
                  <div key={index} className="fileitemdiv2">
                    <div className="fileimagetextdiv2">
                      <img className="fileimage"
                        /*  src={`${currentpathforimage}/${file}`} */
                        src={getimagesrcfromarray(file)}

                        width={60} height={60} onClick={() => clickonImage(index, file)}
                      /*   data-test={currentpathforimage} */
                      />
                      <span className="filefilename2">{file} </span>
                    </div>

                    <Elipsis type={'file'} filepath={currentpathforimage}
                      filename={file}
                      currentfolder={currentfolder} currentpath={currentpath}
                      refreshfetch={() => setRefreshfetch((prevValue) => prevValue + 1)}

                    />
                  </div>

                  /*    <div id="fileimagediv" key={index} className="fileitem" onClick={() => clickonImage(index, file)}>
                       <img className="fileimage" src={`${currentpathforimage}/${file}`} width={60} height={60} />
                       <span>{file}</span>
                     </div> */
                ))}
              </div>
            )}

            {(basefiles.length === 0 && basefolders.length === 0) && (
              <div className="emptyfolderdiv">
                <h4 className="text-center">This folder is empty</h4>
                <p className="text-center">You can create a new folder or upload files.</p>
              </div>
            )
            }
          </div>
        </div>
      </div >

    </>
  )
}
