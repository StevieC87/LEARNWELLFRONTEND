"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import PageTitle from '@/components/layout/PageTitle.jsx';
import '@/features/sites/settings/settings.css';

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
  const [saveState, setSaveState] = useState('');
  const [defaultImageFile, setDefaultImageFile] = useState(null);
  // The two *File states hold the saved path until a file is picked, then the
  // File itself; the preview needs a URL for either.
  const [logoPreview, setLogoPreview] = useState('');
  const [defaultImagePreview, setDefaultImagePreview] = useState('');
  const savedMediaUrl = (path) => (path ? `${process.env.NEXT_PUBLIC_API_URL}/public/media${path}` : '');
  const pickFile = (setFile, setPreview) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPreview((old) => {
      if (old.startsWith('blob:')) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
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

  useEffect(() => {
    const fetchsitedetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/sitedetails`, {
          method: "GET",
          credentials: 'include', // Include cookies in the request
        });
        if (response.ok) {
          const data = await response.json();
          reset({
            url: data.url || "",
            brandname: data.brandname || "",
            description: data.description || "",
            defaultImage: data.defaultImage || "",
            logo: data.logo || "",
          });
          setDefaultImageFile(data.defaultImage || "");
          setLogoFile(data.logo || "");
          setDefaultImagePreview(savedMediaUrl(data.defaultImage));
          setLogoPreview(savedMediaUrl(data.logo));
        } else {
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

    setSaveState(response.ok ? 'saved' : 'error');
    setTimeout(() => setSaveState(''), 3000);
  }
  return (
    <form className="settings-page sitedetails" onSubmit={handleSubmit(onSubmit)}>
      <PageTitle icon="page" title="Website details">
        These details are for the default language, {defaultlanguage}.
      </PageTitle>
      <section className="card settings-card">
        <header className="settings-card-head">
          <h3>Your website</h3>
          <p>Its address, name and pictures, used in search results and when a page is shared.</p>
        </header>
        <div className="settings-fields">
          <div className="settings-field">
            <div className="settings-field-label">
              <label htmlFor="sd-url">Website address</label>
              <p>The full address, for example https://example.com.</p>
            </div>
            <div className="settings-field-control">
              <input id="sd-url" type="url" className="ui-input" placeholder="https://example.com" {...register("url")} />
            </div>
          </div>
          <div className="settings-field">
            <div className="settings-field-label">
              <label htmlFor="sd-brand">Brand name</label>
              <p>The public name of your website. Short and easy to recognise.</p>
            </div>
            <div className="settings-field-control">
              <input id="sd-brand" type="text" className="ui-input" {...register("brandname")} />
            </div>
          </div>
          <div className="settings-field">
            <div className="settings-field-label">
              <label htmlFor="sd-image">Share image</label>
              <p>Shown when a page without its own image is shared on social media. 1200 × 630 works everywhere.</p>
            </div>
            <div className="settings-field-control">
              {defaultImagePreview && <img className="sitedetails-preview is-wide" src={defaultImagePreview} alt="Current share image" onError={(e) => { e.currentTarget.hidden = true; }} />}
              <input id="sd-image" type="file" accept="image/*" onChange={pickFile(setDefaultImageFile, setDefaultImagePreview)} />
            </div>
          </div>
          <div className="settings-field">
            <div className="settings-field-label">
              <label htmlFor="sd-logo">Logo</label>
              <p>Shown on your site. A transparent PNG or an SVG looks best.</p>
            </div>
            <div className="settings-field-control">
              {logoPreview && <img className="sitedetails-preview" src={logoPreview} alt="Current logo" onError={(e) => { e.currentTarget.hidden = true; }} />}
              <input id="sd-logo" type="file" accept="image/*" onChange={pickFile(setLogoFile, setLogoPreview)} />
            </div>
          </div>
        </div>
        <footer className="settings-card-foot">
          {saveState === 'error' && <span className="is-error" role="alert">Couldn&apos;t save. Try again.</span>}
          {saveState === 'saved' && <span role="status">Saved</span>}
          <button className="ui-btn ui-btn-primary" type="submit">Save changes</button>
        </footer>
      </section>
    </form>
  );
}
