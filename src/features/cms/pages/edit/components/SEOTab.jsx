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
  // The file picked in this edit, and an object URL to preview it. The URL is
  // revoked whenever it is replaced, and on unmount.
  const [ogImageFile, setOgImageFile] = useState(null);
  const [ogImagePreview, setOgImagePreview] = useState(null);
  // Remove Image was clicked: the save asks the backend to drop the page's
  // own image (it falls back to the site default). Picking a file undoes it.
  const [removeOgImage, setRemoveOgImage] = useState(false);
  useEffect(() => {
    return () => {
      if (ogImagePreview) URL.revokeObjectURL(ogImagePreview);
    };
  }, [ogImagePreview]);

  const clearPickedImage = () => {
    setOgImageFile(null);
    setOgImagePreview(null);
    setChangedDefaultImage(false);
    const fileInput = document.querySelector('input[name="ogImage"]');
    if (fileInput) fileInput.value = ""; // Clear the file input
  };

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
        let url = `${process.env.NEXT_PUBLIC_API_URL}/seo/pagespecificseo?pageid=${pageid}`;
        const response = await fetch(url, {
          method: "GET",
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
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
        }


      } catch (error) {
      }
    };

    fetchData();
  }, [triggerSEOrefresh]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === "ogImage") {
        // Only a file picked in this edit is sent; without one the backend
        // keeps the page's current image.
        if (changeddefaultimg && ogImageFile) {
          const fileType = ogImageFile.name.split('.').pop();
          const renamedFile = new File([ogImageFile], `${pageid}.${fileType}`, { type: ogImageFile.type });
          formData.append(key, renamedFile);
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
        formData.append(key, data[key]);
      }
    }

    formData.append("pageid", pageid);
    formData.append("changeddefaultimage", changeddefaultimg && !!ogImageFile);
    formData.append("removeogimage", removeOgImage && !ogImageFile);
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
      // The upload is saved: a second save must not send it again. The
      // refetch below shows the page's stored image in its place.
      clearPickedImage();
      setRemoveOgImage(false);
      // A counter, as PageContentTab does: dispatching `true` twice is no
      // change, so the second save never refetched.
      dispatch(setTriggerSEORefresh(triggerSEOrefresh + 1));
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
    if (name === "metaTitle") {
      if (value !== "") {
        setChangedDefaultMetaTitle(true);
        setValue("custommetaTitle", true); // Set custommetaTitle to true if metaTitle is not empty
      }
      else {
        setChangedDefaultMetaTitle(false);
        setValue("custommetaTitle", false); // Set custommetaTitle to false if metaTitle is empty
      }
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

              <button type="submit" className="ui-btn ui-btn-primary ml-3" >Save SEO Settings</button>
            </div>
          </div>
          <div id="metatagscontent" >
            <div className="flex flex-row">
              <div className="formlabelvertical">

                <label className="flex flex-row gap-5 items-center">
                  Meta Title
                  <Popupicon field="metaTitle" />
                </label>
                <input {...register("metaTitle", { onChange: checkifdefaultchanged })} />
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
                <textarea {...register("metaDescription", { onChange: checkifdefaultchanged })} />

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
                  <input {...register("ogTitle", { onChange: checkifdefaultchanged })} />
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
                  <textarea {...register("ogDescription", { onChange: checkifdefaultchanged })} />
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

                {ogImageFile && ogImagePreview ? (
                  <>
                    <p>Selected Image: {ogImageFile.name}</p>
                    <img src={ogImagePreview} alt="Selected OG image" width="200" />
                  </>
                ) : defaultimg && (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}/${defaultimg}`} alt="Current OG image" width="200" />
                )}
                <div className="flex justify-between">
                  <input {...register("ogImage")} name="ogImage" type="file" accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setOgImageFile(file);
                        setOgImagePreview(URL.createObjectURL(file));
                        setChangedDefaultImage(true);
                        setRemoveOgImage(false);
                      } else {
                        clearPickedImage();
                      }
                    }
                    } />

                  <button type="button" className="ui-btn ui-btn-secondary" onClick={() => {
                    setDefaultImage(null);
                    clearPickedImage();
                    setRemoveOgImage(true);
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
