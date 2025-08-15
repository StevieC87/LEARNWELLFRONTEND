"use client";
import { useDispatch, useSelector } from "react-redux";
import { setOriginal, setCurrentWord } from "@/redux/slices/flashcardSlice";
import { useEffect, useState } from "react";
import Extrafields from "./Extrafields";
import { usePathname } from "next/navigation";


const ActualFlashcard = (props) => {
  const dispatch = useDispatch();

  const pathname = usePathname();

  const slug = pathname.split("/").pop();
  //console.log(slug, "slugsss");
  const { wordnostart, wordnoend } = props;
  // alert(wordnostart);
  // console.log(wordnostart, "wordnostart");

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
    (state) => state.flashcardSlice.totalwordsremaining
  );
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

  const [remainingwordsNotempty, setRemainingWordsNotEmpty] = useState();
  const [knownwordsNotempty, setKnownWordsNotEmpty] = useState();

  const allwords = useSelector((state) => state.flashcardSlice.allwords);

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
  }, [totalwordsknown, totalwordsremaining]);

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



  const fetchmp3 = async (exampleid) => {
    // let fetchurl = `http://localhost:3001/api/fetchmp3/${exampleid}?wordnostart=${slug}&wordorexample=example`;
    let fetchurl = `http://localhost:3001/api/fetchmp3/${exampleid}?wordorexample=example`;
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
        <div>
          Well done, you have covered all the words in this stack, switch to
          'Covered' to practice the words
        </div>
      );
    } else {
      return <div>no words to show</div>;
    }
  };
  return (
    <>
      <div
        className={`skeletoncenterinner ${showOriginal ? "" : "skeletoncenterinnerINV"
          }`}
        onClick={(e) => {
          if (
            e.target.closest(".flashcardmultiple") ||
            e.target.closest(".flashcard123") ||
            disablediffbuttons
          ) {
            e.stopPropagation();
          } else {
            fliptoEnglish();
          }
        }}
      /* onClick={() => fliptoEnglish()} */
      >
        {isloading ? (
          <img src="/gifs/spinner.gif" alt="loading" />
        ) : allwords.length !== 0 ? (
          showOriginal ? (
            <div className="flashcard123">
              {currentword?.word && (
                <>
                  <div className="semibold wordde">
                    {switchbuttondeen ? (
                      <>
                        <span>{currentword.word}</span>

                        {currentword.Meaning?.Noun?.Gender && (
                          <span className="fontweightregular">  ({currentword.Meaning.Noun.Gender})</span>
                        )}
                      </>
                    ) : (
                      <span> {currentword.Meaning.Meaning}</span>

                    )}
                  </div>
                  <div className="sentencesdiv">
                    {currentword?.Meaning?.CommonFields?.Examples?.map(
                      (example, index) => (
                        <div key={index} className="examplediv">
                          <div>
                            {switchbuttondeen ? (
                              <>
                                <span>{example.ExampleSentenceDE}</span>
                              </>
                            ) : (
                              <span> {example.ExampleSentenceEN}</span>
                            )}
                          </div>
                          <div>
                            {example.id && currentword.audiomp3 && (
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => fetchmp3(example.id)}
                              >
                                <i className="bi bi-volume-up"></i>
                              </button>
                            )}
                          </div>

                          {/*   <div className="example">{example.ExampleSentenceDE}</div> */}
                          {/* {highlightWord(example.ExampleSentenceDE, currentword.Meaning.BaseForm)} */}
                          {/*   <div className="translation">{example.ExampleSentenceEN}</div> */}
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flashcardmultiple">
              <div className="fmultipleOrgWord">
                <div className="splitbacktopmeaningEN">
                  <div className="semibold wordde">
                    {switchbuttondeen ? (
                      <span> {currentword.Meaning.Meaning}</span>
                    ) : (
                      <>
                        <span>{currentword.word}</span>
                        <span className="">
                          - {currentword.Meaning.Meaning}
                        </span>
                      </>
                    )}{" "}
                    { }
                  </div>
                  {/* <div> {currentword.Meaning.BaseForm}</div> */}
                </div>
                <div className="wrapperborderdotted">
                  <div className="exampleparentdiv">
                    {currentword?.Meaning?.CommonFields?.Examples?.map(
                      (example, index) => (
                        <div key={index} className="exampleSentencesBack">
                          <div className="exampleSbackEN">
                            {example.ExampleSentenceEN}
                          </div>
                          <div className="fontsmall padright10">
                            {example.ExampleSentenceDE}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <Extrafields
                    currentword={currentword}
                    othermeanings={othermeaningsArray}
                  />
                </div>
              </div>
            </div>
          )
        ) : (
          <div>{ifnowords()}</div>
          /*  <div>no words to show</div> */
        )}
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

