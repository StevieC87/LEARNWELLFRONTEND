'use client';
import { useState, useEffect } from "react";
import './appsettings.css';

export default function AppSettingsPage() {
  const [wordsPerLesson, setWordsPerLesson] = useState();
  const [saved, setSaved] = useState(false);
  const [errorsave, setErrorSave] = useState("");
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getuserappsettings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include credentials for session management
        });

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        console.log(data, "Fetched settings successfully");
        if (data && data.wordsperlesson) {
          setWordsPerLesson(data.wordsperlesson);
          setIsLoading(false);
        }
        else if (!data || !data.wordsperlesson) {
          console.error("No settings found, using default values");
          setWordsPerLesson(15); // Default value if no settings found
          setIsLoading(false);
        }
      }
      catch (error) {
        console.error("Error fetching settings:", error);
      }
    }
    fetchSettings();
  }, []);


  const handleChange = (e) => {
    setWordsPerLesson(parseInt(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(wordsPerLesson, "words per lesson");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saveuserappsettings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ wordsPerLesson }),
        credentials: 'include', // Include credentials for session 
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      const data = await response.json();
      console.log(data, "Settings saved successfully");
    }
    catch (error) {
      console.error("Error saving settings:", error);
    }
  }
  // Save the setting or perform any action here


  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row justify-between items-center align-center">
        <h1 className="pb-10">App Settings</h1>
        <button className="button button-primary" type="submit" onClick={(e) => handleSubmit(e)}>Save
          {/*  {saved ? 'Saved!' : 'Save'}
          {errorsave && <span className="text-red-500">{errorsave}</span>} */}
        </button>
      </div>
      {!isloading && (
        <div className="flex flex-col">
          <label htmlFor="words-range">Words per Lesson: {wordsPerLesson}</label>
          <div className="rangedivinput">
            <input
              className="rangelessons"
              type="range"
              id="words-range"
              min="5"
              max="20"
              step="5"
              value={wordsPerLesson}
              onChange={(e) => setWordsPerLesson(parseInt(e.target.value))}
            />
          </div>

        </div>
      )}
    </form>
  );
}