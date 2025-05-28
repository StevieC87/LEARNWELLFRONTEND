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
      metaKeywords: "",
      hreflangs: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      ogType: "",
      ogUrl: "",
      siteName: "",
      twitterCardType: "",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
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
        const response = await fetch("http://localhost:3000/sitewideseo", {
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
            metaKeywords: data.metaKeywords || "",
            hreflangs: data.hreflangs || "",
            ogTitle: data.ogTitle || "",
            ogDescription: data.ogDescription || "",
            ogImage: data.ogImage || "",
            ogType: data.ogType || "",
            ogUrl: data.ogUrl || "",
            siteName: data.siteName || "",
            twitterCardType: data.twitterCardType || "",
            twitterTitle: data.twitterTitle || "",
            twitterDescription: data.twitterDescription || "",
            twitterImage: data.twitterImage || "",
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
      if (key === "ogImage" || key === "twitterImage") {
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
      setShowSuccess(true);
      setShowError(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 3000);
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
      <h1>Site-Wide SEO Settings</h1>
      {showsuccess && <div className="alert alert-success">SEO settings saved.</div>}
      {showerror && <div className="alert alert-danger">Error saving SEO settings.</div>}

      <form className="seoform" onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: 24 }}>
        <div className="flex justify-end">
          <button className="button button-primary" type="submit">Save SEO Settings</button>
        </div>

        <div className="formlabelvertical">
          <label>Meta Title</label>
          <input {...register("metaTitle")} />
        </div>

        <div className="formlabelvertical">
          <label>Meta Description</label>
          <input {...register("metaDescription")} />
        </div>

        <div className="formlabelvertical">
          <label>Meta Keywords (deprecated)</label>
          <input {...register("metaKeywords")} />
        </div>

        <div className="formlabelvertical">
          <label>Robots</label>
          <input {...register("robots")} />
        </div>

        <div className="formlabelvertical">
          <label>Canonical URL</label>
          <input {...register("canonicalUrl")} />
        </div>

        <div className="formlabelvertical">
          <label>Hreflangs (e.g. en:/en, fr:/fr)</label>
          <input {...register("hreflangs")} />
        </div>

        <div className="formlabelvertical">
          <label>OG Title</label>
          <input {...register("ogTitle")} />
        </div>

        <div className="formlabelvertical">
          <label>OG Description</label>
          <input {...register("ogDescription")} />
        </div>

        <div className="formlabelvertical">
          <label>OG Type</label>
          <input {...register("ogType")} />
        </div>

        <div className="formlabelvertical">
          <label>OG URL</label>
          <input {...register("ogUrl")} />
        </div>

        <div className="formlabelvertical">
          <label>OG Image</label>
          <input {...register("ogImage")} type="file" accept="image/*" />
        </div>

        <div className="formlabelvertical">
          <label>Site Name</label>
          <input {...register("siteName")} />
        </div>

        <div className="formlabelvertical">
          <label>Twitter Card Type</label>
          <input {...register("twitterCardType")} />
        </div>

        <div className="formlabelvertical">
          <label>Twitter Title</label>
          <input {...register("twitterTitle")} />
        </div>

        <div className="formlabelvertical">
          <label>Twitter Description</label>
          <input {...register("twitterDescription")} />
        </div>

        <div className="formlabelvertical">
          <label>Twitter Image</label>
          <input {...register("twitterImage")} type="file" accept="image/*" />
        </div>

        {/* JSON-LD Fields */}
        {/*    <h2>JSON-LD Structured Data</h2>
        <div className="formlabelvertical">
          <label>@context</label>
          <input {...register("jsonldContext")} readOnly />
        </div>
        <div className="formlabelvertical">
          <label>@type</label>
          <select {...register("jsonldType")}>
            <option value="WebPage">WebPage</option>
            <option value="Article">Article</option>
            <option value="Product">Product</option>
            <option value="BlogPosting">BlogPosting</option>
            <option value="NewsArticle">NewsArticle</option>
            <option value="Event">Event</option>
            <option value="Person">Person</option>
            <option value="Organization">Organization</option>
            
          </select>
        </div>
        <div className="formlabelvertical">
          <label>Name (JSON-LD)</label>
          <input {...register("jsonldName")} />
        </div>
        <div className="formlabelvertical">
          <label>Description (JSON-LD)</label>
          <input {...register("jsonldDescription")} />
        </div>
        <div className="formlabelvertical">
          <label>URL (JSON-LD)</label>
          <input {...register("jsonldUrl")} />
        </div>
        <div className="formlabelvertical">
          <label>inLanguage (ISO code, e.g. en)</label>
          <input {...register("jsonldInLanguage")} />
        </div>
        <div className="formlabelvertical">
          <label>Image URL(s) (comma separated for multiple)</label>
          <input {...register("jsonldImage")} />
        </div>
        <div className="formlabelvertical">
          <label>Author (name or Person object as JSON)</label>
          <input {...register("jsonldAuthor")} />
        </div>
        <div className="formlabelvertical">
          <label>Date Published (ISO 8601)</label>
          <input {...register("jsonldDatePublished")} type="datetime-local" />
        </div>
        <div className="formlabelvertical">
          <label>Date Modified (ISO 8601)</label>
          <input {...register("jsonldDateModified")} type="datetime-local" />
        </div> */}
        {/* End JSON-LD Fields */}
      </form>
    </>
  );
}
