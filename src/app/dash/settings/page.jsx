'use client';

import { useState, useEffect } from 'react';
import './settings.css'
//redirect refrech roter
import { useRouter } from 'next/navigation';
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
      if (data.languages && Array.isArray(data.languages)) {
        console.log("languages from db", data.languages);
        setLanguages(data.languages);
        setLanguageSelectionFromDb(true);
        setSelectedLanguages(data.languages); // or data.selectedLanguages if 

      }
      // setMultilingualValue(data.multilingual);
      //  setLanguages(data.languages);
    };
    fetchSettings();


  }, [addedlanguage]);

  const onSave = async () => {
    console.log(selectedLanguages, "selectedLanguages");
    console.log("defaultLanguage", defaultLanguage);
    console.log("multilingualvalue", multilingualvalue);


    const response = await fetch('http://localhost:3000/savesettings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        multilingual: multilingualvalue,
        defaultlanguage: defaultLanguage,
        languages: selectedLanguages, // Use selectedLanguages instead of languages

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

  useEffect(() => {
    //alert(`You are adding the language: ${additionalanguagetoadd}`);
  }, [additionalanguagetoadd]);

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
          </div>

          {multilingualvalue && (
            <div className="languagesselect">
              <span className="poppinsSemiBold">Selected Languages:</span>
              <div className="langchoosediv">
                {languages.length > 0 && languages.map((language, index) => (
                  console.log(language, "language44444444"),
                  <div key={index} className="languageoption">
                    <label htmlFor={language} className="chooselanglang">{language}</label>
                    <input type="checkbox" id={language} name='languagecheckbox'
                      checked={selectedLanguages.includes(language)}
                      onChange={() => {
                        setSelectedLanguages(prev =>
                          prev.includes(language)
                            ? prev.filter(l => l !== language)
                            : [...prev, language]
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}


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
      </div>


    </>



  );

}