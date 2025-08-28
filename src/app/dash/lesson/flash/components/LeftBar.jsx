"use client";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  setdifficultylevels,
  setAllWords2,
  setCurrentWord,
  seterrorNoWords,
  setfluentWORDSArray,
  setfamiliarWORDSArray,
  setuncertainWORDSArray,
  setnewwordsArray,
  setnumberoffluentwords,
  setnumberoffamiliarwords,
  setnumberofuncertainwords,
  setnumberofnewwords,
} from "@/redux/slices/flashcardSlice";
import { useEffect } from "react";

/* WHAT ILL DO 
  WHEN U CLICK ON ONE OF THE DIFFICULTIES
  IT CHECKS IN REDUX (create states) - IF THE DIFFICULTY IS TRUE OR NOT (PRESENT)
    OR CAN CHECK THE ARRAY - FILTER SEE  - instead of states
  IF IT'S TRUE - then WE FILTER IT AND UPDATE THE ALLWORDS ARRAY
  IF IT'S FALSE - THEN WE HAVE THE ARRAY ANYWAY WITH ALL THE WORDS - AND WE PUSH IT (...array) to allwords
*/

const Leftbar = () => {
  const dispatch = useDispatch();
  const difficultylevels = useSelector(
    (state) => state.flashcardSlice.difficultylevels
  );
  const showRemainingWords2 = useSelector(
    (state) => state.flashcardSlice.showRemainingWords2
  );
  const allwords = useSelector((state) => state.flashcardSlice.allwords);
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
  const allknownwordsdata = useSelector(
    (state) => state.flashcardSlice.allknownwordsdata
  );
  console.log(showRemainingWords2, "showRemainingWords2ssss");

  useEffect(() => {
    let getfluentwordsarray = allknownwordsdata.filter(
      (word) => word.difficulty === "Fluent"
    );
    dispatch(setfluentWORDSArray(getfluentwordsarray));

    let getfamiliarwordsarray = allknownwordsdata.filter(
      (word) => word.difficulty === "Familiar"
    );
    dispatch(setfamiliarWORDSArray(getfamiliarwordsarray));

    let getuncertainwordsarray = allknownwordsdata.filter(
      (word) => word.difficulty === "Uncertain"
    );
    dispatch(setuncertainWORDSArray(getuncertainwordsarray));

    let getnewwordsarray = allknownwordsdata.filter(
      (word) => word.difficulty === "New"
    );
    dispatch(setnewwordsArray(getnewwordsarray));
  }, [allknownwordsdata]);


  const addremoveDifficulty = (difficulty) => {
    // alert("addremoveDifficulty");
    //if it exists remove from array of difficulties
    if (difficultylevels.includes(difficulty)) {
      //* FIRST: if it's the last remaining difficulty, stop it otherwise bug - no current word - say - must have at least one difficulty - OR SHOW NOTHING
      if (difficultylevels.length === 1) {
        return;
      }

      let newdifficultylevels = difficultylevels.filter(
        (diff) => diff !== difficulty
      );

      console.log(newdifficultylevels, "newdifficultylevels");
      dispatch(setdifficultylevels(newdifficultylevels));
      //ALSO UPDATE THE ALLWORDS ARRAY WITHOUT THE DIFFICULTY
      console.log(allwords, "allwords555555555");
      let newallwords = allwords.filter(
        (word) => word.difficulty !== difficulty
      );
      console.log(newallwords, "newallword55555555s");
      dispatch(setAllWords2(newallwords));
      //change current word
      dispatch(setCurrentWord(newallwords[0]));

      //if it doesn't exist add to array of difficulties
    } else {
      let newdifficultylevels = [...difficultylevels, difficulty];
      //stringify newdifficultylevels and alert

      dispatch(setdifficultylevels(newdifficultylevels));

      //ALSO UPDATE THE ALLWORDS ARRAY WITH THE DIFFICULTY'S WORDS
      //HERE WE WILL NEED TO PUSH THE ARRAY OF THESE WORDS TO THE ALLWORDS ARRAY
      if (difficulty === "Fluent") {
        let newallwords1 = [...allwords, ...fluentWORDSArray];
        console.log(newallwords1, "newallwords1aaaaa");
        dispatch(setAllWords2(newallwords1));
        dispatch(setCurrentWord(newallwords1[0]));
      } else if (difficulty === "Familiar") {
        let newallwords2 = [...allwords, ...familiarWORDSArray];
        dispatch(setAllWords2(newallwords2));
        dispatch(setCurrentWord(newallwords2[0]));
      } else if (difficulty === "Uncertain") {
        let newallwords3 = [...allwords, ...uncertainWORDSArray];
        dispatch(setAllWords2(newallwords3));
        dispatch(setCurrentWord(newallwords3[0]));
      } else if (difficulty === "New") {
        let newallwords4 = [...allwords, ...newwordsArray];
        dispatch(setAllWords2(newallwords4));
        dispatch(setCurrentWord(newallwords4[0]));
      }
      //change current word
    }

    console.log(difficulty, "difficulty");
  };

  return (
    <>
      {!showRemainingWords2 && (
        <div className="difficultyChoose">
          {/*  <div>
            <u> </u>
          </div> */}
          {/* i want TO ADD DIFFICULTIES - NOT EXCLUSIVE so can mix */}
          <div
            onClick={() => addremoveDifficulty("Fluent")}
            className={`cursor-pointer diffclick ${difficultylevels.includes("Fluent") ? "bold" : ""
              }`}
          >
            <span>{difficultylevels.includes("Fluent") ? "Shown" : "Hidden"
            }</span>
            <span> ({fluentWORDSArray.length})</span>
          </div>
          <div
            onClick={() => addremoveDifficulty("Familiar")}
            className={`cursor-pointer diffclick ${difficultylevels.includes("Familiar") ? "bold" : ""
              }`}
          >
            <span>
              {difficultylevels.includes("Familiar") ? "Shown" : "Hidden"
              }
            </span>
            <span>({familiarWORDSArray.length})</span>
          </div>
          <div
            onClick={() => addremoveDifficulty("Uncertain")}
            className={`cursor-pointer diffclick ${difficultylevels.includes("Uncertain") ? "bold" : ""
              }`}
          >
            <span>
              {difficultylevels.includes("Uncertain") ? "Shown" : "Hidden"
              }
            </span>
            <span>({uncertainWORDSArray.length})</span>
          </div>
          <div
            onClick={() => addremoveDifficulty("New")}
            className={`cursor-pointer diffclick ${difficultylevels.includes("New") ? "bold" : ""
              }`}
          >
            <span>
              {difficultylevels.includes("New") ? "Shown" : "Hidden"
              }
            </span>
            <span>({newwordsArray.length})</span>
          </div>
          {/*  <span> {allwords.length} </span> */}
        </div>
      )}
    </>
  );
};

export default Leftbar;
