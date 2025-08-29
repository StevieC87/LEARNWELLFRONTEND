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
import customSessionStorage from "@/utilities/customSessionStorage";
export default function Quiz5() {
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


  const [wordswithmistaketosaveforreview, setWordsWithMistakesToSaveForReview] = useState([]);

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

  const [currentexample, setCurrentExample] = useState(null);
  const [currentexamplewithoutword, setCurrentExampleWithoutWord] = useState(null);
  const [currentexampleEnglish, setCurrentExampleEnglish] = useState(null);
  const [currentexamplescrambledreordered, setCurrentExampleScrambledreordered] = useState([])

  const [originalquizwords, setOriginalQuizwords] = useState([])


  const [wordspickchoose, setWordspickChoose] = useState([])
  const [currentexampleorderedwords, setCurrentExampleOrderedWords] = useState([])

  let [originalsentencewordsarraylength, setOriginalSentenceWordArrayLength] = useState([])


  const userwordsperlesson = useSelector((state) => state.flashcardSlice.userwordsperlesson);
  const inputRef = useRef(null);
  //console.log(slug, "slugsss");
  /*  if (isNaN(slug)) {
     return <div>error</div>;
   : null
   } */
  let wordstartwordendarray = dynamichunneds(userwordsperlesson || 15);
  // console.log(wordstartwordendarray, "wordstartwordendarray");

  let wordstart1 = wordstartwordendarray.find((item) => item.id === parseInt(slug));
  let wordstart = wordstart1.wordstart;
  let wordend = wordstart1.wordend;

  const fisherYatesShuffle = (array) => {
    let shuffled;
    do {
      shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (JSON.stringify(shuffled) === JSON.stringify(array));
    return shuffled;
  };

  useEffect(() => {
    const getknownwordsfromapi = async () => {
      let knownwords = await getFlashcardsKnownWords(slug);
      // console.log(knownwords, "knownwords");
      if (!knownwords || knownwords.length === 0) {
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
        setOriginalQuizwords(knownwordsfiltered)
        //we need to get the examples from them 
        let examples = knownwordsfiltered[0].Meaning?.CommonFields?.Examples;
        //double check examples contain the word exactly
        console.log(examples, "examples");
        if (examples && examples.length > 0) {
          //  let filteredExamples = examples.filter(example => example.ExampleSentenceDE.includes(knownwordsfiltered[0].word));
          // console.log(filteredExamples, "filteredExamples");
          let randomIndex = Math.floor(Math.random() * examples.length);
          setCurrentExample(examples[randomIndex]);
          setCurrentExampleEnglish(examples[randomIndex].ExampleSentenceEN);

          let wordsarray = examples[randomIndex].ExampleSentenceDE.split(/(\s+|,|\?)/);
          wordsarray = wordsarray
            .map(word => word.replace(/\./g, "")) // Remove dots from words
            .filter(word => word.trim() !== ""); // Remove empty strings
          console.log(wordsarray, "wordsarray1");
          console.log(wordsarray, "wordsarray2");
          console.log(wordsarray, "wordsarray3");
          setCurrentExampleOrderedWords(wordsarray)
          setOriginalSentenceWordArrayLength(wordsarray.length);

          let randomizeorder = fisherYatesShuffle(wordsarray); // Use Fisher-Yates Shuffle
          console.log(randomizeorder, 'randomizeorder');
          setWordspickChoose(randomizeorder);
          console.log(wordsarray, "wordsarray4");
        } else {
          setCurrentExample(examples[0]);
          setCurrentExampleEnglish(examples[0].ExampleSentenceEN);
          let wordsarray = examples[0].ExampleSentenceDE.split(' ')
          console.log(wordsarray, 'wordsarray');
          let randomizeorder = fisherYatesShuffle(wordsarray); // Use Fisher-Yates Shuffle
          console.log(randomizeorder, 'randomizeorder');
          setWordspickChoose(randomizeorder);
        }
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

  useEffect(() => {
    console.log(currentexample, "currentexample");
    if (currentexample) {

      /*   let examplewithoutword = currentexample.ExampleSentenceDE.replace(new RegExp(currentquiz1word.word, 'gi'), '_____');
        setCurrentExampleWithoutWord(examplewithoutword); */
      //  const parts = currentexample.ExampleSentenceDE.split(
      //   new RegExp(`(${currentquiz1word.word})`, "gi")
      //  );
      const word = currentquiz1word.word;
      const sentence = currentexample.ExampleSentenceDE;
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      const parts = sentence.split(regex);

      const jsx = [];
      let matchCount = 0;

      parts.forEach((part, i) => {
        jsx.push(part);
        if (i < parts.length - 1) {
          jsx.push(
            <span
              key={`blank-${matchCount++}`}
              style={{
                borderBottom: "2px solid black",
                display: "inline-block",
                width: word.length * 12,
              }}
            />
          );
        }
      });


      setCurrentExampleWithoutWord(jsx);
    } else {
      setCurrentExampleWithoutWord(null);
    }
  }, [currentexample, currentquiz1word]);

  const includeword = (clickedword) => {

    setCurrentExampleScrambledreordered((prev) => [...prev, clickedword]);
    //remove from setWordspickChoose
    setWordspickChoose((prev) => {
      const index = prev.findIndex(word => word === clickedword);
      if (index !== -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      }
      return prev; // If the word is not found, return the array as is
    });
    let currentword = currentquiz1word.word
    console.log(currentword, 'currentword');
    console.log(clickedword, 'clickedword');

  }

  const excludeword = (clickedword) => {
    setCurrentExampleScrambledreordered((prev) => {
      const index = prev.findIndex(word => word === clickedword);
      if (index !== -1) {
        // Remove the first occurrence of the word
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      }
      return prev; // If the word is not found, return the array as is
    });
    //remove from setWordspickChoose
    setWordspickChoose((prev) => [...prev, clickedword]);
  }


  useEffect(() => {
    if (currentexamplescrambledreordered) {
      console.log('seeifmatch');
      console.log(originalsentencewordsarraylength, 'originalsentencewordsarraylength');
      console.log(currentexamplescrambledreordered.length, 'currentexamplescrambledreorderedlength');
      if (originalsentencewordsarraylength === currentexamplescrambledreordered.length) {
        // Check if the arrays match
        console.log('lengthsmatch');

        console.log(currentexampleorderedwords, 'currentexampleorderedwords');
        console.log(currentexamplescrambledreordered, 'currentexamplescrambledreordered');
        const areArraysEqual = JSON.stringify(currentexampleorderedwords) === JSON.stringify(currentexamplescrambledreordered);

        if (areArraysEqual) {
          console.log("The arrays match!");
          setShowCorrect(true);
          setShowWrong(false);

          // Proceed to the next word after a short delay
          setTimeout(() => {
            handleNextWord();
          }, 1000);
        } else {
          console.log("The arrays do not match.");
          setShowWrong(true);
          setShowCorrect(false);
        }
      }
    }
  }, [currentexamplescrambledreordered]);

  const [currentindexis, setCurrentIndexis] = useState(0);
  useEffect(() => {
    const index = wordsforquiz1.indexOf(currentquiz1word);
    setCurrentIndexis(index + 1);
  }, [currentquiz1word]);
  const handleNextWord = () => {
    const currentIndex = wordsforquiz1.indexOf(currentquiz1word);
    const nextWord = wordsforquiz1[currentIndex + 1];
    if (currentIndex < wordsforquiz1.length - 1) {
      setCurrentQuiz1Word(nextWord);
      setWordsLeftInStack((prev) => prev - 1);
      setShowCorrect(false);
      setShowWrong(false);
      setCurrentExampleScrambledreordered([]);

      let randomIndex = Math.floor(Math.random() * nextWord.Meaning?.CommonFields?.Examples?.length);
      setCurrentExample(nextWord.Meaning.CommonFields.Examples[randomIndex]);
      setCurrentExampleEnglish(nextWord.Meaning.CommonFields.Examples[randomIndex].ExampleSentenceEN);

      let wordsarray = nextWord.Meaning.CommonFields.Examples[randomIndex].ExampleSentenceDE.split(/(\s+|,|\?)/);
      wordsarray = wordsarray
        .map(word => word.replace(/\./g, "")) // Remove dots from words
        .filter(word => word.trim() !== ""); // Remove empty strings
      console.log(wordsarray, "wordsarray1");
      console.log(wordsarray, "wordsarray2");
      console.log(wordsarray, "wordsarray3");
      setCurrentExampleOrderedWords(wordsarray)
      setOriginalSentenceWordArrayLength(wordsarray.length);
      setShowExamples(false);
      setRevealAnswerDiv(false);
      setShowExamplesCount(0);

      let randomizeorder = fisherYatesShuffle(wordsarray); // Use Fisher-Yates Shuffle
      console.log(randomizeorder, 'randomizeorder');
      setWordspickChoose(randomizeorder);
    } else {
      setWordsLeftInStack(0);
    }
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
      <div className="quiz1-container mt-10">
        {/*  <h1>Quiz 1</h1> */}

        <div className="showwordtotranslate">
          {(!lessoncompletedv && currentquiz1word) && (
            <>
              <p className="text-center">Unscramble the sentence</p>
              <p>{wordsleftinstack} / {originalnumberwords}</p>
              <div className="quiz5showsentencediv text-center">
                {currentexamplescrambledreordered && currentexamplescrambledreordered.length > 0 && currentexamplescrambledreordered.map((word, index) => (

                  <button className="pill-badge cursor-pointer" key={index}
                    onClick={() => excludeword(word)}>
                    <span>{word}</span>
                  </button>
                ))}
                {/*  <p >{currentexampleEnglish}</p> */}
                {/*  <span className="quiz1wordtotranslate">
                  {showcorrect ?
                    currentexample.ExampleSentenceDE : currentexamplewithoutword
                  }
                </span> */}
                {/*    {currentexamplewithoutword}</span> */}
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

            </div>
          )}
        </div>
        {(!lessoncompletedv && currentquiz1word) && (
          <>
            <div className="quiz2pickwordsdiv flex flex-row gap-3">
              {(wordspickchoose && wordspickchoose.length > 0) && (
                wordspickchoose.map((word, index) => (
                  <button className="pill-badge cursor-pointer noselect" key={index}
                    onClick={() => includeword(word)}>
                    <span>{word}</span>
                  </button>
                ))
              )}
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
                      }>{showexamples ? "Hide English" : "Show English"}
                    </button>
                  )}

                </div>
                <div className="revealanswerdiv">
                  <button
                    className="button button-primary button-outline button-narrow"
                    onClick={() => {
                      setRevealAnswerDiv((prev) => !prev)
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

                          <li key={index}>{currentexample.ExampleSentenceEN}</li>
                        ))
                      ) : (
                        <li>No examples available</li>
                      )}
                    </ul>

                  </>
                )}
                {revealanswerdiv && (
                  <div className="revealanswer">
                    <p className="text-center quiz1wordtotranslate pt-10 pb-10">{currentexample.ExampleSentenceDE}
                      {/* {currentquiz1word.Meaning?.CommonFields?.TranslationDE} */}</p>
                  </div>
                )}
              </div>

            </div>

          </>
        )}
      </div >


    </>
  )
}

{/*  */ }