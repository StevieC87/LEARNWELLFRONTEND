"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

export default function WebsiteDetailsForm() {
  const defaultlanguage = useSelector((state) => state.DashSlice.settings.defaultlanguage);
  const { register, handleSubmit, reset } = useForm({
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
    const fetchsitedetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/sitedetails`, {
          method: "GET",
          credentials: 'include', // Include cookies in the request
        });
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
        } else {
          console.log("Failed to fetch site details");
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
    if (defaultImageFile) formData.append("defaultImage", defaultImageFile);
    if (logoFile) formData.append("logo", logoFile);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/sitedetails`, {
      method: "POST",
      credentials: 'include',
      body: formData,
      headers: {
        "X-CSRF-Token": csrfToken // Include CSRF token in the request headers
      }
    });

    if (response.ok) {


    };
  }
  /*   setShowSuccess(true);
       setShowError(false);
       setTimeout(() => setShowSuccess(false), 3000);
     } else {
       setShowError(true);
       setShowSuccess(false);
       setTimeout(() => setShowError(false), 3000); */
  return (
    <>


      <form className="seoform" onSubmit={handleSubmit(onSubmit)}>
        <div className="titlebuttons">
          <div>
            <h1>Website Details</h1>
            <span>for default language {defaultlanguage} </span>
          </div>

          <button className="button button-primary " type="submit">Save SEO Settings</button>
        </div>
        <div className="flex justify-end">

        </div>
        <div className="formlabelvertical">
          <label>
            Website URL
            <span className="labeltip1"> The main address of your website.</span>
            <p className="labeltip2"> Tip: Use a valid URL (e.g., https://example.com).</p>
          </label>
          <input {...register("url")} />
        </div>
        <div className="formlabelvertical">
          <label>
            Brand Name
            <span className="labeltip1"> The public name of your website.</span>
            <p className="labeltip2"> Tip: Keep it short and recognizable.</p>
          </label>
          <input {...register("brandname")} />
        </div>
        {/*  <div className="formlabelvertical">
          <label>
            Website Description
            <span className="labeltip1"> Appears in search engines and link previews.</span>
            <p className="labeltip2"> Tip: Limit to 155–160 characters.</p>
          </label>
          <textarea {...register("description")} />
        </div> */}
        <div className="formlabelvertical">
          <label>
            Default OG Image
            <span className="labeltip1"> Used as the default preview image when social sharing.</span>
            <p className="labeltip2"> Tip: Use a clear, high-quality image wiht dimensions: 1600 x </p>
          </label>
          <img src={`${process.env.NEXT_PUBLIC_API_URL}/public/media${defaultImageFile}`} alt="Current Default Image" width="200" />

          <input
            type="file"
            accept="image/*"
            onChange={e => setDefaultImageFile(e.target.files[0])}
          />
          {/*   {defaultImageFile && (
            <p>Selected Default Image: {defaultImageFile.name}. Leave file input empty to keep</p>
          )} */}
        </div>
        <div className="formlabelvertical">
          <label>
            Logo
            <span className="labeltip1"> The logo displayed on your site.</span>
            <p className="labeltip2"> Tip: Use a transparent PNG or SVG for best results.</p>
          </label>
          <img src={`${process.env.NEXT_PUBLIC_API_URL}/public/media${logoFile}`} alt="Current Logo" width="200" />
          <input
            type="file"
            accept="image/*"

            onChange={e => setLogoFile(e.target.files[0])}
          />
          {/*  {logoFile && (
            <p>Selected Logo: {logoFile.name}.  Leave file input empty to keep</p>
          )} */}

        </div>

      </form>
    </>
  );
}