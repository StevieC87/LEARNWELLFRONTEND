"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import MediaButtonogimage from "./MediaButtonogimage";
import MediaButtonlogo from "./MediaButtonlogo";
import { setDefaultOGImage, setLogo } from '@/redux/slices/UISlice';
export default function WebsiteDetailsForm() {
  const dispatch = useDispatch();
  const defaultlanguage = useSelector((state) => state.DashSlice.settings.defaultlanguage);
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      url: "",
      brandname: "",
      //  description: "",
      defaultImage: "",
      logo: "",
    }
  });

  const [logoFile, setLogoFile] = useState(null);
  const [defaultImageFile, setDefaultImageFile] = useState(null);
  const [defaultogimagethumb, setDefaultogimagethumb] = useState();

  const [defaultlogothumbnail, setDefaultlogothumbnail] = useState();

  const callingfrom = useSelector((state) => state.UISlice.callinsgfrom);

  const defaultogimage = useSelector((state) => state.UISlice.defaultogimage)
  const logo = useSelector((state) => state.UISlice.logo)

  const [saved, setSaved] = useState(false);
  const [errorsave, setErrorSave] = useState(false);

  useEffect(() => {
    setDefaultImageFile(defaultogimage.imagepath || "");
    setDefaultogimagethumb(defaultogimage.thumbnail || "");
    setDefaultlogothumbnail(logo.thumbnail || "");
    setLogoFile(logo.imagepath || "");
  }, [defaultogimage, logo])


  useEffect(() => {
    const fetchsitedetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/sitedetails`, {
          method: "GET",
          credentials: 'include', // Include cookies in the request
        });
        if (!response.ok) {
          console.log("Failed to fetch site details");
        }
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched site details:", data);
          reset({
            url: data.url || "",
            brandname: data.brandname || "",
            description: data.description || "",
            defaultImage: data.defaultImage || "",
            logo: data.logo || "",
          });

          setDefaultImageFile(data.defaultImage || "");
          setLogoFile(data.logo || "");
          dispatch(setDefaultOGImage({ imagepath: data.defaultImage || "" }));
          dispatch(setLogo({ imagepath: data.logo || "" }));

        }
      } catch (error) {
        console.log("Error fetching site details:", error);
      }
    }
    fetchsitedetails();
  }, []);


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("url", data.url);
    formData.append("brandname", data.brandname);
    // formData.append("description", data.description);
    //append default langauge 
    formData.append("defaultlanguage", defaultlanguage);
    if (defaultImageFile) {
      console.log('thereisdefaultogimagewhilesaving')
      console.log(defaultImageFile, "defaultImageFile");
      formData.append("defaultImage", defaultImageFile);
    }
    if (logoFile) formData.append("logo", logoFile);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/sitedetails`, {
      method: "POST",
      credentials: 'include',
      body: formData,
    });

    if (response.ok) {
      setSaved(true);
      setErrorSave(false);

      setTimeout(() => setSaved(false), 3000);
    }
    else {
      setSaved(false);
      setErrorSave(true);
    }



  };

  return (
    <>


      <form className="seoform" onSubmit={handleSubmit(onSubmit)}>
        <div className="titlebuttons">
          <div>
            <h1>Website Details</h1>
            <span>for default language {defaultlanguage} </span>
          </div>

          <button className="button button-primary " type="submit">
            {saved ? 'Saved!' : 'Save SEO Settings'}
            {errorsave && <span className="text-red-500">Failed to save. Please try again.</span>}
          </button>
        </div>
        <div className="flex justify-end">

        </div>
        <div className="formlabelvertical">
          <label>
            Website URL
            <span className="labeltip1"> The main address of your website.</span>
            <p className="labeltip2"> Tip: Use a valid URL (e.g., https://example.com).</p>
          </label>
          <input {...register("url")} value={watch("url") || ""} />
        </div>
        <div className="formlabelvertical">
          <label>
            Brand Name
            <span className="labeltip1"> The public name of your website.</span>
            <p className="labeltip2"> Tip: Keep it short and recognizable.</p>
          </label>
          <input {...register("brandname")} value={watch("brandname") || ""} />
        </div>

        <div className="formlabelvertical">
          <label>
            Default OG Image
            <span className="labeltip1"> Used as the default preview image when social sharing.</span>
            <p className="labeltip2"> Tip: Use a clear, high-quality image wiht dimensions: 1600 x </p>
          </label>

          <img src={`${process.env.NEXT_PUBLIC_API_URL}/public/media/${defaultImageFile}`} alt="Current Default Image" width="200" />

          <MediaButtonogimage
            name="defaultogimage"
            id="defaultogimage"
            type="frontendfield"
          //   sendbackimagecallback={image => sendbackimagecallback(image, 'defaultogimage')}
          //  sendbackimagecallback={sendbackimagecallback}
          />
          {/*   {defaultImageFile && (
            <p>Selected Default Image: {defaultImageFile}. Leave file input empty to keep</p>
          )} */}

        </div>
        <div className="formlabelvertical">
          <label>
            Logo
            <span className="labeltip1"> The logo displayed on your site.</span>
            <p className="labeltip2"> Tip: Use a transparent PNG or SVG for best results.</p>
          </label>

          <img src={`${process.env.NEXT_PUBLIC_API_URL}/public/media/${logoFile}`} alt="Logo" width="200" />

          <MediaButtonlogo
            name="logo"
            id="logo"
            type="frontendfield"
          />

        </div>

      </form >
    </>
  );
}
