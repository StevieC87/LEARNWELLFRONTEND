"use client";
import { useDispatch, useSelector } from "react-redux";
import { setOriginal, setCurrentWord } from "@/redux/slices/flashcardSlice";
import { useEffect, useState } from "react";
import Extrafields from "./Extrafields";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { setShowMoreBackCard } from "@/redux/slices/flashcardSlice";


const ActualFlashcard = (props) => {
  const dispatch = useDispatch();

  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  console.log(slug, 'slug');
  const { wordnostart, wordnoend } = props;
  const currentword = useSelector((state) => state.flashcardSlice.currentword);
  //show original language (German) - true by default
  const showOriginal = useSelector(
    (state) => state.flashcardSlice.showOriginal
  );
  //----------------------------------------------------
  //to show errors
  const errorNoWords = useSelector(
    (state) => state.flashcardSlice.errorNoWords
  );
  const isloading = useSelector((state) => state.flashcardSlice.isloading);
  const totalwordsknown = useSelector(
    (state) => state.flashcardSlice.totalwordsknown
  );
  const totalwordsremaining = useSelector(
    (state) => state.flashcardSlice.totalwordsremaining);
  const allremainingwordsdata = useSelector(
    (state) => state.flashcardSlice.allremainingwordsdata
  );
  const allknownwordsdata = useSelector(
    (state) => state.flashcardSlice.allknownwordsdata
  );
  const switchbuttondeen = useSelector(
    (state) => state.flashcardSlice.switchbuttondeen
  );
  const disablediffbuttons = useSelector(
    (state) => state.flashcardSlice.disablediffbuttons
  );
  const showRemainingWords2 = useSelector(
    (state) => state.flashcardSlice.showRemainingWords2
  );
  const [remainingwordsNotempty, setRemainingWordsNotEmpty] = useState();
  const [knownwordsNotempty, setKnownWordsNotEmpty] = useState();

  const allwords = useSelector((state) => state.flashcardSlice.allwords);
  const showmorebackcard = useSelector(
    (state) => state.flashcardSlice.showmorebackcard
  );

  const userwordsperlesson = useSelector(
    (state) => state.flashcardSlice.userwordsperlesson
  );


  // ----------------------------------------------------

  //TOGGLE SHOW MORE BACK OF CARD
  //----------------------------------------------------
  const difficultybuttonclicked = useSelector((state) => state.flashcardSlice.difficultybuttonclicked);
  useEffect(() => {
    if (totalwordsknown) {
      setRemainingWordsNotEmpty(true);
    } else {
      setRemainingWordsNotEmpty(false);
    }
    if (totalwordsremaining) {
      setKnownWordsNotEmpty(true);
    } else {
      setKnownWordsNotEmpty(false);
    }
    if (difficultybuttonclicked && totalwordsremaining === 0) {
      async function savelessoncompleted(lessonid) {
        let fetchurl = `${process.env.NEXT_PUBLIC_API_URL}/api/savelessoncompleted`;
        const response = await fetch(fetchurl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lessonid: lessonid, wordsperlesson: userwordsperlesson }),
          credentials: "include"
        });
        const data = await response.json();
        console.log(data, "data from savelessoncompleted");
        return data;
      };
      let savelessonascompleted = savelessoncompleted(slug);
      //mark lesson as done - SAVE TO DB
    }
  }, [totalwordsknown, totalwordsremaining, userwordsperlesson, difficultybuttonclicked]);

  //----------------------------------------------------
  const fliptoEnglish = () => {
    if (showOriginal) {
      dispatch(setOriginal(false));
      setExpandedIndex(true);
      // setOriginal(false);
    } else {
      dispatch(setOriginal(true));
      setExpandedIndex(false);
      /// setOriginal(true);
    }
  };

  // KEYBOARD EVENTS
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === " " || event.key === "Space") {
        fliptoEnglish()
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fliptoEnglish]);


  //----------------------------------------------------

  const [expandedIndex, setExpandedIndex] = useState(false);
  const expandMeaning = (index) => {
    // alert(meaning)  };
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  // ----------------------------------------------------
  const [baseformbase, setBaseformbase] = useState();
  const [baseformsArray, setBaseformsArray] = useState([]);

  // ----------------------------------------------------

  const [othermeaningsArray, setOtherMeaningsArray] = useState([]);


  //THIS IS FOR DISPLAYUING THE BASE FORM IF IT'S DIFFERENT like sie Sie
  useEffect(() => {
    if (currentword) {
      //console.log("currentword444444:", currentword);
      //HERE SEE IF THE WORD HAS OTHER MEANINGS
      // console.log(currentword.word, '787878'); // Logs "fahren"
      // allwords.forEach((word) => console.log(word.word, '8787878')); // Logs all words in allwords
      let filterallwordsFORSAMEmeanings = allwords.filter(
        (word) => word.word === currentword.word
      );
      // console.log(
      // "filterallwordsFORSAMEmeanings:",
      //  filterallwordsFORSAMEmeanings
      // );
      if (filterallwordsFORSAMEmeanings.length > 1) {
        // console.log("8888888888888888:", filterallwordsFORSAMEmeanings);
        // alert('more than one word with the same meaning');
        let currentmeaning = currentword?.Meaning?.Meaning;
        // console.log("firstmeaningwesfdsd", `@${currentmeaning}@`);
        // console.log(
        //  `@${filterallwordsFORSAMEmeanings[0].Meaning.Meaning}@`,
        //  "sssssss"
        // );
        let filteredmeanings = filterallwordsFORSAMEmeanings.filter(
          (word) => word.Meaning.Meaning !== currentmeaning
        );
        setOtherMeaningsArray(filteredmeanings);
      }
      //if hthe base form of one word is different from the others, then add it to the word shown maybe e.g. sie Sie (coz Sie is plural)
      //instead of showing the baseform every time
      let baseforms = [];
      //let baseform = currentword?.word;
      let currentwordforbaseForms = currentword?.Meanings?.map(
        (meaning) => meaning.BaseForm
      );

    }
  }, [currentword]);


  //FETCH MP3
  //wordorexample = word or example
  //EXAMPLE SENTENCE MP3
  //IF WE HAVE AN ID FOR THE EXAMPLE AND THE WORD HAS mp3 AUDIO
  //WE CAN FETCH IT
  //WE FETCH IT FROM THE BACKEND - WHICH FETCHES IT FROM THE FOLDER WHERE WE STORE IT
  //WE THEN CREATE A BLOB AND A URL AND PLAY IT
  //WE DO THIS IN THE COMPONENT WHERE WE DISPLAY THE EXAMPLE SENTENCES
  //WE PASS THE EXAMPLE

  const fetchmp3 = async (exampleid) => {
    let fetchurl = `${process.env.NEXT_PUBLIC_API_URL}/api/fetchmp3/${exampleid}?wordorexample=example`;
    const response = await fetch(fetchurl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  };
  const ifnowords = () => {
    console.log("allremainingwordsdata444:", allremainingwordsdata);
    console.log("allknownwordsdata444:", allknownwordsdata);
    if (allremainingwordsdata.length == 0 && allknownwordsdata.length === 0) {
      return <div>No words</div>;
    } else if (
      allremainingwordsdata.length === 0 &&
      allknownwordsdata.length !== 0
    ) {
      return (
        <div className="pt-20">
          Flashcard lesson complete! Take the
          <Link href={`../quiz1/${slug}`}>first quiz</Link>   to strengthen your memory!
        </div>
      );
    } else {
      return <div>no words to show</div>;
    }
  };
  const matchdifficultytocorrectword = (difficulty) => {
    console.log(difficulty, 'difficulty2332');
    if (difficulty === 'New') {
      console.log('jello');
      return <div className="bottomdiff new"></div> //Didn't Know
    }
    else if (difficulty === 'Uncertain') {
      return <div className="bottomdiff uncertain"> </div> //Unsure
    }
    else if (difficulty === 'Familiar') {
      return <div className="bottomdiff familiar"></div> //Knew it
    }
    else if (difficulty === 'Fluent') {
      return <div className="bottomdiff fluent" ></div> //Never Show Again
    }
    else {
      return "Unknown Difficulty";
    }
  }
  return (
    <>
      <div
        className={`skeletoncenterinner ${showOriginal ? "" : "skeletoncenterinnerINV"
          }`}
        onClick={(e) => {
          if (
            // e.target.closest(".flashcardmultiple") ||
            // e.target.closest(".flashcard123") ||
            // disablediffbuttons
            e.target.closest(".bi")
            || e.target.closest("span") ||
            e.target.closest("p") || e.target.closest(".showmorecard")
          ) {
            e.stopPropagation();
          } else {
            fliptoEnglish();
          }
        }}
      >
        {/*   {isloading ? (
          <img src="/gifs/spinner.gif" alt="loading" />
        ) : allwords.length !== 0 ? ( */}

        <div className="flex flex-col justify-between h-full">
          <div className="flashcardnk123">
            {(allremainingwordsdata.length === 0 && allknownwordsdata.length !== 0 && showRemainingWords2) && (
              ifnowords()
            )}

            {/*    <Link href={`/card?id=${currentword._id}`}>Editcard</Link> */}
            {((allremainingwordsdata.length > 0 && showRemainingWords2) || (allknownwordsdata.length > 0 && !showRemainingWords2) && currentword?.word) && (
              <>
                <div className=" wordde">
                  {showOriginal ? (
                    <span className="semibold">{currentword.word}</span>
                  ) : (
                    <>
                      <p className="semibold wordde"> {currentword?.Meaning?.Meaning}</p>
                      {currentword?.Meaning?.Noun?.Gender && (
                        <span className="fontweightregular">  ({currentword?.Meaning?.Noun?.Gender})</span>


                      )}
                      <div className="fontmedium mb-4">
                        {/*   <span className="semibold">Explanation:</span> */}
                        <span>{currentword?.Meaning?.Explanation}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="sentencesdiv ">
                  {currentword?.Meaning?.CommonFields?.Examples?.map(
                    (example, index) => (
                      <div key={index} className="examplediv">

                        {showOriginal ? (
                          <>
                            <div className="flex flex-row items-center gap-4 justify-between w-full">
                              <span>{example.ExampleSentenceDE}</span>


                              {example.id && currentword.audiomp3 && (
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => fetchmp3(example.id)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-volume-up" viewBox="0 0 16 16">
                                    <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z" />
                                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z" />
                                    <path d="M10.025 8a4.5 4.5 0 0 1-1.318 3.182L8 10.475A3.5 3.5 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.5 4.5 0 0 1 10.025 8M7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11" />
                                  </svg>
                                </button>
                              )}
                            </div>

                          </>
                        ) : (
                          <>
                            <div className="flex flex-col justify-between w-full">
                              <span>{example.ExampleSentenceEN}</span>
                              <span className="examplegermanenglishside"> {example.ExampleSentenceDE}</span>
                            </div>
                          </>
                        )}

                        <div>

                        </div>
                      </div>
                    )
                  )}
                </div>
                {/* here to show the difficulty level if showing covered and oriignal */}

              </>
            )}
          </div>

          {!showOriginal && (
            <div className="grid place-items-center">
              <button className="mt-10 mb-10 showmorecard button button-primary button-outline button-narrow button-gray"
                onClick={() => {
                  dispatch(setShowMoreBackCard(!showmorebackcard));
                }
                }>{showmorebackcard ? "Hide More" : "Show More"}
              </button>
            </div>
          )}

          {(showmorebackcard && !showOriginal) && (
            <Extrafields
              currentword={currentword}
              othermeanings={othermeaningsArray}
            />
          )}
          {!showRemainingWords2 && (
            <>
              <div className="mt-4 ">
                {/* <span>Difficulty: </span> */}
                <span className="fontbold">
                  {currentword?.difficulty ? matchdifficultytocorrectword(currentword?.difficulty) : "Not set"}
                </span>
              </div>

            </>
          )}
        </div>
      </div>


    </>
  );
};

export default ActualFlashcard;

// console.log("totalwordsknown333333:", totalwordsknown); // Check the value
/* const highlightWord = (sentence, word) => {
  const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Match whole word, case-insensitive
  return sentence.split(regex).reduce((prev, current, i) => {
    if (!i) return [current];
    return prev.concat(<strong key={i}>{word}</strong>, current);
  }, []);
}; */

//THIS FOR HIGHLIGHT WORD - SKIPPED FOR NOW
//const highlightWord = (sentence, word) => {
// const regex = new RegExp(`\\b(${word})\\b`, 'gi'); // Match whole word, case-insensitive
//  const parts = sentence.split(regex);
//  return parts.map((part, index) =>
//    regex.test(part) ? <strong key={index}>{part}</strong> : part
// );

