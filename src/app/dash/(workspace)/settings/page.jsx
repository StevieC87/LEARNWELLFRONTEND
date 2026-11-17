'use client';

import { useState, useEffect } from 'react';
import '@/features/sites/settings/settings.css';
import '@/features/account/settings.css';
//redirect refrech roter
import { useRouter } from 'next/navigation';
import { set } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  setEnableUserRegistration, setSelectedLanguage,
  setMultilingualSharedId,
  setPageExistsThisLanguage
} from '@/redux/slices/DashSlice'; // Import the action to set settings
import { redirect } from 'next/navigation';
import PageTitle from "@/components/layout/PageTitle.jsx";

//! KEEP IT SIMPLE, IM STARTING WITHA NEW BOLERPLATE EVERYT IME, 
//!I CAN ADAPT THE CODE EASILY TO ADD NEW LANGUAGES 
//! WE NEED THIS FOR: IN ORDER TO SET LANGUAGES PROBABLY IN THE BEGINNING, DECIDE IF MULTILINGAUL OR NOT, AND SET LANGUAGES FOR LATER 

//DEFAULT LANGUAGE 
export default function Settings() {
  const dispatch = useDispatch(); // Initialize the Redux dispatch function
  const router = useRouter();

  const [multilingualvalue, setMultilingualValue] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState(); // Default language 
  const [languages, setLanguages] = useState([
    "en", "fr", "de"// Default languages, you can add more
    /*  { name: 'English', code: 'en' },
     { name: 'French', code: 'fr' },
     { name: 'German', code: 'de' },
     { name: 'Spanish', code: 'es' }, */
  ]);
  const [languageselectionfromdb, setLanguageSelectionFromDb] = useState(false); // This will hold the languages from the database
  const changeMultilingualValue = (e) => {
    //change from previous state based on 
    setMultilingualValue(prev => !prev);

  };
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [additionalanguagetoadd, setAdditionalLanguageToAdd] = useState('');
  const [addedlanguage, setAddedLanguage] = useState(0); // This will hold the language to be added

  const [langlocales, setLangLocales] = useState({}); // This will hold the locales for 

  const [defaultlanglocalemonol, setDefaultLangLocaleMonol] = useState('')

  const [publicuserregistration, setPublicUserRegistration] = useState(false); // This will hold the public user registration setting

  const [saved, setSaved] = useState(false); // This will hold the saved state
  const [errorsave, setErrorSave] = useState(''); // This will hold the error save state



  // each language
  //example: { 
  // en: 'en-US',
  //  fr: 'fr-FR', 
  // e: 'de-DE' 


  //first I NEED TO POPULATE THE VALUES FROM THE DATABASE 
  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/getsettings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // this is what sends/receives cookie
      });
      if (!response.ok) {
        const data = await response.json();
        //console.error(data);
        redirect('/dash');

        return;
      }
      const data = await response.json();
      //IF THEY ARE NOT EMPTY - THEN WE REPLACE 
      if (data.multilingual !== undefined) {
        setMultilingualValue(data.multilingual);
      }
      if (data.defaultlanguage !== '') {
        setDefaultLanguage(data.defaultlanguage);
      }
      let object11 = {};
      if (data.languages && Array.isArray(data.languages)) {
        setLanguages(data.languages);
        setLanguageSelectionFromDb(true);
        setSelectedLanguages(data.languages); // or data.selectedLanguages if 
        setLangLocales(data.langlocales)
        setDefaultLangLocaleMonol(data.defaultlanglocalemonol || ''); // Set the default language locale for monolingual mode
        setPublicUserRegistration(data.publicuserregistration || false); // Set the public user registration setting

        /*   data.languages.map((lang) => {
            console.log('langlocaleslanglocaleslanglocales', lang);
            
                // setLangLocales(prev => ({ ...prev, [lang]: data.langlocales[lang] }));
                object11[lang] = '123';
              // else {
              // setLangLocales(prev => ({ ...prev, [lang]: `$ // {lang}-${lang.toUpperCase()}` })); // Default //locale format
          //  } 
          }) */
        // console.log(object11, " langlocaleslanglocaleslanglocales object11object11object11");

      }
      // setMultilingualValue(data.multilingual);
      //  setLanguages(data.languages);
    };
    fetchSettings();


  }, [addedlanguage]);


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
  const onSave = async () => {


    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/savesettings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken, // Include CSRF token in the headers
      },
      body: JSON.stringify({
        multilingual: multilingualvalue,
        defaultlanguage: defaultLanguage,
        languages: selectedLanguages,
        langlocales: langlocales, // Send the locales for each language
        defaultlanglocalemonol: defaultlanglocalemonol, // Send the default language locale for monolingual mode
        publicuserregistration: publicuserregistration, // Send the public user registration setting

      }),
      credentials: 'include', // this is what sends/receives cookie
    });
    if (!response.ok) {
      const data = await response.json();
      setErrorSave('Failed to save settings. Please try again.'); // Set the error save state
      setSaved(false); // Set the saved state to false
      setTimeout(() => {
        setErrorSave(''); // Reset error save state after 3 seconds
      }, 3000);
      return;
    }
    const data = await response.json();
    dispatch(setEnableUserRegistration(publicuserregistration)); // Dispatch the action to set user registration setting
    dispatch(setSelectedLanguage(defaultLanguage)); // Dispatch the action to set selected language
    dispatch(setMultilingualSharedId(multilingualvalue ? 'multilingual' : 'monolingual')); // Dispatch the action to set multilingual shared ID
    dispatch(setPageExistsThisLanguage(selectedLanguages.includes(defaultLanguage))); // Dispatch the action to set page exists this language
    setSaved(true); // Set the saved state to true
    setTimeout(() => {
      setSaved(false); // Reset saved state after 3 seconds
    }, 3000);
    setErrorSave(''); // Reset error save state

  };

  const includelanguagesarray = [
    "en", "fr", "de", "es", "it", "pt", "ru", "zh", "ja", "ko" // Add more languages as needed
  ]
  const [otherlanguages, setOtherLanguages] = useState([]);

  useEffect(() => {
    const filterothers = includelanguagesarray.filter(lang => !languages.includes(lang));
    setOtherLanguages(filterothers);
    setAdditionalLanguageToAdd(filterothers[0])
  }, [languages, selectedLanguages]);

  let languagetoadd;
  const addAditionallanguage1 = async () => {
    //we do post fetch to include language in the array of languages
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/addlanguage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken, // Include CSRF token in the headers
      },
      body: JSON.stringify({
        language: additionalanguagetoadd, // Use the selected language to add
      }),
      credentials: 'include', // this is what sends/receives cookie
    });
    if (!response.ok) {
      const data = await response.json();
      return;
    }
    const data = await response.json();
    setAddedLanguage(prev => prev + 1); // Increment the added language count
    //router.refresh();



  }

  const addlanglocale = (e) => {
    //get id of inputfield
    const id = e.target.id; // Get the id of the input field
    const fieldname = e.target.name; // Get the name of the input field
    const value = e.target.value; // Get the value of the input field
    const language = e.target.dataset.lang; // Get the language from the data attribute
    // const { name, value } = e.target;
    const lang = e.target.dataset.lang; // Get the language from the data attribute

    //Check if language exists alreafy

    //   let exists = langlocales[lang]; 

    setLangLocales(prev => ({
      ...prev,
      [lang]: value // Update the locale for the specific language
    }));

  }

  const changeSelectedlangs = (e, language) => {
    const checked = e.target.checked;
    //console.log(checked, 'valuevaluevalue111111')
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
    if (!checked) {
      let newlanglocales = Object.fromEntries(
        Object.entries(langlocales).filter(([key]) => key !== language)
      );
      setLangLocales(newlanglocales)
    }

  }
  const addDefaultLangLocale = (e) => {
    setDefaultLangLocaleMonol(e.target.value);
  }


  const toggleLanguage = (e, language) => changeSelectedlangs(e, language);

  return (
    <div className="settings-page cms-settings">
      <PageTitle icon="settings" title="Settings" />
      <section className="card settings-card">
        <header className="settings-card-head">
          <h3>Content</h3>
          <p>The languages your pages and posts are written in, and who can make an account.</p>
        </header>
        <div className="settings-fields">
          <div className="settings-field">
            <div className="settings-field-label">
              <label htmlFor="cms-multilingual">Multilingual</label>
              <p>Each page can have a version in more than one language.</p>
            </div>
            <div className="settings-field-control">
              <label className="switch">
                <input id="cms-multilingual" type="checkbox" onChange={() => changeMultilingualValue()} checked={multilingualvalue} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="settings-field">
            <div className="settings-field-label">
              <label htmlFor="defaultlanguage">Default language</label>
              <p>The language a page opens in.</p>
            </div>
            <div className="settings-field-control">
              <select id="defaultlanguage" name="defaultlanguage" className="ui-input cms-settings-narrow"
                value={defaultLanguage} onChange={e => setDefaultLanguage(e.target.value)}>
                {languages.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>

          {!multilingualvalue && (
            <div className="settings-field">
              <div className="settings-field-label">
                <label htmlFor="defaultlanglocale">Locale</label>
                <p>The language and region, for example en-GB.</p>
              </div>
              <div className="settings-field-control">
                <input id="defaultlanglocale" type="text" className="ui-input cms-settings-narrow" name="defaultlanglocale"
                  placeholder="en-GB" onChange={(e) => addDefaultLangLocale(e)} value={defaultlanglocalemonol} />
              </div>
            </div>
          )}

          {multilingualvalue && (
            <div className="settings-field">
              <div className="settings-field-label">
                <span>Languages</span>
                <p>The ones pages can be written in.</p>
              </div>
              <div className="settings-field-control">
                <div className="cms-settings-langs">
                  {languages.map((language) => (
                    <label key={language} className="ui-check">
                      <input type="checkbox" checked={selectedLanguages.includes(language)}
                        onChange={(e) => toggleLanguage(e, language)} />
                      {language}
                    </label>
                  ))}
                </div>
                {otherlanguages.length > 0 && (
                  <div className="cms-settings-add">
                    <select id="otherlanguages" name="otherlanguages" className="ui-input cms-settings-narrow" aria-label="Language to add"
                      value={additionalanguagetoadd} onChange={e => setAdditionalLanguageToAdd(e.target.value)}>
                      {otherlanguages.map((language) => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                    <button type="button" className="ui-btn ui-btn-secondary" onClick={() => addAditionallanguage1()}>Add language</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {multilingualvalue && selectedLanguages.length > 0 && (
            <div className="settings-field">
              <div className="settings-field-label">
                <span>Locales</span>
                <p>The language and region for each, for example fr-FR.</p>
              </div>
              <div className="settings-field-control">
                {selectedLanguages.map((language) => (
                  <div key={language} className="cms-settings-locale">
                    <label htmlFor={`locale-${language}`}>{language}</label>
                    <input id={`locale-${language}`} data-lang={language} type="text" name={`locale-${language}`}
                      className="ui-input cms-settings-narrow" value={langlocales[language] || ""}
                      onChange={(e) => addlanglocale(e)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="settings-field">
            <div className="settings-field-label">
              <label htmlFor="cms-registration">Public sign-up</label>
              <p>Anyone can make an account on the site.</p>
            </div>
            <div className="settings-field-control">
              <label className="switch">
                <input id="cms-registration" type="checkbox" onChange={() => setPublicUserRegistration(prevValue => !prevValue)} checked={publicuserregistration} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
        <footer className="settings-card-foot">
          {errorsave && <span className="is-error" role="alert">{errorsave}</span>}
          {saved && <span role="status">Saved</span>}
          <button type="button" className="ui-btn ui-btn-primary" onClick={() => onSave()}>Save changes</button>
        </footer>
      </section>
    </div>
  );
}
