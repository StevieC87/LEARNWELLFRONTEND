'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

export default function PageSpecificSEO() {
  const [showsuccess, setShowSuccess] = useState(false);
  const [showerror, setShowError] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      metaTitle: "",
      metaDescription: "",
      robots: "",
      canonicalUrl: "",
      hreflangs: "",
      ogImage: "",
      ogType: "",
      twitterCardType: "",
      jsonldContext: "https://schema.org",
      jsonldType: "WebPage",
      jsonldName: "",
      jsonldDescription: "",
      jsonldUrl: "",
      jsonldInLanguage: "",
      jsonldImage: "",
      jsonldAuthor: "",
      jsonldDatePublished: "",
      jsonldDateModified: "",
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/pagespecificseo", {
          method: "GET",
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          reset({
            metaTitle: data.metaTitle || "",
            metaDescription: data.metaDescription || "",
            robots: data.robots || "",
            canonicalUrl: data.canonicalUrl || "",
            hreflangs: data.hreflangs || "",
            ogImage: data.ogImage || "",
            ogType: data.ogType || "",
            twitterCardType: data.twitterCardType || "",
            jsonldContext: data.jsonldContext || "https://schema.org",
            jsonldType: data.jsonldType || "WebPage",
            jsonldName: data.jsonldName || "",
            jsonldDescription: data.jsonldDescription || "",
            jsonldUrl: data.jsonldUrl || "",
            jsonldInLanguage: data.jsonldInLanguage || "",
            jsonldImage: data.jsonldImage || "",
            jsonldAuthor: data.jsonldAuthor || "",
            jsonldDatePublished: data.jsonldDatePublished || "",
            jsonldDateModified: data.jsonldDateModified || "",
          });
          console.log(result, "")
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
              Hreflangs - <span className="labeltip1">Language/region alternate URLs.</span>
              <p className="labeltip2">Required for multilingual SEO. Matches language and regional versions. Use ISO codes.
                Tip: Format: en:/en, fr:/fr</p>
            </label>
            <input {...register("hreflangs")} />
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
              Image - <span className="labeltip1">Image for social sharing.</span>
              <p className="labeltip2">Tip: Recommended size: 1200x630px. Use JPG/PNG. Should be visually appealing, not text-heavy.
              </p>
            </label>
            <input {...register("ogImage")} type="file" accept="image/*" />
          </div>

          <div className="formlabelvertical">
            <label>
              Twitter Card Type - <span className="labeltip1">Type of Twitter card.</span>
              <p className="labeltip2">Use summary_large_image for rich previews. Set explicitly.

              </p>
            </label>
            <input {...register("twitterCardType")} />
          </div>
        </div>

      </form>
    </>
  );
}
