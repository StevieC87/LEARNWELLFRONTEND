'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { updateField, setSlugDuplicateWarning, setTriggerSEORefresh } from '@/redux/slices/PagesSlice';
import Popupicon from "./Popupicon";
import Popup from "./Popup";
import { setIsPopupInfoOpen } from "@/redux/slices/UISlice";

export default function SEOTab(props) {
  // const searchParams = useSearchParams();

  const dispatch = useDispatch();
  const { pageid } = props
  console.log(typeof pageid, "typeofpageidinSEOTab");
  // const pageid = searchParams.get('pageid');
  const [showsuccess, setShowSuccess] = useState(false);
  const [showerror, setShowError] = useState(false);

  const [defaultimg, setDefaultImage] = useState(null);

  const [changeddefaultmetatitle, setChangedDefaultMetaTitle] = useState(false);
  const [changeddefaultmetadescription, setChangedDefaultMetaDescription] = useState(false);

  const [changedefaultogtitle, setChangedDefaultOGTitle] = useState(false);
  const [changedefaultofdescription, setChangedDefaultDescription] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      metaTitle: "",
      custommetaTitle: "",
      metaDescription: "",
      custommetadescription: "",
      robots: "index, follow",
      canonicalUrl: "",
      hreflang: "",
      ogImage: "",
      ogType: "",
      twitterCardType: "",
      ogTitle: "",
      customOGTitle: "",
      ogDescription: "",
      customOGdescription: "",
      ogSitename: "",
    }
  });

  const triggerSEOrefresh = useSelector((state) => state.PagesSlice.triggerSEOrefresh);
  // 
  const [changeddefaultimg, setChangedDefaultImage] = useState(false);

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


  //FETCH SEO SETTINGS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/pagespecificseo?pageid=${pageid}`, {
          method: "GET",
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data.custommetaDescription, "custommetadescription from fetch in SEOTab");
          console.log("FetchedSEOsettings:", data);
          reset({
            metaTitle: data.metatitle || "",
            custommetaTitle: data.custommetaTitle || false,
            metaDescription: data.metadescription || "",
            custommetadescription: data.custommetaDescription || false,
            robots: data.robots || "",
            canonicalUrl: data.canonicalurl || "",
            hreflang: data.hreflang || "",
            ogImage: data.ogimage || "",
            ogType: data.ogtype, //e,g. article, image etc 
            //NEED TO SET THIS MAYBE IN schema 
            twitterCardType: data.twitterCardType || "summary_large_image",
            ogTitle: data.metatitle || "",
            customOGTitle: data.customOGTitle || "",
            /*    customOGTitle: data.customogtitle || "", */
            ogDescription: data.metadescription || "",
            customOGdescription: data.ogCustomdescription || "",
            ogSitename: data.ogsitename || "",
          });
          setDefaultImage(data.ogimage || null);

          if (data.customOGTitle) {
            setChangedDefaultOGTitle(true);
          }
          if (data.ogCustomdescription) {
            setChangedDefaultDescription(true);
          }
          if (data.custommetaTitle) {
            setChangedDefaultMetaTitle(true);
          }
          if (data.custommetaDescription) {
            setChangedDefaultMetaDescription(true);
          }
          //  console.log(result, "")
        }
        else if (!response.ok) {
          console.log("FailedtofetchSEOsettings");
        }


      } catch (error) {
        console.log("Error fetching SEO settings:", error);
      }
    };

    fetchData();
  }, [triggerSEOrefresh]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      console.log(key, 'keykeykeykey')
      if (key === "ogImage") {
        if (defaultimg) {
          console.log('11111111111a')
          if (!changeddefaultimg) {
            console.log('11111111111a1')
            console.log(defaultimg, "defaultimgfileobjectdefaultimgfileobjectdefaultimgfileobject");
            //get last part of the path for file type
            let filetype = defaultimg.split('.').pop();
            console.log(filetype, "filetype");
            //! ALSO CHANGE NAME FOR EACH PAGE
            /*   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${defaultimg}`);
              const blob = await response.blob();
              const file = new File([blob], `${pageid}.${filetype}`, { type: blob.type });
              console.log(file, "defaultimgfileobject");
              formData.append("ogImage", file); */
          }
          else {
            console.log('11111111111111b')
            console.log('ogimageogimage')
            const fileInput = document.querySelector(`input[name="${key}"]`);
            console.log(fileInput, "fileInputfileInputfileInput");
            if (fileInput?.files?.[0]) {
              const file = fileInput.files[0];
              const fileType = file.name.split('.').pop();
              const renamedFile = new File([file], `${pageid}.${fileType}`, { type: file.type });
              formData.append(key, renamedFile);
            }

          }
        }

      }
      else if (key === "custommetaTitle") {
        formData.append(key, changeddefaultmetatitle);
        //  //  changeddefaultmetadescription
        //changedefaultogtitle  changedefaultofdescription
      }
      else if (key === "custommetadescription") {
        formData.append(key, changeddefaultmetadescription);
      }
      else if (key === "customOGTitle") {
        formData.append(key, changedefaultogtitle);
      }
      else if (key === "customOGdescription") {
        formData.append(key, changedefaultofdescription);
      }

      else {
        console.log("Appending key:", key, "with value:", data[key]);
        formData.append(key, data[key]);
      }
    }
    console.log(formData, "formData");

    formData.append("pageid", pageid);
    formData.append("changeddefaultimage", changeddefaultimg);
    // formData.append("defaultimgurl", `${process.env.NEXT_PUBLIC_API_URL}/media/ogimage`);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/savepagespecificSEO`,
      {
        method: "POST",
        credentials: 'include',
        body: formData,
        headers: {
          "X-CSRF-Token": csrfToken // Include CSRF token in the request headers
        }
      });

    if (response.ok) {
      dispatch(setTriggerSEORefresh(true));
      /*   setShowSuccess(true);
        setShowError(false);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError(true);
        setShowSuccess(false);
        setTimeout(() => setShowError(false), 3000); */
    }

  };

  const checkifdefaultchanged = (e) => {
    const { name, value, checked } = e.target;
    console.log(name, "nameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    if (name === "metaTitle") {
      if (value !== "") {
        setChangedDefaultMetaTitle(true);
        setValue("custommetaTitle", true); // Set custommetaTitle to true if metaTitle is not empty
      }
      else {
        setChangedDefaultMetaTitle(false);
        setValue("custommetaTitle", false); // Set custommetaTitle to false if metaTitle is empty
      }
      console.log(checked, "checked");
    }

    if (name === 'metaDescription') {
      if (value !== "") {
        setChangedDefaultMetaDescription(true);
        setValue("custommetadescription", true); // Set custommetadescription to true if metaDescription is not empty
      }
      else {
        setChangedDefaultMetaDescription(false);
        setValue("custommetadescription", false); // Set custommetadescription to false if metaDescription is empty
      }
    }
    else if (name === "ogTitle") {

      if (value !== "") {

        setChangedDefaultOGTitle(true);
        setValue("customOGTitle", true); // Set customOGTitle to true if ogTitle is not empty
      }
      else {
        setChangedDefaultOGTitle(false);
        setValue("customOGTitle", false); // Set customOGTitle to false if ogTitle is empty
      }
    }
    else if (name === "ogDescription") {
      if (value !== "") {
        setChangedDefaultDescription(true);
        setValue("customOGdescription", true); // Set customOGdescription to true if ogDescription is not empty
      }
      else {
        setChangedDefaultDescription(false);
        setValue("customOGdescription", false); // Set customOGdescription to false if ogDescription is empty
      }
    }



    /*  else if (name === "customOGTitle") {
       setChangedDefaultMetaTitle(checked);
       console.log(checked, "checked");
     }
     else if (name === "customOGdescription") {
       setChangedDefaultDescription(checked);
       console.log(checked, "checked");
     } */
  }

  const undoredocheckboxchange = (e) => {

    const { name, checked } = e.target;
    console.log(name, "nameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    console.log(checked, "checkedcheckedchecked");
    if (name === "custommetaTitle") {
      setChangedDefaultMetaTitle(checked);
    }
    else if (name === "custommetadescription") {
      setChangedDefaultMetaDescription(checked);
    }
    else if (name === "customOGTitle") {
      setChangedDefaultOGTitle(checked);
    }
    else if (name === "customOGdescription") {
      setChangedDefaultDescription(checked);
    }
  }

  const closePopup = (e) => {
    let targetid = e.target.id;
    console.log(targetid, "targetididididid");

    if (e.target.id !== "popupicondiv" && e.target.id !== "popupsvg" && e.target.id !== "popupinfodiv" && e.target.id === '') {

      dispatch(setIsPopupInfoOpen(false));
    }
  }
  return (
    <>
      <div onClick={(e) => closePopup(e)}>
        <Popup />

        <form className="seoform mb-10" onSubmit={handleSubmit(onSubmit)} >
          <div className="flex flex-row justify-between items-center mb-4">
            <h1>Page SEO</h1>
            {showsuccess && <div className="alert alert-success">SEO settings saved.</div>}
            {showerror && <div className="alert alert-danger">Error saving SEO settings.</div>}


            <div className="flex justify-end">
              <button className="button button-primary" type="submit">Save SEO Settings</button>
            </div>
          </div>
          <div id="metatagscontent" >
            <div className="flex flex-row">
              <div className="formlabelvertical">

                <label className="flex flex-row gap-5 items-center">
                  Meta Title
                  <Popupicon field="metaTitle" />
                </label>
                <input {...register("metaTitle")} onChange={(e) => checkifdefaultchanged(e)} />
              </div>

              {changeddefaultmetatitle && (
                <div className="formlabelvertical">
                  <label>
                    Custom Meta Title - <span className="labeltip1">Override default meta title.</span>
                    <p className="labeltip2">Tip: If you want to override default which is based on page title</p>
                  </label>
                  <input type="checkbox" {...register("custommetaTitle")} checked={changeddefaultmetatitle}
                    onChange={(e) => undoredocheckboxchange(e)}
                  />


                </div>

              )}
            </div>
            <div className="flex flex-row">

              <div className="formlabelvertical">
                <label className="flex flex-row gap-5 items-center">
                  Meta Description
                  <Popupicon field="metaDescription" />

                </label>
                <textarea type="textarea"{...register("metaDescription")} onChange={(e) => checkifdefaultchanged(e)} />

              </div>
              {changeddefaultmetadescription && (
                <div className="formlabelvertical">
                  <label>
                    Custom Meta Description - <span className="labeltip1">Override default meta title.</span>
                    <p className="labeltip2">Tip: If you want to override default which is based on page title</p>
                  </label>
                  <input type="checkbox" {...register("custommetadescription")}
                    onChange={(e) => undoredocheckboxchange(e)}
                  />
                  {/* 
  const [changedefaultogtitle, setChangedDefaultOGTitle] = useState(false);
  const [changedefaultofdescription, setChangedDefaultDescription] = useState(false); */}
                </div>
              )}

            </div>

            <div className="card transparent">
              <div className="text-center font-bold poppinssemibold">Social Sharing Metadata</div>
              <div id="ogtitle" className="flex flex-row">
                <div className="formlabelvertical">
                  <label className="flex flex-row gap-5 items-center">
                    OG Title
                    <Popupicon field="ogTitle" />

                  </label>
                  <input {...register("ogTitle")} onChange={(e) => checkifdefaultchanged(e)} />
                </div>
                {changedefaultogtitle && (
                  <div className="formlabelvertical">
                    <label>
                      Custom OG Title - <span className="labeltip1">Override default Open Graph title.</span>
                      <p className="labeltip2">Tip: If you want to override default which is based on page title</p>
                    </label>
                    <input type="checkbox" {...register("customOGTitle")}
                      onChange={(e) => undoredocheckboxchange(e)}
                    />
                  </div>
                )}
              </div>


              <div id="ogdescription" className="flex flex-row">
                <div className="formlabelvertical">
                  <label className="flex flex-row gap-5 items-center">
                    OG Description
                    <Popupicon field="ogDescription" />

                  </label>
                  <textarea {...register("ogDescription")} onChange={e => checkifdefaultchanged(e)} />
                </div>
                {changedefaultofdescription && (
                  <div className="formlabelvertical">
                    <label>
                      Custom OG Description - <span className="labeltip1">Override default Open Graph description.</span>
                      <p className="labeltip2">Tip: If you want to override default which is based on meta description</p>
                    </label>
                    <input type="checkbox" {...register("customOGdescription")}
                      onChange={(e) => undoredocheckboxchange(e)}
                    />
                  </div>
                )}
              </div>

              <div id="ogimage" className="formlabelvertical">
                <label className="flex flex-row gap-5 items-center">
                  OG Image
                  <Popupicon field="ogImage" />

                </label>

                {defaultimg && (
                  <>
                    <p>Selected Default Image: {defaultimg.name}</p>
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/${defaultimg}`} alt="Current Logo" width="200" />
                  </>

                )}
                <div className="flex justify-between">
                  <input {...register("ogImage")} name="ogImage" type="file" accept="image/*"
                    onChange={(e) => {
                      setChangedDefaultImage(true);
                      const file = e.target.files[0];
                      console.log(file); // should log a File object
                      setDefaultImage(file);
                      //  setDefaultImage(e.target.files[0]);
                      /*  const file = e.target.files[0];
                       if (file) {
                         setDefaultImage(URL.createObjectURL(file));
                       } else {
                         setDefaultImage(null);
                       } */
                    }
                    } />
                  <button onClick={() => {
                    setDefaultImage(null);
                    setChangedDefaultImage(false);
                    document.querySelector('input[name="ogImage"]').value = ""; // Clear the file input
                  }}>Remove Image</button>
                </div>
              </div>

              <div id="twittercardtype" className="formlabelvertical">
                <label className="flex flex-row gap-5 items-center">
                  Twitter Card Type
                  <Popupicon field="twitterCardType" />

                </label>
                <select {...register("twitterCardType")}>
                  <option value="">none</option>
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="summary">summary</option>

                  <option value="player">player</option>
                </select>
              </div>

              <div id="ogsitename" className="formlabelvertical">
                <label className="flex flex-row gap-5 items-center">
                  OG Site Name
                  <Popupicon field="OGSitename" />

                </label>
                <input {...register("ogSitename")} />
              </div>

            </div>
            <div id="robots" className="formlabelvertical">
              <label className="flex flex-row gap-5 items-center">
                Robots
                <Popupicon field="robots" />

              </label>
              <select {...register("robots")}>
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>

            <div id="hreflang" className="formlabelvertical">
              <label className="flex flex-row gap-5 items-center">
                Hreflang
                <Popupicon field="hreflang" />

              </label>
              <input {...register("hreflang")} />
            </div>
            <div id="canonical" className="formlabelvertical">
              <label className="flex flex-row gap-5 items-center">
                Canonical URL
                <Popupicon field="canonicalUrl" />

              </label>
              <input {...register("canonicalUrl")} disabled className="cursor-not-allowed" />
            </div>


            <div id="ogtype" className="formlabelvertical">
              <label className="flex flex-row gap-5 items-center">
                OG Type
                <Popupicon field="ogType" />

              </label>
              <input {...register("ogType")} disabled className="cursor-not-allowed" />
            </div>
          </div>

        </form>
      </div>
    </>
  );
}
