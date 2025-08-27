"use client";
import { useDispatch, useSelector } from "react-redux";
// import { setdifficultylevels } from "@/redux/slices/flashcardSlice";
import {
  setWordSaved,
  setCurrentWord,
  setOriginal,
  setTotalWordsKnown,
  setTotalWordsRemaining,
  setAllWords2,
  setallknownwordsdata,
  setallremainingwordsdata,
  setfluentWORDSArray,
  setfamiliarWORDSArray,
  setuncertainWORDSArray,
  setnewwordsArray,
  setdifficultybuttonclicked
} from "@/redux/slices/flashcardSlice";
import { flashcardsUserSaveWord } from "../services/fetchwords";
import {
  getFlashcardsRemaining,
  getFlashcardsKnownWords,
} from "../services/fetchwords";

/* setnumberoffluentwords,
  setnumberoffamiliarwords,
  setnumberofuncertainwords,
  setnumberofnewwords, */

const DifficultyButtons = () => {
  const dispatch = useDispatch();
  const showOriginal = useSelector(
    (state) => state.flashcardSlice.showOriginal
  );
  const wordsaved = useSelector((state) => state.flashcardSlice.wordsaved);
  const currentword = useSelector((state) => state.flashcardSlice.currentword);
  const allwords = useSelector((state) => state.flashcardSlice.allwords);
  const totalwordsknown = useSelector(
    (state) => state.flashcardSlice.totalwordsknown
  );
  const totalwordsremaining = useSelector(
    (state) => state.flashcardSlice.totalwordsremaining
  );
  const showRemainingWords2 = useSelector(
    (state) => state.flashcardSlice.showRemainingWords2
  );

  const allremainingwordsdata = useSelector(
    (state) => state.flashcardSlice.allremainingwordsdata
  );
  const allknownwordsdata = useSelector(
    (state) => state.flashcardSlice.allknownwordsdata
  );

  const fluentWORDSArray = useSelector(
    (state) => state.flashcardSlice.fluentWORDSArray
  );
  const familiarWORDSArray = useSelector(
    (state) => state.flashcardSlice.familiarWORDSArray
  );
  const uncertainWORDSArray = useSelector(
    (state) => state.flashcardSlice.uncertainWORDSArray
  );
  const newwordsArray = useSelector(
    (state) => state.flashcardSlice.newwordsArray
  );
  const disablediffbuttons = useSelector(
    (state) => state.flashcardSlice.disablediffbuttons
  );

  const difficultylevels = useSelector(
    (state) => state.flashcardSlice.difficultylevels
  );
  console.log(difficultylevels, "difficultylevels from diffbtns");

  const handleChangeWord = () => {
    let currentindex = allwords.indexOf(currentword);
    if (currentindex === allwords.length - 1) {
      dispatch(setCurrentWord(allwords[0]));
      dispatch(setOriginal(true));
    } else {

      dispatch(setCurrentWord(allwords[currentindex + 1]));
      dispatch(setOriginal(true));
    }
  };

  const submitWord = async (difficulty) => {
    dispatch(setdifficultybuttonclicked(true))
    let wordtosubmit = {
      // wordde: currentword.word,
      wordid: currentword._id,
      word: currentword.word,
      difficulty: difficulty,
      sortnumber: currentword.sortnumber,
    };
    console.log(wordtosubmit, "wordtosubmit2222");

    //will insert or update existing word in db
    //  setWordSaved(true);
    const data = await flashcardsUserSaveWord(wordtosubmit);
    console.log(totalwordsremaining, "totalwordsremaining123");
    console.log(totalwordsknown, "totalwordsknown123");
    console.log(data, "data");
    if (!data) {
      console.log("No data returned from API");
    }
    if (data.acknowledged === true) {
      // console.log("yes trueeee");
      //alert("saved");
      dispatch(setWordSaved(true));

      if (currentword.difficulty) {
        let newcurr = { ...currentword, difficulty: difficulty };
        dispatch(setCurrentWord(newcurr));
        console.log(newcurr, "newcurr");
        //find index in allknownwrds and change difficulty
        let currentwordid1 = currentword._id;
        //find exissting word in allknownwordsdata and change difficilty
        let newallknownwords = allknownwordsdata.map((word) => {
          if (word._id === currentwordid1) {
            // alert("found");
            return { ...word, difficulty: difficulty };
          }
          return word;
        });
        console.log(newallknownwords, "newallknownword33333s");

        dispatch(setallknownwordsdata(newallknownwords));
        //remove current word from allwords array
        let currentwordid = currentword._id;
        // console.log(, "currentwordindex1");
        //IF WE ARE SAVING AT SAME DIFFICULTY AS ORIGINAL - dont remove from ALL WORDS
        let existingdifficultyknownword = currentword.difficulty;
        console.log(existingdifficultyknownword, "existingdifficultyknownword");
        let newdifficulty = difficulty;
        console.log(newdifficulty, "newdifficulty");
        console.log(allwords, "allwordsBEFORECHANGE");

        //ALL WORDS DEPENDS ON WHAT DIFFICULTIES WE ARE SHOWING RIGHT NOW \
        //so e.g if are dshowing new, and unsure, if we move them within two shouldn tchange, 
        //but if e.g. we are shwoing new and fluent, and we move it to another one, IT SHOLDNT INCLUDE THIS WORD ANYMORE. 
        let thisworddifficultylevel = currentword.difficulty;
        console.log(thisworddifficultylevel, "thisworddifficultylevel");
        //! here dePENDS IF WE ARE IN WHAT MODE : COVERED OR REMAINIGN
        if (!showRemainingWords2) {

          if (!difficultylevels.includes(difficulty)) {
            //if we are showing the difficulty level of the current word - then remove it from allwords
            let filtered = allwords.filter(
              (word) => word._id !== currentwordid
            );
            dispatch(setAllWords2(filtered));
            console.log(filtered, "allwordsAFTERCHANGE");
            if (allwords.length === 1) {
              alert('one left')
              dispatch(setCurrentWord({}));
              dispatch(setAllWords2([]));

            }
          }

        }
        else if (showRemainingWords2)
          if (existingdifficultyknownword !== newdifficulty) {
            let filtered = allwords.filter((word) => word._id !== currentwordid);
            dispatch(setAllWords2(filtered));
            console.log(filtered, 'allwordsAFTERCHANGE');
          }


      } else {

        let currentwordindex = allwords.indexOf(currentword);
        console.log(currentwordindex, "currentwordindex");
        //make a copy of the allwords array
        let newallwords = [...allwords];
        //remo  ve by index
        newallwords.splice(currentwordindex, 1);
        console.log(newallwords, "newallwords4444444");
        dispatch(setAllWords2(newallwords));

        //add diff to current word
        let newcurr = { ...currentword, difficulty: difficulty };

        //REMOVE WORD FROM allremainingwordsdata array
        //get wordid of currentword
        let currentwordid = currentword._id;
        let filteredremainingwords = allremainingwordsdata.filter(
          (word) => word._id !== currentwordid
        );
        dispatch(setallremainingwordsdata(filteredremainingwords));
        dispatch(setTotalWordsKnown(totalwordsknown + 1));
        dispatch(setTotalWordsRemaining(totalwordsremaining - 1));
        dispatch(setallknownwordsdata([...allknownwordsdata, newcurr]));
      }
      if (allwords.length > 1) {
        handleChangeWord("next");
      }

    }
    setTimeout(() => {
      dispatch(setdifficultybuttonclicked(false))
    }, 1000
    )
  };

  return (
    <>
      <div className="bottombartoptop">
        <button
          className="btn mybtn diffic-btn buttonSaveWord fluentbtn"
          onClick={() => submitWord("Fluent")}
          disabled={disablediffbuttons}
        >
          Never Show Again
        </button>
        <button
          className="btn mybtn diffic-btn buttonSaveWord familiarbtn"
          onClick={() => submitWord("Familiar")}
          disabled={disablediffbuttons}
        >
          Knew it
        </button>{" "}

        <button
          className="btn mybtn diffic-btn buttonSaveWord uncertainbtn"
          onClick={() => submitWord("Uncertain")}
          disabled={disablediffbuttons}
        >
          Unsure
        </button>
        <button
          className="btn mybtn diffic-btn buttonSaveWord newbtn"
          onClick={() => submitWord("New")}
          disabled={disablediffbuttons}
        >
          Didn't Know
        </button>
        {/* <button
          className="btn mybtn diffic-btn buttonSaveWord problembtn"
          onClick={() => submitWord("Problem")}
          disabled={disablediffbuttons}
        >
          Problem
        </button> */}
      </div>
      {/*  {wordsaved ? (
        <div className="bottombartopbottom">
          <div className="confirmsaved">WORD Saved</div>
        </div>
      ) : (
        ""
      )} */}
    </>
  );
};

export default DifficultyButtons;
