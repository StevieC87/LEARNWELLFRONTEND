'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { updateField, setSlugDuplicateWarning, setTriggerSEORefresh } from '@/redux/slices/PagesSlice';


export default function SEOTab(props) {
  // const searchParams = useSearchParams();

  const dispatch = useDispatch();
  const { pageid } = props
  console.log(typeof pageid, "typeofpageidinSEOTab");
  // const pageid = searchParams.get('pageid');
  const [showsuccess, setShowSuccess] = useState(false);
  const [showerror, setShowError] = useState(false);

  const [defaultimg, setDefaultImage] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      metaTitle: "",
      metaDescription: "",
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

  //FETCH SEO SETTINGS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/pagespecificseo?pageid=${pageid}`, {
          method: "GET",
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          console.log("FetchedSEOsettings:", data);
          reset({
            metaTitle: data.metatitle || "",
            metaDescription: data.metadescription || "",
            robots: data.robots || "",
            canonicalUrl: data.canonicalurl || "",
            hreflang: data.hreflang || "",
            ogImage: data.ogimage || "",
            ogType: "", //e,g. article, image etc 
            //NEED TO SET THIS MAYBE IN schema 
            twitterCardType: "",
            ogTitle: data.metatitle || "",
            customOGTitle: data.customogtitle || "",
            ogDescription: data.metadescription || "",
            customOGdescription: data.customOGdescription || "",
            ogSitename: data.ogsitename || "",
          });
          setDefaultImage(data.ogimage || null);
          //  console.log(result, "")
        }
        else if (!response.ok) {
          console.error("FailedtofetchSEOsettings");
        }


      } catch (error) {
        console.error("Error fetching SEO settings:", error);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${defaultimg}`);
            const blob = await response.blob();
            const file = new File([blob], `${pageid}.${filetype}`, { type: blob.type });
            console.log(file, "defaultimgfileobject");
            formData.append("ogImage", file);
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

      } else {
        console.log("Appending key:", key, "with value:", data[key]);
        formData.append(key, data[key]);
      }
    }
    console.log(formData, "formData");

    formData.append("pageid", pageid);

    const response = await fetch("http://localhost:3000/savepagespecificSEO",
      {
        method: "POST",
        credentials: 'include',
        body: formData
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





  return (
    <>
      <h1>Page-Specific SEO Settings</h1>
      {showsuccess && <div className="alert alert-success">SEO settings saved.</div>}
      {showerror && <div className="alert alert-danger">Error saving SEO settings.</div>}

      <form className="seoform" onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: 24 }}>
        <div className="flex justify-end">
          <button className="button button-primary" type="submit">Save SEO Settings</button>
        </div>

        <div id="metatagscontent" >
          <div className="formlabelvertical">
            <label>
              Meta Title - <span className="labeltip1">Shown in browser tab and search results.</span>
              <p className="labeltip2">Tip: Keep under 60–64 characters. Keep it concise and unique per page.</p>
            </label>
            <input {...register("metaTitle")} />
          </div>

          <div className="formlabelvertical">
            <label>
              Meta Description - <span className="labeltip1">Displayed in search engine results.</span>
              <p className="labeltip2">Tip: Keep under 155–160 characters.</p>
            </label>
            <input {...register("metaDescription")} />
          </div>

          <div className="formlabelvertical">
            <label>
              Robots - <span className="labeltip1">Controls search engine indexing.</span>
              <p className="labeltip2">Tip: Example: index, follow. Use noindex for drafts or private pages</p>
            </label>
            <input {...register("robots")} />
          </div>

          <div className="formlabelvertical">
            <label>
              Canonical URL - <span className="labeltip1">Preferred URL for this page.</span>
              <p className="labeltip2">Avoids duplicate content issues. One per page.
                .             Tip: Use absolute URL (e.g. https://example.com/page)</p>
            </label>
            <input {...register("canonicalUrl")} />
          </div>

          <div className="formlabelvertical">
            <label>
              Hreflang - <span className="labeltip1">Language/region alternate URLs.</span>
              <p className="labeltip2">Required for multilingual SEO. Matches language and regional versions. Use ISO codes.
                Tip: Format: en:/en, fr:/fr</p>
            </label>
            <input {...register("hreflang")} />
          </div>

          <div className="formlabelvertical">
            <label>
              OG Type - <span className="labeltip1">Open Graph object type.</span>
              <p className="labeltip2">Tip: Example: website, article, product. Required by OG. Select based on content type.
              </p>
            </label>
            <input {...register("ogType")} />
          </div>

          <div className="formlabelvertical">
            <label>
              OG Image - <span className="labeltip1">Image for social sharing.</span>
              <p className="labeltip2">Tip: Recommended size: 1200x630px. Use JPG/PNG. Should be visually appealing, not text-heavy.
              </p>
            </label>

            {defaultimg && (
              <>
                <p>Selected Default Image: {defaultimg.name}. Leave file input empty to keep</p>
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

          <div className="formlabelvertical">
            <label>
              Twitter Card Type - <span className="labeltip1">Type of Twitter card.</span>
              <p className="labeltip2">Use summary_large_image for rich previews. Set explicitly.

              </p>
            </label>
            <input {...register("twitterCardType")} />
          </div>

          <div className="formlabelvertical">
            <label>
              OG Title - <span className="labeltip1">Title for Open Graph (social sharing).</span>
              <p className="labeltip2">Tip: Should match or complement Meta Title. Used by Facebook, LinkedIn, etc.</p>
            </label>
            <input {...register("ogTitle")} />
          </div>
          <div className="formlabelvertical">
            <label>
              Custom OG Title  <span className="labeltip1">Title for Open Graph (social sharing).</span>
              <p className="labeltip2">If you want to override default which is based on page title</p>
            </label>
            <input {...register("customOGTitle")} />
          </div>

          <div className="formlabelvertical">
            <label>
              OG Description - <span className="labeltip1">Description for Open Graph.</span>
              <p className="labeltip2">Tip: Should match or complement Meta Description. Used by social platforms.</p>
            </label>
            <input {...register("ogDescription")} />
          </div>
          <div className="formlabelvertical">
            <label>
              Custom OG Title  <span className="labeltip1">Custom description for Open Graph (social sharing).</span>
              <p className="labeltip2">If you want to override default which is based on meta description - otherwise leave blank</p>
            </label>
            <input {...register("customOGdescription")} />
          </div>

          <div className="formlabelvertical">
            <label>
              OG Site Name - <span className="labeltip1">Name of your website for Open Graph.</span>
              <p className="labeltip2">Tip: Example: Your Brand Name. Used by Facebook, LinkedIn, etc.</p>
            </label>
            <input {...register("ogSitename")} />
          </div>
        </div>

      </form>
    </>
  );
}
