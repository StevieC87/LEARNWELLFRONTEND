'use client';

import { useState, useEffect } from 'react';
import './settings.css'
//redirect refrech roter
import { useRouter } from 'next/navigation';
import { set } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  setEnableUserRegistration, setSelectedLanguage,
  setMultilingualSharedId,
  setPageExistsThisLanguage
} from '@/redux/slices/DashSlice'; // Import the action to set settings
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
        console.log("Failed to fetch settings");
        const data = await response.json();
        //console.error(data);
        return;
      }
      const data = await response.json();
      console.log("Fetched settings successfully:", data);
      //IF THEY ARE NOT EMPTY - THEN WE REPLACE 
      if (data.multilingual !== undefined) {
        setMultilingualValue(data.multilingual);
      }
      if (data.defaultlanguage !== '') {
        console.log('default lang db', data.defaultlanguage);
        setDefaultLanguage(data.defaultlanguage);
      }
      let object11 = {};
      if (data.languages && Array.isArray(data.languages)) {
        console.log("languages from db", data.languages);
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
    console.log(selectedLanguages, "selectedLanguages");
    console.log("defaultLanguage", defaultLanguage);
    console.log("multilingualvalue", multilingualvalue);


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
      console.log("Failed to save settings");
      const data = await response.json();
      console.log(data);
      setErrorSave('Failed to save settings. Please try again.'); // Set the error save state
      setSaved(false); // Set the saved state to false
      setTimeout(() => {
        setErrorSave(''); // Reset error save state after 3 seconds
      }, 3000);
      return;
    }
    const data = await response.json();
    console.log("Settings saved successfully:", data);
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
    console.log("filterothers", filterothers);
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
      console.log("Failed to add language");
      const data = await response.json();
      console.log(data);
      return;
    }
    const data = await response.json();
    console.log("Language added successfully:", data);
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
      console.log(newlanglocales, 'newlanglocalesnewlanglocalesnewlanglocales')
      setLangLocales(newlanglocales)
    }

  }
  const addDefaultLangLocale = (e) => {
    setDefaultLangLocaleMonol(e.target.value);
  }


  return (
    <>
      <div className="titlebuttons">
        <h1 className="">Settings</h1>
        <button type="button" className="button button-primary" onClick={() => onSave()}>
          {saved ? 'Saved!' : 'Save Settings'}
          {errorsave && <span className="text-red-500">{errorsave}</span>}
        </button>
      </div>
      <div className="card mt-10">
        <form >
          <div className="switchbuttonmulti flex flex-row items-center">
            <label htmlFor="">Multilingual: </label>
            <label className="switch  ml-5">
              <input type="checkbox" onChange={() => changeMultilingualValue()} checked={multilingualvalue} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="defautlang pt-5">
            <label htmlFor="defaultlanguage">Default Language:</label>
            <select id="defaultlanguage" name="defaultlanguage"
              value={defaultLanguage}
              onChange={e => setDefaultLanguage(e.target.value)}
              className="ml-5"

            >
              {languages.map((language, index) => (
                <option key={index} value={language}>{language}</option>
              ))}
            </select>

            {!multilingualvalue && (
              <div>
                <label htmlFor="defaultlanglocale">Defaul language locale</label>
                <input type="text" className="defaultlanglocalesettings" name="defaultlanglocale" onChange={(e) => addDefaultLangLocale(e)} value={defaultlanglocalemonol} />

              </div>
            )}

            {multilingualvalue && (
              <>
                <div className="languagesselect">
                  <span className="poppinsSemiBold">Selected Languages:</span>
                  <div className="langchoosediv">
                    {languages.length > 0 && languages.map((language, index) => (
                      console.log(language, "language44444444"),
                      <div key={index} className="languageoption">
                        <label htmlFor={language} className="chooselanglang">{language}</label>
                        <input type="checkbox" id={language} name='languagecheckbox'
                          checked={selectedLanguages.includes(language)}
                          onChange={(e) => changeSelectedlangs(e, language)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col mwidth400" >
                  {selectedLanguages.length > 0 && (
                    < span > Preferred Locale e.g. fr-FR</span>
                  )}

                  {selectedLanguages.map((language, index) => (
                    <div key={language}>
                      <label htmlFor=""
                        className="selectedlanglabelsettings"

                      >Preferred Locale for {language}   </label>
                      <input data-lang={language} type="text" name={`locale-${language}`}
                        value={langlocales[language] || ""}

                        onChange={(e) => addlanglocale(e)}
                        className="mwidth100"
                      />
                    </div>
                  ))}
                </div>
              </>

            )}
          </div>

        </form>

        {multilingualvalue && (
          <div className="otherlanguages">

            <p className="poppinsSemiBold pt-5 pb-5">Add more languages:</p>
            <select
              id="otherlanguages"
              name="otherlanguages"
              value={additionalanguagetoadd}
              onChange={e => setAdditionalLanguageToAdd(e.target.value)}
            >
              {otherlanguages.map((language, index) => (
                <option key={index} value={language}>
                  {language}
                </option>
              ))}
            </select>
            <button className="button ml-4" onClick={() => addAditionallanguage1()}>Add it</button>

          </div>
        )}

        <div className="switchbuttonmulti flex flex-row items-center">
          <label htmlFor="">Enable Public User Registration: </label>
          <label className="switch  ml-5">
            <input type="checkbox" onChange={() => setPublicUserRegistration(prevValue => !prevValue)} checked={publicuserregistration} />
            <span className="slider round"></span>
          </label>
        </div>
      </div >

    </>



  );

}