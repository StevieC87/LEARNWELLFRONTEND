import './imageshow.css'
import { useState, useEffect } from 'react'


export default function Imageshow(props) {

  const {
    imageshowfile,
    imageshowindex,
    imageshowarray,
    setImageshowindex,
    setImageshowfile,
    closeImagemodal,
    prevnextimage,
    currentimagepathcleanwfilename
  } = props

  /*  let uploadedon;
   let filename;
   let filetype;
   let filesize; */

  const [uploadedon, setUploadedon] = useState('');
  const [filename, setFilename] = useState('');
  const [filetype, setFiletype] = useState('');
  const [filesize, setFilesize] = useState('');
  const [alttext, setAlttext] = useState('');
  const [caption, setCaption] = useState('');
  //get photo details from db 
  useEffect(() => {
    console.log(currentimagepathcleanwfilename, 'currentimagepathcleanwfilenamecurrentimagepathcleanwfilename')
    const fetchImageDetails = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/getimagebypath`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filepath: currentimagepathcleanwfilename
        }),
      });
      if (response.ok) {
        const data = await response.json();


        // Assuming data.imagedata contains the image details
        const imagedata = data.imagedata;
        // You can now use imagedata to display image details
        console.log('Imagedetails:', imagedata);
        let uploadedonv = new Date(imagedata.createdAt).toLocaleDateString();
        setUploadedon(uploadedonv);
        setFilename(imagedata.filename);
        setFiletype(imagedata.mimetype);
        setFilesize(imagedata.size);
        setAlttext(imagedata.alttext || '');
        setCaption(imagedata.caption || '');
      }
      else {
        console.error('Failed to fetch image details:');
      }

    };
    fetchImageDetails();

  }, [currentimagepathcleanwfilename])

  const donothing = () => {

  }


  const handleAltTextChange = (e) => {
    setAlttext(e.target.value);
  };
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const submitchanges = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/updateimagedetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filepath: currentimagepathcleanwfilename,
        alttext: alttext,
        caption: caption
      }),
      credentials: 'include',
    });
  }

  return (
    <div id="showimagediv" className="showimagediv">
      <div className="imageshowinnerdiv">
        <div className="imageshowtopbuttons">
          <span>Image Details</span>
          <div className="imageshowtopbuttonsright">
            <button className="imagetopbutton showimagecaret" id="imagecaretleft" onClick={() => prevnextimage('previous')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left" viewBox="0 0 16 16">
                <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
              </svg>
            </button>
            <button className="imagetopbutton showimagecaret" id="imagecaretright" onClick={() => prevnextimage('next')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right" viewBox="0 0 16 16">
                <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
              </svg>
            </button>
            <button className="imagetopbutton imagexbutton" onClick={() => closeImagemodal()}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg cursor-pointer" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg></button>
          </div>
        </div>
        <div className="imageshowmainarea">

          <img id="showimageimage" src={imageshowfile} alt={`Image ${imageshowindex}`} className="w-full h-full object-contain" />
          <div className="imageshowbelowimg">
            <div className="imageshowfiledetailslist">
              <span>Uploaded on {uploadedon}</span>
              <span>Filename: {filename}</span>
              <span>Filetype: {filetype}</span>
              <span>Filesize: {filesize}</span>
            </div>
            <div className="alttext flex flex-col">

              <label htmlFor="alttextinput">Alternative Text:</label>
              <textarea type="text" id="alttextinput" placeholder="Enter alt text for the image"
                onChange={handleAltTextChange} value={alttext}
              >
              </textarea>
            </div>
            <div className="caption flex flex-col">
              <label htmlFor="captiontxt">Caption</label>
              <textarea type="text" id="captioninput" placeholder=""
                onChange={handleCaptionChange} value={caption}
              >
              </textarea>
            </div>
            <label htmlFor="imgurl">File URL:</label>
            <input name="imgurl" value={`${process.env.NEXT_PUBLIC_API_URL}/public/media${currentimagepathcleanwfilename}`} onChange={() => donothing()} />
          </div>
          <button className="button button-primary" onClick={() => submitchanges()}>Save changes</button>
        </div>
      </div>


    </div>
  )
}