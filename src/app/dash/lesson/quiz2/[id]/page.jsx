'use client';

import { useState, useEffect, useRef } from "react";
import "./quiz2.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getFlashcardsRemaining,
  getFlashcardsKnownWords,
} from "../../flash/[id]/services/fetchwords";
import { dynamichunneds } from '@/utilities/arrayswordshunneds';

import { usePathname } from "next/navigation";
import { get } from "http";
import {
  setCurrentWord,
  setisloading,
  setallknownwordsdata,
  setTotalWordsKnown,
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

  const [wordsleftinstack, setWordsLeftInStack] = useState('');
  const [originalnumberwords, setOriginalNumbetwords] = useState('');
  const [lessoncompletedv, setLessonCompletedv] = useState(false);

  const [wordspickchoose, setWordspickChoose] = useState([])

  const inputRef = useRef(null);
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
        console.log('nonewowrds');
        return;
      } else {
        //randomise order 
        knownwords = knownwords.sort(() => Math.random() - 0.5);
        //alert("2222");
        let knownwordsfiltered = knownwords.filter(word => word.difficulty !== 'Fluent');

        console.log(knownwordsfiltered, "knownwordsfiltered");
        //keep only 3 of total
        //knownwordsfiltered = knownwordsfiltered.slice(0, 3);
        console.log(knownwordsfiltered, "knownwordsfiltered");
        dispatch(setTotalWordsKnown(knownwordsfiltered.length));
        setWordsforquiz1(knownwordsfiltered);
        setCurrentQuiz1Word(knownwordsfiltered[0]);

        dispatch(setCurrentWord(knownwordsfiltered[0]));
        dispatch(setisloading(false));
        dispatch(setallknownwordsdata(knownwordsfiltered));
        setWordsLeftInStack(knownwordsfiltered.length);
        setOriginalNumbetwords(knownwordsfiltered.length);

        let wordstoaddtoarraytochoose;
        //let uniquewordsinArray 
        //first get unique words from knownwordsfiltered array 
        let uniquewords = [...new Set(knownwordsfiltered.map(word => word.Meaning.Meaning))];
        let excludecurrentword = new Set([...uniquewords].filter(word => word !== knownwordsfiltered[0].Meaning.Meaning))
        console.log(excludecurrentword, 'excludecurrentword');
        let randomizedArray = Array.from(excludecurrentword).sort(() => Math.random() - 0.5);
        console.log(randomizedArray, 'randomizedArray');
        let pick3words = randomizedArray.splice(0, 3)
        console.log(pick3words, 'pick3words');
        console.log(currentword, 'currentwordword');
        console.log(knownwordsfiltered[0].word, 'knownword0');
        let finalarraywordschoose = pick3words.push(knownwordsfiltered[0].Meaning.Meaning)
        console.log(pick3words, 'pick3words');
        let randomizeagain = pick3words.sort(() => Math.random() - 0.5);
        setWordspickChoose(randomizeagain);
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
  const [currentindexis, setCurrentIndexis] = useState(0);


  useEffect(() => {
    const index = wordsforquiz1.indexOf(currentquiz1word);
    setCurrentIndexis(index + 1);
  }, [currentquiz1word]);
  const handleNextWord = () => {
    const currentIndex = wordsforquiz1.indexOf(currentquiz1word);
    console.log(currentIndex, "currentIndex");
    console.log(wordsforquiz1.length, "wordsforquiz1.length");
    if (currentIndex === wordsforquiz1.length - 1) {
      // If it's the first word, just proceed to the next one
      setLessonCompletedv(true)
    }
    else if (currentIndex < wordsforquiz1.length - 1) {
      const nextWord = wordsforquiz1[currentIndex + 1];
      setCurrentQuiz1Word(nextWord);
      const updatedWords = wordsforquiz1.filter((word) => word !== currentquiz1word);
      setWordsforquiz1(updatedWords);


      console.log(nextWord, "nextWord");
      dispatch(setCurrentWord(nextWord));
      //hide examples if they are shown
      setShowExamples(false);
      setShowExamplesCount(0);
      setShowCorrect(false);
      setShowWrong(false);
      setRevealAnswerDiv(false);
      setShowExplanation(false);

      let uniquewords = [...new Set(updatedWords.map(word => word.Meaning.Meaning))];
      let excludecurrentword = new Set([...uniquewords].filter(word => word !== nextWord.word))
      console.log(excludecurrentword, 'excludecurrentword');
      let randomizedArray = Array.from(excludecurrentword).sort(() => Math.random() - 0.5);
      console.log(randomizedArray, 'randomizedArray');
      let pick3words = randomizedArray.splice(0, 3)
      console.log(pick3words, 'pick3words');
      console.log(nextWord.word, 'knownword0');
      let finalarraywordschoose = pick3words.push(nextWord.Meaning.Meaning)
      console.log(pick3words, 'pick3words');
      console.log(nextWord, "nextWord");
      let randomizeagain = pick3words.sort(() => Math.random() - 0.5);
      setWordspickChoose(randomizeagain);
      //remove word from setWordsLeftInStack 
      setWordsLeftInStack(prev => prev - 1);
    } else {
      console.log("No more words to show");
    }
    // You can also reset the input field if needed
    setWordInputted("");
    inputRef.current?.focus(); // Refocus the input field
  };

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

  useEffect(() => {
    if (wordsleftinstack === 0) {
      setLessonCompletedv(true)
    }
  }, [wordsleftinstack])


  return (
    <>
      <div className="quiz2pickwordsdiv flex flex-row gap-3">

        {(wordspickchoose && wordspickchoose.length > 0) && (
          wordspickchoose.map((word, index) => (
            <div className="pill-badge" key={index}>
              <span>{word}</span>
            </div>
          ))
        )}


      </div>
      <div className="quiz1-container mt-10">
        {/*  <h1>Quiz 1</h1> */}

        <div className="showwordtotranslate">
          {(!lessoncompletedv && currentquiz1word) && (
            <>

              <p className="text-center">Match the word from the list</p>
              <p>{wordsleftinstack} / {originalnumberwords}</p>
              <div className="maxdiv pt-10 pb-10 text-center">
                <span className="quiz1wordtotranslate">{currentquiz1word.word}</span>
                {/*   <p>{currentquiz1word.Meaning.Explanation}</p> */}
                {/*  <span className="quiz1wordtotranslate">{currentquiz1word.word}</span> */}
                {/*   <p className="pl-5">({wordtype?.toLowerCase()})</p> */}
              </div>
            </>


          )}
          {(lessoncompletedv) && (
            <div className="lessoncompleteddiv text-center">
              <h2>Lesson Completed!</h2>
              <p className="underline cursor-pointer" onClick={() => takelessonagain()}>Take again!</p>
              <p className="underline cursor-pointer" >or Do the Next Quiz!</p>
            </div>
          )}
        </div>

        {(!lessoncompletedv && currentquiz1word) && (
          <>

            {/*     <div className="quiz1hints">
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
            </div>
                )}
        </div >
            <div className="showexpl">
                {showExplanation && (
                    <div className="explanationdiv">
                        <p>{currentquiz1word.Meaning?.Explanation || "No explanation available"}</p>
                    </div>
                )}
            </div>
            </div > */
            }
            <div className="quiz1nextworddiv">
            </div>
          </>
        )}
      </div >


    </>
  )
}

{/*  */ }