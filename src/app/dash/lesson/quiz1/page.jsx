'use client';

import { useState, useEffect, useRef } from "react";
import "./quiz1.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getFlashcardsRemaining,
  getFlashcardsKnownWords,
} from "../flash/services/fetchwords";
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
import Link from 'next/link';
import customSessionStorage from "@/utilities/customSessionStorage";

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

  const [wordswithmistaketosaveforreview, setWordsWithMistakeToSaveForReview] = useState([]);

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

  const [wordsleftinstack, setWordsLeftInStack] = useState('');
  const [originalnumberwords, setOriginalNumbetwords] = useState('');
  const [lessoncompletedv, setLessonCompletedv] = useState(false);

  const userwordsperlesson = useSelector((state) => state.flashcardSlice.userwordsperlesson);
  const inputRef = useRef(null);
  //console.log(slug, "slugsss");
  if (isNaN(slug)) {
    return <div>error</div>;
  }
  let wordstartwordendarray = dynamichunneds(userwordsperlesson || 15);
  // console.log(wordstartwordendarray, "wordstartwordendarray");
  let wordstart1 = wordstartwordendarray.find((item) => item.id === parseInt(slug));
  let wordstart = wordstart1.wordstart;
  let wordend = wordstart1.wordend;

  //. =====================================X
  useEffect(() => {
    const getknownwordsfromapi = async () => {
      let knownwords = await getFlashcardsKnownWords(slug);
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
        //keep only 3 of total
        //   knownwordsfiltered = knownwordsfiltered.slice(0, 3);
        console.log(knownwordsfiltered, "knownwordsfiltered");
        dispatch(setTotalWordsKnown(knownwordsfiltered.length));
        setWordsforquiz1(knownwordsfiltered);
        setCurrentQuiz1Word(knownwordsfiltered[0]);

        dispatch(setCurrentWord(knownwordsfiltered[0]));
        dispatch(setisloading(false));
        dispatch(setallknownwordsdata(knownwordsfiltered));
        setWordsLeftInStack(knownwordsfiltered.length);
        setOriginalNumbetwords(knownwordsfiltered.length);

      }
    }
    getknownwordsfromapi()
  }, []);

  //. =====================================
  useEffect(() => {
    setWordType(currentquiz1word?.Meaning.WordType);
    setCurrentQuizWordGerman(currentquiz1word?.word);
    setCurrentQuizWordEnglish(currentquiz1word?.Meaning?.Meaning);
    console.log(currentquiz1word, "currentquiz1word");
    setCurrentWordNumberOfExamples(currentquiz1word?.Meaning?.CommonFields?.Examples?.length || 0);

  }, [currentquiz1word]);

  //. =====================================
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
        setWordsWithMistakeToSaveForReview(prev => [...prev, currentquiz1word]);
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
      setShowWrong(true);
      setWordsWithMistakeToSaveForReview(prev => [...prev, currentquiz1word]);
      console.log(wordswithmistaketosaveforreview, 'wordswithmistaketosaveforreviewQUIZ1');
      // Handle the case where words do not match
    }

  }

  //. =====================================
  const [currentindexis, setCurrentIndexis] = useState(0);
  useEffect(() => {
    const index = wordsforquiz1.indexOf(currentquiz1word);
    setCurrentIndexis(index + 1);
  }, [currentquiz1word]);

  //. =====================================
  const handleNextWord = () => {
    const currentIndex = wordsforquiz1.indexOf(currentquiz1word);
    console.log(currentIndex, "currentIndex");
    console.log(wordsforquiz1.length, "wordsforquiz1.length");
    if (currentIndex === wordsforquiz1.length - 1) {
      // If it's the first word, just proceed to the next one.
      customSessionStorage.setItem('wordswithmistaketosaveforreviewQUIZ1', JSON.stringify(wordswithmistaketosaveforreview));
      console.log(wordswithmistaketosaveforreview, 'wordswithmistaketosaveforreviewQUIZ1');
      setLessonCompletedv(true)
    }
    else if (currentIndex < wordsforquiz1.length - 1) {
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
      setShowExplanation(false);
      console.log(nextWord, "nextWord");

      //remove word from setWordsLeftInStack 
      setWordsLeftInStack(prev => prev - 1);
    } else {
      console.log("No more words to show");
    }
    // You can also reset the input field if needed
    setWordInputted("");
    inputRef.current?.focus(); // Refocus the input field
  };
  //. =====================================
  const takelessonagain = () => {
    setLessonCompletedv(false);
    setWordsLeftInStack(originalnumberwords);
    setCurrentQuiz1Word(wordsforquiz1[0]);
    setShowExamples(false);
    setShowExamplesCount(0);
    setShowCorrect(false);
    setShowWrong(false);
    setRevealAnswerDiv(false);
    setWordInputted("");
    setShowExplanation(false);
    inputRef.current?.focus(); // Refocus the input field
  }
  //. =====================================
  useEffect(() => {
    if (wordsleftinstack === 0) {
      setLessonCompletedv(true)
    }
  }, [wordsleftinstack])

  const germanSpecialCharacters = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

  return (
    <>
      <div className="quiz1-container mt-10">
        <div className="showwordtotranslate">
          {(!lessoncompletedv && currentquiz1word) && (
            <>
              <span>currentindex {currentindexis}</span>
              <p className="text-center">Type the word in German</p>
              <p>{wordsleftinstack} / {originalnumberwords}</p>
              <div className="maxdiv pt-10 pb-10 text-center">
                <span className="quiz1wordtotranslate">{currentquiz1word.Meaning.Meaning}</span>

              </div>
            </>


          )}
          {(lessoncompletedv) && (
            <div className="lessoncompleteddiv text-center">
              <h2>Lesson Completed!</h2>
              <p className="underline cursor-pointer" onClick={() => takelessonagain()}>Take again!</p>
              <Link href={`../quiz2/${slug}`}><p className="underline cursor-pointer" >or Do the Next Quiz!</p></Link>
            </div>
          )}
        </div>
        {(!lessoncompletedv && currentquiz1word) && (
          <>
            <div className="quiz1inputarea">
              <input
                ref={inputRef}
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
                    setWordInputted(e.target.value);
                    compareWords(currentquiz1word.word, wordinputted);
                  }
                }}
              />
              <button
                className="button button-primary"
                onClick={(e) => {
                  // Handle submit action
                  console.log("Submit button clicked");
                  compareWords(currentquiz1word.word, wordinputted);
                }}
              >
                Submit
              </button>
            </div>
            <div className="special-characters">
              <p>Add Special Characters:</p>
              <div className="special-characters-buttons">
                {germanSpecialCharacters.map((char, index) => (
                  <button
                    key={index}
                    className="button button-secondary"
                    onClick={() => {
                      setWordInputted((prev) => prev + char);
                      inputRef.current?.focus(); // Refocus the input field
                    }}
                  >
                    {char}
                  </button>
                ))}
              </div>
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
              <div className="quiz1hintbuttons flex flex-row gap-5 pb-5">
                <div className="showexplanationbutton">
                  <button className="button button-primary button-outline button-narrow" onClick={() => setShowExplanation(!showExplanation)}>
                    {showExplanation ? "Hide Explanation" : "Show Explanation"}
                  </button>
                </div>
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
                    }}> {revealanswerdiv ? "Hide Answer" : "Show Answer"}
                  </button>
                </div>
              </div>
              <div className="showanswerdiv">
                {showexamples && (
                  <>
                    <ul>
                      {currentquiz1word.Meaning?.CommonFields?.Examples?.length > 0 ? (
                        currentquiz1word.Meaning.CommonFields.Examples.slice(0, showexamplescount).map((example, index) => (

                          <li key={index}>{example.ExampleSentenceEN}</li>
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
                    <p className="text-center quiz1wordtotranslate pt-10 pb-10">{currentquiz1word.word}
                      {/* {currentquiz1word.Meaning?.CommonFields?.TranslationDE} */}</p>
                  </div>
                )}
              </div>
              <div className="showexpl">
                {showExplanation && (
                  <div className="explanationdiv">
                    <p>{currentquiz1word.Meaning?.Explanation || "No explanation available"}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="quiz1nextworddiv">
            </div>
          </>
        )}
      </div >


    </>
  )
}

{/*  */ }