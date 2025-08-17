"use client";
import { useState, useEffect } from "react";
import "./flashcardcss.css";
import { useDispatch, useSelector } from "react-redux";

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
import BottomBar from "./components/BottomBar";
import DifficultyButtons from "./components/DifficultyButtons";
import ActualFlashcardSentences from "./components/ActualFlashcardSentences";
import ChooseStack from "./components/ChooseStack";
import LeftBar from "./components/LeftBar";
import ProgressBar from "./components/ProgressBar";
import { usePathname } from "next/navigation";
import {
  getFlashcardsRemaining,
  getFlashcardsKnownWords,
} from "./services/fetchwords";
import { dynamichunneds } from '../../../../utilities/arrayswordshunneds';

export default function FlashcardPage() {
  const dispatch = useDispatch();

  const pathname = usePathname();

  const slug = pathname.split("/").pop();
  //console.log(slug, "slugsss");
  if (isNaN(slug)) {
    return <div>error</div>;
  }

  //first we clean out the redux to not show anything if we switch to another page

  /*  */

  let wordstartwordendarray = dynamichunneds(20);

  let wordstart1 = wordstartwordendarray.find((item) => item.id === parseInt(slug));
  // console.log(wordstart1, "wordstart1");
  let wordstart = wordstart1.wordstart;
  // console.log(wordstart, "wordstart");
  let wordend = wordstart1.wordend;
  // console.log(wordend, "wordend");

  const hello = useSelector((state) => state.flashcardSlice.hello);
  //console.log(hello, "hello");

  const allwords = useSelector((state) => state.flashcardSlice.allwords);
  const currentword = useSelector((state) => state.flashcardSlice.currentword);
  const showOriginal = useSelector(
    (state) => state.flashcardSlice.showOriginal
  );
  const showTranslation = useSelector(
    (state) => state.flashcardSlice.showTranslation
  );
  const ShowRemainingWords = useSelector(
    (state) => state.flashcardSlice.ShowRemainingWords
  );
  const wordsaved = useSelector((state) => state.flashcardSlice.wordsaved);
  const isDarkMode = useSelector((state) => state.flashcardSlice.isDarkMode);
  const difficultylevelSELECTED = useSelector(
    (state) => state.flashcardSlice.difficultylevelSELECTED
  );
  const showallwords3 = useSelector(
    (state) => state.flashcardSlice.showallwords3
  );
  const isloading = useSelector((state) => state.flashcardSlice.isloading);
  const errorNoWords = useSelector(
    (state) => state.flashcardSlice.errorNoWords
  );
  const allremainingwordsdata = useSelector(
    (state) => state.flashcardSlice.allremainingwordsdata
  );
  const allknownwordsdata = useSelector(
    (state) => state.flashcardSlice.allknownwordsdata
  );
  const showRemainingWords2 = useSelector(
    (state) => state.flashcardSlice.showRemainingWords2
  );

  //!replace this with redux after
  //  const [totalwordsknown, setTotalWordsKnown] = useState(0);
  // const [totalwordsremaining, setTotalWordsRemaining] = useState(0);
  const totalwordsknown = useSelector(
    (state) => state.flashcardSlice.totalwordsknown
  );
  const totalwordsremaining = useSelector(
    (state) => state.flashcardSlice.totalwordsremaining
  );

  let totalwordsremainingVAR;
  let totalknownwrodsknownVAR;

  //USE EFFECT FUNCTIONS - TO GET WORDS (KNOWN & REMAINING)
  //GET INITIAL WORDS
  const getKnownWords = async (wordstart, wordend) => {
    //alert("000");
    let knownwords = await getFlashcardsKnownWords(wordstart, wordend);
    // console.log(knownwords, "knownwords");
    if (!knownwords || knownwords.length === 0) {
      //alert("111");
      return;
    } else {
      //alert("2222");
      return knownwords;
    }
  };
  //GET REMAINING WORDS
  const getRemainingWords = async (wordstart, wordend) => {
    let dataknown = await getFlashcardsRemaining(wordstart, wordend);
    //MOVE THIS SETTERS - to where called
    if (dataknown || dataknown.length === 0) {
      return dataknown;
    } else {
      return [];
    }
  };
  //--------------------------------------------------
  function filterbydifficulty(array, difficulty) {
    let totalbydifficulty = array.filter(
      (word) => word.difficulty === difficulty
    );
    return totalbydifficulty;
  }

  //--------------------------------------------------
  useEffect(() => {
    const fetchwordsBOTH = async () => {
      //AFTER FETCH - WE ONLY LOAD THE WORDS to their RESPECTIVE ARRAY
      //WE DONT HAVE 'ALL WORDS' ARRAY ANYMORE (that takes either)

      //------------GET & SET REMAINING WORDS -----------------------
      let getremainingwords;
      if (wordstart && wordend) {
        getremainingwords = await getRemainingWords(wordstart, wordend);
      } else {
        return <div>error</div>;
      }
      if (getremainingwords.length > 0) {
        // console.log(getremainingwords, "getremainingwords");
        // setTotalWordsRemaining(getremainingwords.length);
        dispatch(setTotalWordsRemaining(getremainingwords.length));
        //WE PUT ALL REMAINING WORDS IN ARRAY REDUX

        //i want to randomise the order of the array words

        //dispatch(setoriginalarrayorder(getremainingwords));
        /*    let randomisedArray = getremainingwords.sort(() => Math.random() - 0.5);
           console.log(randomisedArray, "randomisedArrayaaaaaa"); */
        //  dispatch(setallremainingwordsdata(randomisedArray));
        //  dispatch(setAllWords2(randomisedArray));
        dispatch(setallremainingwordsdata(getremainingwords));
        dispatch(setAllWords2(getremainingwords));
        //  console.log(getremainingwords[0], "getremainingwords[0]");
        dispatch(setCurrentWord(getremainingwords[0]));
        dispatch(setisloading(false));
        //! keep THIS FOR NOW - check again
        totalwordsremainingVAR = getremainingwords;
      } else {
        dispatch(seterrorNoWords(true));
        dispatch(setallremainingwordsdata([]));
        dispatch(setAllWords2([]));
        // dispatch(setallremainingwordsdata(getremainingwords));
        // dispatch(setAllWords2(getremainingwords));
        //  console.log(getremainingwords[0], "getremainingwords[0]");
        dispatch(setCurrentWord({}));
        dispatch(setisloading(false));
        //  if (showRemainingWords2) {
        //
        // }
        console.log("NO REMAINING WORDS");
        // return [];
      }
      //------------GET & SET  KNOWN WORDS -----------------------

      let getknownwordsf = await getKnownWords(wordstart, wordend);
      // alert("hello");
      if (getknownwordsf && getknownwordsf.length > 0) {
        // console.log(getknownwordsf, "getknownwordsf");
        // setTotalWordsKnown(getknownwordsf.length);
        dispatch(setTotalWordsKnown(getknownwordsf.length));

        //WE PUT ALL KNOWS WORDS IN ARRAY REDUX
        //dispatch(setAllWords2(getknownwordsf));
        dispatch(setallknownwordsdata(getknownwordsf));
        //dispatch(setCurrentWord(getknownwordsf[0]));
        if (!showRemainingWords2) {
          dispatch(seterrorNoWords(true));
        }

        dispatch(setisloading(false));

        //CREATE ARRAY OF WORDS FOR EACH DIFFICULTY LEVEL
        let fluentWORDS1 = getknownwordsf.filter(
          (word) => word.difficulty === "Fluent"
        );
        let familiarWORDS = getknownwordsf.filter(
          (word) => word.difficulty === "Familiar"
        );
        let uncertainWORDS = getknownwordsf.filter(
          (word) => word.difficulty === "Uncertain"
        );
        let newwords = getknownwordsf.filter(
          (word) => word.difficulty === "New"
        );

        dispatch(setfluentWORDSArray(fluentWORDS1));
        dispatch(setfamiliarWORDSArray(familiarWORDS));
        dispatch(setuncertainWORDSArray(uncertainWORDS));
        dispatch(setnewwordsArray(newwords));

        // console.log(fluentWORDS1, "fluentwords444333");
        // console.log(familiarWORDS, "familiarwords");
        // console.log(uncertainWORDS, "uncertainwords");
        // console.log(newwords, "newwords");

        //! keep THIS FOR NOW - check again
        totalknownwrodsknownVAR = getknownwordsf;
      } else {
        // alert("no known words found");
        dispatch(setallknownwordsdata([]));
        dispatch(seterrorNoWords(true));
        console.log("NO KNOWN WORDS");
        return [];
      }

      //--------------GET & SET REMAINING WORDS -------------------

      //--------------------------------------------------
      //ARRAY OF KNOWN WORDS BY DIFFICULTY LEVEL
      //!CAN ADD THIS TO REDUX LATER
      let knownfluentwords = filterbydifficulty(getknownwordsf, "Fluent");
      let knownfamiliarwords = filterbydifficulty(getknownwordsf, "Familiar");
      let knownuncertainwords = filterbydifficulty(getknownwordsf, "Uncertain");
      let knownnewwords = filterbydifficulty(getknownwordsf, "New");

      // setShowAllWords3(showallwords2);
    };
    fetchwordsBOTH();
  }, []);

  //DISABLE DIFFICULTY BUTTONS when no remaining words - only covered - avoid bugs
  useEffect(() => {
    //WE WANT TO WAIT A BIT UNTIL THE DATA IS FETCHED

    if (allremainingwordsdata.length == 0 && allknownwordsdata.length === 0) {
      dispatch(setdisablediffbuttons(true));
      //alert("1");
    } else if (
      allremainingwordsdata.length === 0 &&
      allknownwordsdata.length !== 0 &&
      showRemainingWords2
    ) {
      //alert("2");
      dispatch(setdisablediffbuttons(true));
    } else if (
      allremainingwordsdata.length == 0 &&
      allknownwordsdata.length !== 0 &&
      !showRemainingWords2
    ) {
      // alert("3");
      dispatch(setdisablediffbuttons(false));
    } else if (
      allremainingwordsdata.length !== 0 &&
      allknownwordsdata.length == 0 &&
      showRemainingWords2
    ) {
      //alert("4");
      dispatch(setdisablediffbuttons(false));
    } else if (
      allremainingwordsdata.length !== 0 &&
      allknownwordsdata.length === 0 &&
      !showRemainingWords2
    ) {
      // alert("5");
      dispatch(setdisablediffbuttons(true));
    }
  }, [showRemainingWords2, allremainingwordsdata, allknownwordsdata]);
  // --------------------------------------------------
  return (
    <div className="flashmain" style={{ minHeight: "100vh" }}>

      <h3>Words {wordstart} - {wordend} </h3>
      {/*  {totalwordsknown}
      {totalwordsremaining} */}
      {/*  <div className="flashcardwrapper"> */}
      <div
        className={`flashcardwrapper ${!showRemainingWords2 ? "flashcardwrapperleft" : ""
          }`}
      >
        <div className="chooseWordStack">
          <ChooseStack />
        </div>
        <div className="leftbar">{!showRemainingWords2 && <LeftBar />}</div>
        <div className="bottomBartop">
          <DifficultyButtons />
        </div>
      </div>

      <div className="skeletonWrapper">
        <div className="skeletonCenter">
          {/*  <ActualFlashcard /> */}
          <ActualFlashcardSentences wordnostart={parseInt(slug)} />
        </div>

        <div className="botttombar">
          <div className="bottomBarbottom">{<BottomBar />}</div>
        </div>
      </div>
    </div>
  );
}

//!MAYBE LATER
/*
totalcombinedArray.push(...fluentWORDS1);
totalcombinedArray.push(...familiarWORDS);
totalcombinedArray.push(...uncertainWORDS);
totalcombinedArray.push(...newwords);

console.log(totalcombinedArray, "totalcombinedArray121212");

dispatch(setAllWords(allbutfluentArray));
dispatch(setdifficultylevels(["Familiar", "Uncertain", "New"]));
console.log(data, "data"); */

//! i think it's rubbish DUNNO ABOUT THIS CANT REMEMBER WHY I COMMENTED IT OUT
/*useEffect(() => {
    console.log(difficultylevelSELECTED, "difficultylevelSELECTED");
    let newarray = [];

    if (difficultylevelSELECTED.includes("Fluent")) {
      console.log("INCLUDES FLUENT");
      let filteredknownwords1 = allwords.filter((item) => {
        console.log(item.difficulty, "item.difficulty");
        if (item.difficulty === "Fluent") {
          return false;
        } else {
          return true;
        }
      });
      console.log(filteredknownwords1, "filteredknownwords1");
      if (filteredknownwords1.length > 0) {
        newarray.push(filteredknownwords1);
      }
      // setAllWords(filteredknownwords);
    }
    if (difficultylevelSELECTED.includes("Familiar")) {
      console.log("INCLUDES FAMILIAR");
      let filteredknownwords2 = allwords.filter((item) => {
        console.log(item.difficulty, "item.difficulty");
        if (item.difficulty === "Familiar") {
          return true;
        } else {
          return false;
        }
      });
      console.log(filteredknownwords2, "filteredknownwords2");
      if (filteredknownwords2.length > 0) {
        newarray.push(filteredknownwords2);
      }
    }
    if (difficultylevelSELECTED.includes("Uncertain")) {
      console.log("INCLUDES UNCERTAIN");
      let filteredknownwords3 = allwords.filter((item) => {
        console.log(item.difficulty, "item.difficulty");
        if (item.difficulty === "Uncertain") {
          return true;
        } else {
          return false;
        }
      });
      console.log(filteredknownwords3, "filteredknownwords3");
      if (filteredknownwords3.length > 0) {
        newarray.push(filteredknownwords3);
      }
    }
    if (difficultylevelSELECTED.includes("New")) {
      console.log("INCLUDES NEW");
      let filteredknownwords4 = allwords.filter((item) => {
        console.log(item, "itemNEWNEWNEW");
        console.log(item.difficulty, "item.difficulty");
        if (item.difficulty === "New") {
          return true;
        } else {
          return false;
        }
      });
      console.log(filteredknownwords4, "filteredknownwords4");
      if (filteredknownwords4.length > 0) {
        newarray.push(filteredknownwords4);
      }
    }
    let flattenedArray = newarray.flat();
    console.log(flattenedArray, "flattenedArray");

    if (flattenedArray.length > 0) {
      console.log("newarray8888", newarray);
      dispatch(setAllWords(flattenedArray));
      // setAllWords(flattenedArray);
      dispatch(setCurrentWord(flattenedArray[0]));
      // setCurrentWord(flattenedArray[0]);
    }

    console.log(flattenedArray, "newarray111");
  }, [difficultylevelSELECTED]);
 */
