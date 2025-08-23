'use client';

import { useState, useEffect } from "react";
import "./quiz1.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getFlashcardsRemaining,
  getFlashcardsKnownWords,
} from "../../flash/[id]/services/fetchwords";
import { dynamichunneds } from '@/utilities/arrayswordshunneds';

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
  const [revealanswerdiv, setRevealAnswerDiv] = useState(false);
  const [currentwordnumberofexamples, setCurrentWordNumberOfExamples] = useState(0);
  const [wordtype, setWordType] = useState("");
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
        //randomise order 
        knownwords = knownwords.sort(() => Math.random() - 0.5);
        //alert("2222");
        let knownwordsfiltered = knownwords.filter(word => word.difficulty !== 'Fluent');

        console.log(knownwordsfiltered, "knownwordsfiltered");
        dispatch(setTotalWordsKnown(knownwordsfiltered.length));
        setWordsforquiz1(knownwordsfiltered);
        setCurrentQuiz1Word(knownwordsfiltered[0]);

        dispatch(setCurrentWord(knownwordsfiltered[0]));
        dispatch(setisloading(false));
        dispatch(setallknownwordsdata(knownwordsfiltered));

      }
    }

    getknownwordsfromapi()
  }, []);

  useEffect(() => {
    setWordType(currentquiz1word?.Meaning.WordType);
    setCurrentQuizWordGerman(currentquiz1word?.word);
    setCurrentQuizWordEnglish(currentquiz1word?.Meaning?.Meaning);
    console.log(currentquiz1word, "currentquiz1word");
    setCurrentWordNumberOfExamples(currentquiz1word?.Meaning?.CommonFields?.Examples?.length || 0);

  }, [currentquiz1word]);

  const compareWords = (word1, word2) => {
    console.log(word1, "word1");
    console.log(word2, "word2");
    //trim word 2
    word2 = word2.trim();

    //if word1 includes a /, then either of the words before or after the / can be correct
    if (word1.includes("/")) {
      let word1options = word1.split("/").map(option => option.trim());
      if (word1options.includes(word2)) {
        console.log("Words match!");
        setShowCorrect(true);
        setShowWrong(false);

        //switch to
        setTimeout(() => {
          handleNextWord();
        }, 1000);

        return; // Exit the function early since we found a match
      } else {
        console.log("Words do not match.");
        setShowWrong(true);
        setShowCorrect(false);
        return; // Exit the function early since we did not find a match
      }
    }

    if (word1 === word2) {
      console.log("Words match!");
      setShowCorrect(true);
      setShowWrong(false);

      //switch to
      setTimeout(() => {
        handleNextWord();
      }, 1000);

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
      dispatch(setCurrentWord(nextWord));
      //hide examples if they are shown
      setShowExamples(false);
      setShowExamplesCount(0);
      setShowCorrect(false);
      setShowWrong(false);
      setRevealAnswerDiv(false);
      console.log(nextWord, "nextWord");
    } else {
      console.log("No more words to show");
    }
    // You can also reset the input field if needed
    setWordInputted("");
  };



  return (
    <>
      <div className="quiz1-container mt-10">
        {/*  <h1>Quiz 1</h1> */}

        <div className="showwordtotranslate">
          {currentquiz1word ? (
            <>
              <p className="text-center">Type the word in English</p>
              <div className="maxdiv pt-10 pb-10 text-center">
                <span className="quiz1wordtotranslate">{currentquiz1word.word}</span>
                {/*   <p className="pl-5">({wordtype?.toLowerCase()})</p> */}
              </div>
            </>


          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="quiz1inputarea">
          <input
            type="text"
            className="quiz1input"
            value={wordinputted}
            placeholder="Type your answer here"
            autoFocus
            onChange={(e) => {
              setWordInputted(e.target.value);
              console.log(e.target.value, "input value");
            }}
            onBlur={(e) => {
              setWordInputted(e.target.value);
              console.log(e.target.value, "input value");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                compareWords(currentquiz1word.Meaning?.Meaning, wordinputted);
              }
            }}
          />
          <button
            className="button button-primary"
            onClick={(e) => {
              // Handle submit action
              console.log("Submit button clicked");
              compareWords(currentquiz1word.Meaning?.Meaning, wordinputted);
            }}
          >
            Submit
          </button>
        </div>
        <div className="showcorrectwrongdiv">
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
        <div className="quiz1hints">
          <div className="quiz1hintbuttons flex">
            <div className="showexamplesdiv">
              {currentwordnumberofexamples > 0 && (
                <button
                  className="button button-primary button-outline button-narrow "
                  onClick={() => {
                    setShowExamples(!showexamples)
                    if (!showexamples) {
                      if (showexamplescount === 0) {
                        setShowExamplesCount(showexamplescount + 1);
                      }
                    }
                  }
                  }>{showexamples ? "Hide Examples" : "Show Examples"}
                </button>
              )}

            </div>
            <div className="revealanswerdiv">
              <button
                className="button button-primary button-outline button-narrow"
                onClick={() => {
                  setRevealAnswerDiv(prevValue => {
                    setRevealAnswerDiv(!prevValue);
                  });
                }}>Show Answer
              </button>
            </div>
          </div>
          <div className="showanswerdiv">
            {showexamples && (
              <>
                <ul>
                  {currentquiz1word.Meaning?.CommonFields?.Examples?.length > 0 ? (
                    currentquiz1word.Meaning.CommonFields.Examples.slice(0, showexamplescount).map((example, index) => (

                      <li key={index}>{example.ExampleSentenceDE}</li>
                    ))
                  ) : (
                    <li>No examples available</li>
                  )}
                </ul>
                {showexamples && (
                  (showexamplescount < currentwordnumberofexamples) &&
                  <button
                    className="mt-5 underline"
                    onClick={() => {
                      setShowExamplesCount(showexamplescount + 1);
                    }}>Show more</button>
                )}
              </>
            )}
            {revealanswerdiv && (
              <div className="revealanswer">
                <p className="text-center quiz1wordtotranslate pt-10 pb-10">{currentquiz1word.meaningEn}
                  {currentquiz1word.Meaning?.CommonFields?.TranslationDE}</p>
              </div>
            )}
          </div>
        </div>
        <div className="quiz1nextworddiv">
          {/*  <button
            className="mt-10 button button-primary button-outline button-narrow"
            onClick={() => {
              // Handle next wo rd action
              handleNextWord();
            }}>
            Next Word
          </button> */}
        </div>
      </div >
    </>
  )
}

{/*  <button onClick={() => setShowExplanation(!showExplanation)}>
            {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </button>
          {showExplanation && (
            <p>{currentquiz1word.explanation || "No explanation available"}</p>
          )} */}