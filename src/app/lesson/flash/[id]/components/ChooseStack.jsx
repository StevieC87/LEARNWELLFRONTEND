"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getFlashcardsRemaining,
  getFlashcardsKnownWords,
} from "../services/fetchwords";
// import { setdifficultylevels } from "@/redux/slices/flashcardSlice";
import {
  showRemainingWords,
  setShowAllWords3,
  setAllWords2,
  setOriginal,
  setCurrentWord,
  setShowRemainingWords2,
  setKnownFilteredWords,
  setfluentWORDSArray,
  setfamiliarWORDSArray,
  setuncertainWORDSArray,
  setnewwordsArray,
  setdifficultylevels,
  setisloading,
  seterrorNoWords,
  setallknownwordsdata,
  setallremainingwordsdata,
  setswitchbuttondeen,
} from "@/redux/slices/flashcardSlice";
/* import ProgressBar from "./ProgressBar";
 */
// import AudioMode from "./AudioMode";

const ChooseStack = () => {
  const dispatch = useDispatch();
  //HERE when true (default) - we show the remainign words - not known
  const showRemainingWords2 = useSelector(
    (state) => state.flashcardSlice.showRemainingWords2
  );
  const [switchchecked, setSwitchChecked] = useState(true);

  /* const [fluentshow, setFluentShow] = useState(false);
  const [familiarshow, setFamiliarShow] = useState(false);
  const [uncertainshow, setUncertainShow] = useState(false);
  const [newshow, setNewShow] = useState(false); */

  // DUNNO DELETE UNUSED
  //const knownfilteredwords = useSelector(
  //  (state) => state.flashcardSlice.knownfilteredwords
  // );
  //const allwords = useSelector((state) => state.flashcardSlice.allwords);

  //ALL KNOWN WORDS WE LOADED IN INITIAL FETCH - in  redux
  const allknownwordsdata = useSelector(
    (state) => state.flashcardSlice.allknownwordsdata
  );
  //ALL REMAINING WORDS WE LOADED IN INITIAL FETCH - in  redux
  const allremainingwordsdata = useSelector(
    (state) => state.flashcardSlice.allremainingwordsdata
  );

  //ARRAYS FOR EACH DIFFICULTY LEVEL - MOVE TO MAIN PAGE IDEALLY TO MAKE
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

  //let getthis = getFlashcardsRemaining();

  let totalcombinedArray = [];
  let allbutfluentArray = [];



  const changeWordList = async (whichwordlist) => {
    let data;
    if (whichwordlist === "remaining") {
      if (allremainingwordsdata.length === 0) {
        let mockcurrentword =
        {
          '_id': 1,
        }

        dispatch(setCurrentWord(mockcurrentword));
        let fakeallwordsarray = []
        dispatch(setAllWords2(fakeallwordsarray));
      }

      else {
        dispatch(setAllWords2(allremainingwordsdata));
        dispatch(setCurrentWord(allremainingwordsdata[0]));
      }

      //to make sure show German
      dispatch(setOriginal(true));
      dispatch(setShowRemainingWords2(true));
      if (!switchchecked) {
        setSwitchChecked(true);
        dispatch(setswitchbuttondeen(true));
      }
    } else if (whichwordlist === "known") {
      //set allknownwrods to only familiar, uncertain and new words -
      //make a new array excluding the fluent words
      let newarrayNOfluent = allknownwordsdata.filter(
        (word) => word.difficulty !== "Fluent"
      );
      console.log("newarrayNOfluen55555t", newarrayNOfluent);
      dispatch(setAllWords2(newarrayNOfluent));

      let nofluentArray = ["Familiar", "Uncertain", "New"];

      //ALSO SET THE ARRAY OF DIFFICULTY LEVELS TO not fluent
      dispatch(setdifficultylevels(nofluentArray));

      // THIS IS FOR SHOWING ALL THE KNOWN WORDS,
      //but im gonna change it to not include fluent words
      // dispatch(setAllWords2(allknownwordsdata));
      dispatch(setCurrentWord(newarrayNOfluent[0]));
      dispatch(setOriginal(true));
      dispatch(setShowRemainingWords2(false));
    }
  };

  const handleSwitchChange = (event) => {
    setSwitchChecked(event.target.checked);
    dispatch(setswitchbuttondeen(event.target.checked));

    console.log("Switch is toggled:", event.target.checked);
  };
  return (
    <>
      <div className="chooseWordStackInner">
        <button
          className={`cursor-pointer button  ${showRemainingWords2 ? "button-outline button-narrow button-gray" : "button-primary button-narrow button-gray button-gray-filled "}`}

          onClick={() => {
            if (allknownwordsdata.length > 0) {
              changeWordList("known")
            }
          }}
        >
          Covered ({allknownwordsdata.length})
        </button>
        <button
          className={` cursor-pointer  ml-3 button ${!showRemainingWords2 ? "button-outline button-narrow button-gray" : "button-primary button-narrow button-gray button-gray-filled "}`}

          onClick={() => changeWordList("remaining")}
        >
          Remaining ({allremainingwordsdata.length})
        </button>
        {/*  <div className="playpause">
          <AudioMode />
        </div> */}
        {!showRemainingWords2 && (
          <div className="form-check form-switch switchgrid">
            <div>

            </div>
            {/*  <div>
              <input
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckChecked"
                onChange={handleSwitchChange}
                checked={switchchecked}
              />
            </div>
            <div className="standardreverse">
              <label
                className="form-check-label customswitchlabel"
                htmlFor="flexSwitchCheckChecked"
              >
                {switchchecked ? "Standard" : "Reverse"}
              </label>
            </div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default ChooseStack;
//    setCurrentWord(data[0]);

/*   setFluentShow(false);
     setFamiliarShow(true);
     setUncertainShow(true);
     setNewShow(true); */

//  data = await getFlashcardsKnownWords();
// if (data || data.length === 0) {
//  dispatch(setallknownwordsdata(data));
// console.log(data, "dataINCHOOSESTACK");

/*  data = await getFlashcardsRemaining();
      if (data || data.length === 0) {
        console.log(data, "dataINCHOOSESTACK1212");

        dispatch(setallremainingwordsdata(data));
      }

      dispatch(setAllWords(data));
      console.log(data, "data");
      let showallwords4 = whichwordlist === "known" ? false : true;
      dispatch(setShowAllWords3(showallwords4));
      // setShowAllWords3(showallwords4);


    //    setCurrentWord(data[0]);
    /*  TOTAL RUBBISH DELETE
      setFluentShow(false);
       setFamiliarShow(true);
       setUncertainShow(true);
       setNewShow(true); */

//      url = `http://localhost:3001/api/flashcardknownwords/`;

//HERE WE PUT ALL THE WORDS BUT WE SHOULDNT

/* let newArrayforKnownWords = [];

  allbutfluentArray.push(...familiarWORDS);
  allbutfluentArray.push(...uncertainWORDS);
  allbutfluentArray.push(...newwords);
  //allbutfluentArray.push(familiarWORDS);
  //allbutfluentArray.push(uncertainWORDS);
  //allbutfluentArray.push(newwords);

  console.log(allbutfluentArray, "allbutfluentArray1111");

  let showallwords4 = whichwordlist === "known" ? false : true;
  dispatch(setShowAllWords3(showallwords4));
  // setShowAllWords3(showallwords4);
 */
// setAllWords(data);

//  url = `http://localhost:3001/api/flashcardremaining/`;

//const res = await fetch(url);

//console.log(res, "resj");
// const data = await res.json();

//   setOriginal(true);

//return data;

/*
  useEffect(() => {
    if (!showallwords) {
      //FIRST WE CREATE THE ARRAYS FOR LATER
      let fluentWORDS = allwords.filter((word) => word.difficulty === "Fluent");
      let familiarWORDS = allwords.filter(
        (word) => word.difficulty === "Familiar"
      );
      let uncertainWORDS = allwords.filter(
        (word) => word.difficulty === "Uncertain"
      );
      let newwords = allwords.filter((word) => word.difficulty === "New");

      console.log("ALLWORDS CHANGED - LETTO KNOWN WORDS");
      console.log(fluentWORDS, "fluentwords");
      console.log(familiarWORDS, "familiarwords");
      console.log(uncertainWORDS, "uncertainwords");
      console.log(newwords, "newwords");

      /*   let newArrayforKnownWords = [];
      if (fluentshow) {
        let fluentWORDS = allwords.filter(
          (word) => word.difficulty === "Fluent"
        );
        console.log(fluentWORDS, "fluentwords");
        newArrayforKnownWords.push(fluentWORDS);
        // dispatch(setAllWords(fluentWORDS));
      } else if (!fluentshow) {
        let fluentWORDS = allwords.filter(
          (word) => word.difficulty !== "Fluent"
        );
        console.log(fluentWORDS, "fluentwords");
        newArrayforKnownWords.push(fluentWORDS);
      }
      if (familiarshow) {
        let familiarWORDS = allwords.filter(
          (word) => word.difficulty === "Familiar"
        );
        console.log(familiarWORDS, "familiarwords");
        newArrayforKnownWords.push(familiarWORDS);
      } else if (!familiarshow) {
        let familiarWORDS = allwords.filter(
          (word) => word.difficulty !== "Familiar"
        );
        console.log(familiarWORDS, "familiarwords");
        newArrayforKnownWords.push(familiarWORDS);
      }
      if (uncertainshow) {
        let uncertainWORDS = allwords.filter(
          (word) => word.difficulty === "Uncertain"
        );
        console.log(uncertainWORDS, "uncertainwords");
        newArrayforKnownWords.push(uncertainWORDS);
      } else if (!uncertainshow) {
        let uncertainWORDS = allwords.filter(
          (word) => word.difficulty !== "Uncertain"
        );
        console.log(uncertainWORDS, "uncertainwords");
        newArrayforKnownWords.push(uncertainWORDS);
      }
      if (newshow) {
        let newwords = allwords.filter((word) => word.difficulty === "New");
        console.log(newwords, "newwords");
        newArrayforKnownWords.push(newwords);
      } else if (!newshow) {
        let newwords = allwords.filter((word) => word.difficulty !== "New");
        console.log(newwords, "newwords");
        newArrayforKnownWords.push(newwords);
      }
      console.log(newArrayforKnownWords, "newArrayforKnownWords");
      dispatch(setAllWords(newArrayforKnownWords)); */
