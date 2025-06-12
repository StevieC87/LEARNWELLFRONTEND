'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';



export default function PageSpecificSEO() {
  const searchParams = useSearchParams();



  const pageid = searchParams.get('pageid');
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
      ogDescription: "",
      ogSitename: "",
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/seo/pagespecificseo?pageid=${pageid}`, {
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
            ogDescription: data.metadescription || "",
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
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === "ogImage") {
        const fileInput = document.querySelector(`input[name="${key}"]`);
        if (fileInput?.files?.[0]) {
          formData.append(key, fileInput.files[0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    }

    const response = await fetch("http://localhost:3000/sitewideseo", {
      method: "POST",
      credentials: 'include',
      body: formData,
    });

    if (response.ok) {
      /*   setShowSuccess(true);
        setShowError(false);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError(true);
        setShowSuccess(false);
        setTimeout(() => setShowError(false), 3000); */
    }

  };

  const field = (name, label, tip = "", type = "text") => (
    <div className="formlabelvertical">
      <label>
        {label}
        {tip && <><span className="labeltip1"> {tip}</span></>}
      </label>
      <input {...register(name)} type={type} accept={type === "file" ? "image/*" : undefined} />
    </div>
  );

  const Arraymetafieldsinfo = [
    {
      field: "metaTitle",
      info: "Shown in browser tab and search results. Keep under 60–64 characters. Keep it concise and unique per page. By default, it uses the page title but you can edit it and make it 'custom'. After you make it 'custom', it will not change automatically if you change the page title, until you make it 'default' again and save",
    },
    {
      field: "metaDescription",
      info: "Displayed in search engine results. Keep under 155–160 characters. By default, it uses the page summary but you can edit it and make it 'custom'. After you make it 'custom', it will not change automatically if you change the page summary, until you make it 'default' again and save",
    },
    {
      field: "ogTitle",
      info: "This is the title that will be shown when the page is shared on social media platforms like Facebook, Twitter, LinkedIn, etc. By default it uses the page title but you can edit it and make it 'custom'. After you make it 'custom', it will not change automatically if you change the Ppage title, until you make it 'default' again and save",
    },
    {
      field: "ogDescription",
      info: "Description for Open Graph. Should match or complement Meta Description. Used by social platforms. By default, it uses the 'summary' field but you can edit it and make it 'custom'. After you make it 'custom', it will not change automatically if you change the 'summary' field, until you make it 'default' again and save",
    },
    {
      field: "ogImage",
      info: "Image for social sharing. This is what will be shown when the page is shared on social media platforms like Facebook, Twitter, LinkedIn, etc. Recommended size: 1200x630px. Minimum recommended image size: 300×157 pixels. Use JPG/ PNG/WEBP format. By default will use the default image set in the Site Details section."
    },
    {
      field: "twitterCardType",
      info: "This is for sharing on X (former Twitter). If the OG Image is size: 1200x630px, then you can use 'summary_large_image'. If the image is smaller, then select 'summary'. "
    },
    {
      field: "OGSitename",
      info: "Name of your website  This is what will be shown when the page is shared on social media platforms like Facebook, Twitter, LinkedIn, etc. By default, it uses the site name set in the Site Details section."
    },
    {
      field: "robots",
      info: "This is for search engines. The default is index,follow which means search engines can index this page and follow links on it. You can change it to noindex, nofollow to prevent search engines, for drafts or private pages."
    },
    {
      field: "canonicalUrl",
      info: "Preferred URL for this page. Avoids duplicate content issues. One per page."
    },
    {
      field: "hreflang",
      info: "This is for multilingual SEO. Matches language and regional versions. Use ISO codes. Example: en:/en, fr:/fr. Required for multilingual sites to indicate language/region alternate URLs."
    },
    {
      field: "ogType",
      info: "Open Graph object type. Example: website, article, product. Required by Open Graph protocol. Select based on content type."
    }

  ]

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

            <input {...register("ogImage")} type="file" accept="image/*"
              onChange={(e) => {
                setDefaultImage(e.target.files[0]);
                /*  const file = e.target.files[0];
                 if (file) {
                   setDefaultImage(URL.createObjectURL(file));
                 } else {
                   setDefaultImage(null);
                 } */
              }
              } />

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
              OG Description - <span className="labeltip1">Description for Open Graph.</span>
              <p className="labeltip2">Tip: Should match or complement Meta Description. Used by social platforms.</p>
            </label>
            <input {...register("ogDescription")} />
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
