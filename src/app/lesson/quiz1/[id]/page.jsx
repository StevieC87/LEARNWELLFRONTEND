'use client';

import { useState, useEffect } from "react";
import "./quiz1.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getFlashcardsRemaining,
  getFlashcardsKnownWords,
} from "../../flash/[id]/services/fetchwords";
import { dynamichunneds } from '../../../../utilities/arrayswordshunneds';

import { usePathname } from "next/navigation";
import { get } from "http";
import {
  setAllWords2,
  setCurrentWord,
  setShowAllWords,
  setdifficultylevels,
  seterrorNoWords,
  setisloading,
  setallremainingwordsdata,
  setallknownwordsdata,
  setnumberoffluentwords,
  setnumberoffamiliarwords,
  setnumberofuncertainwords,
  setnumberofnewwords,
  setfluentWORDSArray,
  setfamiliarWORDSArray,
  setuncertainWORDSArray,
  setnewwordsArray,
  setTotalWordsKnown,
  setTotalWordsRemaining,
  setdisablediffbuttons,
  // setoriginalarrayorder,
} from "@/redux/slices/flashcardSlice";

export default function Quiz1() {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const [wordsforquiz1, setWordsforquiz1] = useState([]);
  const [currentquiz1word, setCurrentQuiz1Word] = useState(null);
  const [currentquizwordGerman, setCurrentQuizWordGerman] = useState(null);
  const [currentquizwordEnglish, setCurrentQuizWordEnglish] = useState(null);
  const currentword = useSelector((state) => state.flashcardSlice.currentWord);
  const isLoading = useSelector((state) => state.flashcardSlice.isLoading);
  const allknownwordsdata = useSelector((state) => state.flashcardSlice.totalWordsKnown);
  const totalwordsknown = useSelector((state) => state.flashcardSlice.totalwordsknown);

  const [showexamples, setShowExamples] = useState(false);
  const [showexamplescount, setShowExamplesCount] = useState(0);
  const [wordinputted, setWordInputted] = useState("");

  const [showcorrect, setShowCorrect] = useState(false);
  const [showwrong, setShowWrong] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const slug = pathname.split("/").pop();
  //console.log(slug, "slugsss");
  if (isNaN(slug)) {
    return <div>error</div>;
  }
  let wordstartwordendarray = dynamichunneds(20);

  let wordstart1 = wordstartwordendarray.find((item) => item.id === parseInt(slug));
  // console.log(wordstart1, "wordstart1");
  let wordstart = wordstart1.wordstart;
  // console.log(wordstart, "wordstart");
  let wordend = wordstart1.wordend;
  // console.log(wordend, "wordend");


  useEffect(() => {

    const getknownwordsfromapi = async () => {
      let knownwords = await getFlashcardsKnownWords(wordstart, wordend);
      // console.log(knownwords, "knownwords");
      if (!knownwords || knownwords.length === 0) {
        //alert("111");
        return;
      } else {
        //alert("2222");
        dispatch(setTotalWordsKnown(knownwords.length));
        setWordsforquiz1(knownwords);
        setCurrentQuiz1Word(knownwords[0]);
        setCurrentQuizWordGerman(knownwords[0].word);
        setCurrentQuizWordEnglish(knownwords[0].Meaning);
        console.log(knownwords[0], "currentquiz1word");
        dispatch(setCurrentWord(knownwords[0]));
        dispatch(setisloading(false));

        //WE PUT ALL KNOWS WORDS IN ARRAY REDUX
        //dispatch(setAllWords2(getknownwordsf));
        dispatch(setallknownwordsdata(knownwords));
        // return knownwords;
        //CREATE ARRAY OF WORDS FOR EACH DIFFICULTY LEVEL
        let fluentWORDS1 = knownwords.filter(
          (word) => word.difficulty === "Fluent"
        );
        let familiarWORDS = knownwords.filter(
          (word) => word.difficulty === "Familiar"
        );
        let uncertainWORDS = knownwords.filter(
          (word) => word.difficulty === "Uncertain"
        );
        let newwords = knownwords.filter(
          (word) => word.difficulty === "New"
        );

        dispatch(setfluentWORDSArray(fluentWORDS1));
        dispatch(setfamiliarWORDSArray(familiarWORDS));
        dispatch(setuncertainWORDSArray(uncertainWORDS));
        dispatch(setnewwordsArray(newwords));
      }
    }

    getknownwordsfromapi()
  }, []);

  const compareWords = (word1, word2) => {
    //lowercase both words for case-insensitive comparison
    //    const lowerWord1 = word1.toLowerCase();
    //   const lowerWord2 = word2.toLowerCase();
    console.log(word1, "word1");
    console.log(word2, "word2");
    //trim word 2
    word2 = word2.trim();
    if (word1 === word2) {
      console.log("Words match!");
      setShowCorrect(true);
      setShowWrong(false);

      //switch to

      // You can add more logic here, like updating the state or showing a message
    } else {
      console.log("Words do not match.");
      setShowWrong(true);
      setShowCorrect(false);
      // Handle the case where words do not match
    }

  }

  const handleNextWord = () => {
    const currentIndex = wordsforquiz1.indexOf(currentquiz1word);
    console.log(currentIndex, "currentIndex");
    if (currentIndex < wordsforquiz1.length - 1) {
      const nextWord = wordsforquiz1[currentIndex + 1];
      setCurrentQuiz1Word(nextWord);
      console.log(nextWord, "nextWord");
      setCurrentQuizWordGerman(nextWord.word);
      setCurrentQuizWordEnglish(nextWord.Meaning);
      dispatch(setCurrentWord(nextWord));
      //hide examples if they are shown
      setShowExamples(false);
      setShowExamplesCount(0);
      setShowCorrect(false);
      setShowWrong(false);
      console.log(nextWord, "nextWord");
    } else {
      console.log("No more words to show");
    }
    // You can also reset the input field if needed
    setWordInputted("");
  };

  return (
    <>
      <div className="quiz1-container">
        <h1>Quiz 1</h1>
        <p>This is a placeholder for Quiz 1 content.</p>
        {/* Add your quiz content here */}

        <div className="showwordtotranslate">
          {currentquiz1word ? (
            <div>
              <h2>Current Word</h2>
              <p>{currentquiz1word.word}</p>
              <button onClick={() => setShowExplanation(!showExplanation)}>
                {showExplanation ? "Hide Explanation" : "Show Explanation"}
              </button>
              {showExplanation && (
                <p>{currentquiz1word.explanation || "No explanation available"}</p>
              )}
              {showexamples && (
                <button onClick={() => {
                  setShowExamplesCount(showexamplescount + 1);
                }}>Show more</button>
              )}
              <button onClick={() => {
                setShowExamples(!showexamples)
                if (!showexamples) {
                  setShowExamplesCount(showexamplescount + 1);
                }
              }
              }>

                {showexamples ? "Hide Examples" : "Show Examples"}
              </button>
              {showexamples && (
                <>
                  <p>Examples</p>
                  <ul>
                    {currentquiz1word.Meaning?.CommonFields?.Examples?.length > 0 ? (
                      currentquiz1word.Meaning.CommonFields.Examples.slice(0, showexamplescount).map((example, index) => (

                        <li key={index}>{example.ExampleSentenceDE}</li>
                      ))
                    ) : (
                      <li>No examples available</li>
                    )}
                  </ul>

                </>
              )}

            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="inputarea">
          <input
            type="text"
            value={wordinputted}
            placeholder="Type your answer here"
            onChange={(e) => {
              setWordInputted(e.target.value);
              console.log(e.target.value, "input value");
            }}
            onBlur={(e) => {
              // Handle input change
              setWordInputted(e.target.value);
              console.log(e.target.value, "input value");
            }}
          />
          <button
            onClick={(e) => {
              // Handle submit action
              console.log("Submit button clicked");
              compareWords(currentquiz1word.meaningEn, wordinputted);
            }}
          >
            Submit
          </button>
        </div>
        <button onClick={() => {
          // Handle next wo rd action
          handleNextWord();
        }}>
          Next Word
        </button>
        {showcorrect && (
          <div className="correct-message">
            <p>Correct!</p>
          </div>
        )}
        {showwrong && (
          <div className="wrong-message">
            <p>Wrong! Try again.</p>
          </div>
        )
        }

      </div>
    </>
  )
}