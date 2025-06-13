'use client';

import { useState, useEffect } from 'react';
import './settings.css'
//redirect refrech roter
import { useRouter } from 'next/navigation';
import { set } from 'react-hook-form';
//! KEEP IT SIMPLE, IM STARTING WITHA NEW BOLERPLATE EVERYT IME, 
//!I CAN ADAPT THE CODE EASILY TO ADD NEW LANGUAGES 
//! WE NEED THIS FOR: IN ORDER TO SET LANGUAGES PROBABLY IN THE BEGINNING, DECIDE IF MULTILINGAUL OR NOT, AND SET LANGUAGES FOR LATER 

//DEFAULT LANGUAGE 
export default function Settings() {
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

    //setMultilingualValue(e.target.checked);
    // console.log("Multilingual value changed to:", e.target.checked);
  };
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [additionalanguagetoadd, setAdditionalLanguageToAdd] = useState('');
  const [addedlanguage, setAddedLanguage] = useState(0); // This will hold the language to be added

  const [langlocales, setLangLocales] = useState({}); // This will hold the locales for each language
  //example: { 
  // en: 'en-US',
  //  fr: 'fr-FR', 
  // e: 'de-DE' 


  //first I NEED TO POPULATE THE VALUES FROM THE DATABASE 
  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch('http://localhost:3000/settings/getsettings', {
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

  useEffect(() => {
    console.log(langlocales, 'langlocaleslanglocaleslanglocales');
  }, [langlocales])

  const onSave = async () => {
    console.log(selectedLanguages, "selectedLanguages");
    console.log("defaultLanguage", defaultLanguage);
    console.log("multilingualvalue", multilingualvalue);


    const response = await fetch('http://localhost:3000/settings/savesettings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        multilingual: multilingualvalue,
        defaultlanguage: defaultLanguage,
        languages: selectedLanguages,
        langlocales: langlocales, // Send the locales for each language

      }),
      credentials: 'include', // this is what sends/receives cookie
    });
    if (!response.ok) {
      console.error("Failed to save settings");
      const data = await response.json();
      console.error(data);
      return;
    }
    const data = await response.json();
    console.log("Settings saved successfully:", data);


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
    const response = await fetch('http://localhost:3000/settings/addlanguage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: additionalanguagetoadd, // Use the selected language to add
      }),
      credentials: 'include', // this is what sends/receives cookie
    });
    if (!response.ok) {
      console.error("Failed to add language");
      const data = await response.json();
      console.error(data);
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

  return (
    <>
      <div className="titlebuttons">
        <h1 className="">Settings</h1>
        <button type="button" className="button button-primary" onClick={() => onSave()}>Save Settings</button>
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
                <div className="flex flex-col" style={{ maxWidth: '400px' }}>
                  {selectedLanguages.length > 0 && (
                    < span > Preferred Locale e.g. fr-FR</span>
                  )}

                  {selectedLanguages.map((language, index) => (
                    <div key={language}>
                      <label htmlFor=""
                        style={{ width: '185px', display: 'inline-block' }}
                      >Preferred Locale for {language}   </label>
                      <input data-lang={language} type="text" name={`locale-${language}`}
                        value={langlocales[language] || ""}
                        style={{ maxWidth: '100px' }}
                        onChange={(e) => addlanglocale(e)}
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
      </div >


    </>



  );

}