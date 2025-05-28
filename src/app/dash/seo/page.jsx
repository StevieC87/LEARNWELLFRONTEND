'use client';
import { set, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
export default function SiteWideSEO() {

  const [showsuccess, setShowSuccess] = useState(false);
  const [showerror, setShowError] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      defaultTitle: "",
      defaultDescription: "",
      image: "",
      siteName: "",
      defaultCanonicalBase: "",
      twitterCardType: "",
      defaultRobots: "",
      defaultLanguage: "",
    }
  });

  useEffect(() => {

    const fetchData = async () => {
      try {
        console.log('helloooooooooo')
        const response = await fetch("http://localhost:3000/sitewideseo", {
          method: "GET",
          credentials: 'include', // Include cookies in the request
        });
        if (response.ok) {
          console.log('response okkkkkkkkkkkkk')
          const data = await response.json();
          console.log("Fetched SEO settings:", data);
          console.log(data.defaultTitle, "default title from data");
          // Set the form values with the fetched data
          reset({
            defaultTitle: data.defaultTitle || "",
            defaultDescription: data.defaultDescription || "",
            image: data.image || "",
            siteName: data.siteName || "",
            defaultCanonicalBase: data.defaultCanonicalBase || "",
            twitterCardType: data.twitterCardType || "",
            defaultRobots: data.defaultRobots || "",
            defaultLanguage: data.defaultLanguage || "",
          });
        }
      } catch (error) {
        console.error("Error fetching SEO settings:", error);
      }
    }

    fetchData();

  }, []);



  const onSubmit = async (data) => {
    // handle form submission (e.g. save to server)
    //  console.log("SEO Settings:", data);
    const formData = new FormData();
    formData.append("defaultTitle", data.defaultTitle);
    formData.append("defaultDescription", data.defaultDescription);
    formData.append("siteName", data.siteName);
    formData.append("defaultCanonicalBase", data.defaultCanonicalBase);
    formData.append("twitterCardType", data.twitterCardType);
    formData.append("defaultRobots", data.defaultRobots);
    formData.append("defaultLanguage", data.defaultLanguage);

    // Get the file from the input manually
    const imageInput = document.querySelector('input[name="image"]');
    if (imageInput?.files?.[0]) {
      formData.append("image", imageInput.files[0]);
    }
    console.log(imageInput?.files[0], "Image file to be uploaded");
    const response = await fetch("http://localhost:3000/sitewideseo", {
      method: "POST",

      credentials: 'include', // Include cookies in the request
      body: formData,
    });
    if (response.ok) {
      const result = await response.json();
      console.log("SEO settings saved successfully:", result);
      setShowSuccess(true);
      setShowError(false);
      // Optionally, you can re set the form or show a success message
      //timeout
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000); // Hide success message after 3 seconds
    } else {
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => {
        setShowError(false);
      }, 3000); // Hide error message after 3 seconds


      console.error("Error saving SEO settings:", response.statusText);
      // Handle error case
    }

  };

  return (
    <>
      <h1>Site-Wide SEO Settings</h1>
      <p>Configure your site-wide SEO settings here.</p>
      {showsuccess && (
        <div className="alert alert-success text-green-500">
          <strong>Success!</strong> Your SEO settings have been saved.
        </div>
      )}
      {showerror && (
        <div className="alert alert-danger text-green-500 ">
          <strong>Error!</strong> There was a problem saving your SEO settings.
        </div>
      )}
      <form className="seoform" onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: 24 }}>
        <div className="flex justify-end">
          <button className="button button-primary" type="submit">Save SEO Settings</button>
        </div>
        <div className="formlabelvertical">
          <label>
            Default Title - <span className="labeltip1">Shown in browser tab and search results.</span>
            <p className="labeltip2"> Tip: Keep under 60–64 characters.</p>
          </label>
          <input {...register("defaultTitle")} />
        </div>
        <div className="formlabelvertical">
          <label>
            Default Description
            <span className="labeltip1"> Appears in search engines and link previews.</span>
            <p className="labeltip2"> Tip: Limit to 155–160 characters.</p>
          </label>
          <input {...register("defaultDescription")} />
        </div>
        <div className="formlabelvertical">
          <label>
            Default Image
            <span className="labeltip1"> Shown when sharing on social media platforms.</span>
            <p className="labeltip2"> Tip: Use 1200×630 px JPG or PNG.</p>
          </label>
          <input {...register("image")} type="file" accept="image/*" />
        </div>
        <div className="formlabelvertical">
          <label>
            Site Name
            <span className="labeltip1"> Displayed in Open Graph previews.</span>
            <p className="labeltip2"> Tip: Use your brand or website name.</p>
          </label>
          <input {...register("siteName")} />
        </div>
        <div className="formlabelvertical">
          <label>
            Default Canonical Base
            <span className="labeltip1"> Used to build canonical links.</span>
            <p className="labeltip2"> Tip: Full URL, e.g. https://example.com.</p>
          </label>
          <input {...register("defaultCanonicalBase")} />
        </div>
        <div className="formlabelvertical">
          <label>
            Twitter Card Type
            <span className="labeltip1"> Defines Twitter(X) preview format.</span>
            <p className="labeltip2"> Tip: Use summary_large_image.</p>
          </label>
          <input {...register("twitterCardType")} />
        </div>
        <div className="formlabelvertical">
          <label>
            Default Robots Directive
            <span className="labeltip1"> Tells search engines how to index the site.</span>
            <p className="labeltip2"> Tip: Use index, follow or noindex.</p>
          </label>
          <input {...register("defaultRobots")} />
        </div>
        <div className="formlabelvertical">
          <label>
            Default Language
            <span className="labeltip1"> Primary language ISO code.</span>
            <p className="labeltip2"> Tip: Use format like en, fr, de.</p>
          </label>
          <input {...register("defaultLanguage")} />
        </div>

      </form>
    </>
  );
}