"use client";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWord, setOriginal, setrandom, setallremainingwordsdata, setAllWords2, setallknownwordsdata, setpauseonnextprev } from "@/redux/slices/flashcardSlice";
// import AIQandA from "./AIQandA";
import Link from 'next/link';
import { useEffect } from "react";
import "./bottombar.css";

const BottomBar = () => {

  const dispatch = useDispatch();
  const currentword = useSelector((state) => state.flashcardSlice.currentword);
  const allwords = useSelector((state) => state.flashcardSlice.allwords);
  const random = useSelector((state) => state.flashcardSlice.random);
  let currentindex = allwords.indexOf(currentword);
  const showRemainingWords2 = useSelector((state) => state.flashcardSlice.showRemainingWords2);
  const allremainingwordsdata = useSelector((state) => state.flashcardSlice.allremainingwordsdata);
  const allknownwordsdata = useSelector((state) => state.flashcardSlice.allknownwordsdata);

  const handleChangeWord = (direction) => {

    let currentindex = allwords.indexOf(currentword);
    dispatch(setpauseonnextprev(true))

    if (direction === "next") {

      if (currentindex === allwords.length - 1) {
        dispatch(setCurrentWord(allwords[0]));
      } else {
        dispatch(setCurrentWord(allwords[currentindex + 1]));
      }

    } else if (direction === "prev") {

      if (currentindex === 0) {
        dispatch(setCurrentWord(allwords[allwords.length - 1]));
      } else {
        dispatch(setCurrentWord(allwords[currentindex - 1]));
      }

    }
    dispatch(setOriginal(true));
  };
  const handleRandomize = () => {
    if (!random) {
      let sortedarray = allwords.slice().sort((a, b) => a.sortnumber - b.sortnumber);
      dispatch(setAllWords2(sortedarray));

    }

    if (random) {
      let randomisedArray = allwords.slice().sort(() => Math.random() - 0.5);
      dispatch(setAllWords2(randomisedArray));

    };
    dispatch(setrandom(!random));
  }
  //DEPENDS IF REMAINING WORDS OR KNOWN WORDS

  // console.log(randomisedArray, "randomisedArrayaaaaaa");

  //dispatch(setallremainingwordsdata(randomisedArray));
  //dispatch(setAllWords2(randomisedArray));




  const myParam = "Hello, World!123";

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handleChangeWord("next");
      } else if (event.key === "ArrowLeft") {
        handleChangeWord("prev");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentword, allwords]);

  return (
    <div className="bottomBarbottom ">
      <button
        className="btn mybtn prevnext"
        onClick={() => handleChangeWord("prev")}
      >
        Prev
      </button>
      <button
        className="btn mybtn prevnext prevnextnext"
        onClick={() => handleChangeWord("next")}
      >
        Next
      </button>
      {/*  <div>
        <button className="btn mybtn prevnext" onClick={() => handleRandomize()}>
          <i className={`bi bi-shuffle ${random ? '' : 'gray'}`}></i>
        </button>
      </div> */}
      <div>
        {/*   {!showRemainingWords2 && (
          <Link href="/reinforce" className="reinforce"  >
            Reinforce Word
          </Link>
        )} */}
      </div>
      {/* <AIQandA /> */}
    </div>
  );
};

export default BottomBar;
