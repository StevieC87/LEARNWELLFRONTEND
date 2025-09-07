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
  setactivetab

} from "@/redux/slices/flashcardSlice";
import Link from 'next/link';
import customSessionStorage from "@/utilities/customSessionStorage";
export default function Quiz4(props) {
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

  const [originalquizwords, setOriginalQuizwords] = useState([])


  const [wordspickchoose, setWordspickChoose] = useState([])


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
        setOriginalQuizwords(knownwordsfiltered)
        //we need to get the examples from them 
        let examples = knownwordsfiltered[0].Meaning?.CommonFields?.Examples;
        //double check examples contain the word exactly
        console.log(examples, "examples");
        if (examples && examples.length > 0) {
          let filteredExamples = examples.filter(example => example.ExampleSentenceDE.includes(knownwordsfiltered[0].word));
          console.log(filteredExamples, "filteredExamples");
          if (filteredExamples.length > 0) {
            //pick a random example

            const randomIndex = Math.floor(Math.random() * filteredExamples.length);
            setCurrentExample(filteredExamples[randomIndex]);
            setCurrentExampleEnglish(filteredExamples[randomIndex].ExampleSentenceEN);
          } else {
            setCurrentExample(examples[0]);
            setCurrentExampleEnglish(examples[0].ExampleSentenceEN);
          }
        } else {
          setCurrentExample(null);
          setCurrentExampleEnglish(null);
        }
        let currentwordinGerman = knownwordsfiltered[0].word;
        let filtersamewords = knownwordsfiltered.filter(word => word.word !== currentwordinGerman);
        console.log(filtersamewords, 'filtersamewords');

        let uniquewords = [...new Set(filtersamewords.map(word => word.word))];
        console.log(uniquewords, 'uniquewords');
        //we need to find the meanings of the word that mean the same
        let currentwordis = knownwordsfiltered[0].word;

        //exclude 
        console.log(currentwordis,);

        let excludecurrentword = new Set([...uniquewords].filter(word => word !== knownwordsfiltered[0].word))
        console.log(excludecurrentword, 'excludecurrentword');
        let randomizedArray = Array.from(excludecurrentword).sort(() => Math.random() - 0.5);
        console.log(randomizedArray, 'randomizedArray');
        let pick3words = randomizedArray.splice(0, 3)
        console.log(pick3words, 'pick3words');
        console.log(currentword, 'currentwordword');
        console.log(knownwordsfiltered[0].word, 'knownword0');
        let finalarraywordschoose = pick3words.push(knownwordsfiltered[0].word)
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

  useEffect(() => {
    console.log(currentexample, "currentexample");
    if (currentexample) {

      /*   let examplewithoutword = currentexample.ExampleSentenceDE.replace(new RegExp(currentquiz1word.word, 'gi'), '_____');
        setCurrentExampleWithoutWord(examplewithoutword); */
      //  const parts = currentexample.ExampleSentenceDE.split(
      //   new RegExp(`(${currentquiz1word.word})`, "gi")
      //  );
      const word = currentquiz1word.word;
      // Escape regex special chars in the word
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      console.log(escapedWord, "escapedWord");
      let regex;
      let slashwordchosen;
      if (escapedWord.includes('/')) {
        //if it includes a /, then split it into two words and make a regex that matches either of them
        const parts = escapedWord.split('/').map(part => part.trim());
        console.log(parts, 'partsparts');
        //  regex = new RegExp(`(?<!\\p{L})(${parts.join('|')})(?!\\p{L})`, "giu");
        parts.forEach((part, index) => {
          //check if sentence contains this part 
          let regex = new RegExp(`(?<!\\p{L})${part}(?!\\p{L})`, "iu");
          console.log(regex, 'regexinpartsloop');
          const matches = currentexample.ExampleSentenceDE.match(regex);
          if (matches && matches.length > 0) {
            console.log(part, 'partpart');
            const sentence = currentexample.ExampleSentenceDE;
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
                      width: '40px',
                      /*  width: word.length * 12, */
                    }}
                  />
                );
              }
            });
            setCurrentExampleWithoutWord(jsx);


            console.log(`Chosen slash word: ${slashwordchosen}`);
          }

          console.log(`Part ${index}: ${part}`);
        })


        //  regex = new RegExp(`(?<!\\p{L})(${parts.join('|')})(?!\\p{L})`, "giu"); // Updated regex to match either word
      } else {
        // Use Unicode regex, match full word
        regex = new RegExp(`(?<!\\p{L})${escapedWord}(?!\\p{L})`, "giu");
        const sentence = currentexample.ExampleSentenceDE;
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
                  width: '40px',
                  //width: word.length * 12,
                }}
              />
            );
          }
        });
        setCurrentExampleWithoutWord(jsx);
      }


    } else {
      setCurrentExampleWithoutWord(null);
    }
  }, [currentexample, currentquiz1word]);
  const compareWords = (clickedword) => {
    let currentword = currentquiz1word.word
    console.log(currentword, 'currentword');
    console.log(clickedword, 'clickedword');
    if (currentword === clickedword) {
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

      // setWordsWithMistakesToSaveForReview([...wordswithmistaketosaveforreview, currentquiz1word]);
      setWordsWithMistakesToSaveForReview(prev => {

        return prev;
      });
      setShowCorrect(false);
      // Handle the case where w
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
      let examples = nextWord.Meaning?.CommonFields?.Examples;
      //double check examples contain the word exactly
      console.log(examples, "examples");
      if (examples && examples.length > 0) {
        let filteredExamples = examples.filter(example => example.ExampleSentenceDE.includes(nextWord.word));
        console.log(filteredExamples, "filteredExamples");
        if (filteredExamples.length > 0) {
          // setCurrentExample(filteredExamples[0]);
          const randomIndex = Math.floor(Math.random() * filteredExamples.length);
          setCurrentExample(filteredExamples[randomIndex]);
          setCurrentExampleEnglish(filteredExamples[randomIndex].ExampleSentenceEN);
        } else {
          setCurrentExample(examples[0]);
          setCurrentExampleEnglish(examples[0].ExampleSentenceEN);
        }
      } else {
        setCurrentExample(null);
        setCurrentExampleEnglish(null);
      }
      console.log(nextWord, "nextWord");
      let currentwordinGerman = nextWord.word;
      let filtersamewords = originalquizwords.filter(word => word.word !== currentwordinGerman);
      console.log(filtersamewords, 'filtersamewords');

      let uniquewords = [...new Set(filtersamewords.map(word => word.word))];
      console.log(uniquewords, 'uniquewords');
      //we need to find the meanings of the word that mean the same
      let currentwordis = nextWord.word;
      let excludecurrentword = new Set([...uniquewords].filter(word => word !== currentwordis))
      console.log(excludecurrentword, 'excludecurrentword');
      let randomizedArray = Array.from(excludecurrentword).sort(() => Math.random() - 0.5);
      console.log(randomizedArray, 'randomizedArray');
      let pick3words = randomizedArray.splice(0, 3)
      console.log(pick3words, 'pick3words');
      pick3words.push(currentwordis);
      console.log(pick3words, 'pick3words');
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
      <div className="quiz1-container mt-10">
        {/*  <h1>Quiz 1</h1> */}

        <div className="showwordtotranslate">
          {(!lessoncompletedv && currentquiz1word) && (
            <>
              <p className="text-center">Pick the word</p>
              <p>{wordsleftinstack} / {originalnumberwords}</p>
              <div className="maxdiv pt-10 pb-10 text-center">
                <p >{currentexampleEnglish}</p>
                <span className="quiz1wordtotranslate">
                  {showcorrect ?
                    currentexample.ExampleSentenceDE : currentexamplewithoutword
                  }
                </span>
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
              <p className="underline cursor-pointer" onClick={() => dispatch(setactivetab('quiz5'))}>or Do the Next Quiz!</p>
            </div>
          )}
        </div>
        {(!lessoncompletedv && currentquiz1word) && (
          <>
            <div className="quiz2pickwordsdiv flex flex-row gap-3">
              {(wordspickchoose && wordspickchoose.length > 0) && (
                wordspickchoose.map((word, index) => (
                  <button className="pill-badge cursor-pointer noselect" key={index}
                    onClick={() => compareWords(word)}>
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

                          <li key={index}>{currentexampleEnglish}</li>
                        ))
                      ) : (
                        <li>No examples available</li>
                      )}
                    </ul>

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

          </>
        )}
      </div >


    </>
  )
}

{/*  */ }