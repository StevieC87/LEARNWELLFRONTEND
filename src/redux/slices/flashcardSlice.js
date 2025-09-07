import { createSlice } from "@reduxjs/toolkit";
import { set } from "react-hook-form";

/* 
  
 //THIS IS WHETHER TO SHOW known or remaining words
  const [showallwords, setShowAllWords] = useState(true);

  const [wordsaved, setWordSaved] = useState(false);

  //FOR DARK MODE THEME - WHEN BROWSER DETECTS - CHANGE BODY CLASS
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [difficultylevelSELECTED, setDifficultyLevels] = useState([]);
  const [showallwords3, setShowAllWords3] = useState(true);
   */
const flashcardSlice = createSlice({
  name: "FlashcardSlice",
  initialState: {
    isloading: true,
    allwords: [],
    currentword: {},
    showOriginal: true,
    showTranslation: false,
    showRemainingWords2: true,
    wordsaved: false,
    isDarkMode: false,
    difficultylevels: [],
    showallwords3: true,
    knownfilteredwords: [],
    fluentWORDSArray: [],
    familiarWORDSArray: [],
    uncertainWORDSArray: [],
    newwordsArray: [],
    errorNoWords: true,
    allremainingwordsdata: [],
    allknownwordsdata: [],
    totalwordsknown: 0,
    totalwordsremaining: 0,
    switchbuttondeen: true,
    disablediffbuttons: false,
    random: false,
    originalarrayorder: [],
    examples: [],
    pauseonnextprev: false,
    showmorebackcard: false,
    userwordsperlesson: '',
    difficultybuttonclicked: false,
    activetab: 'flashcard'
  },

  reducers: {
    sethello: (state, action) => {
      state.hello = action.payload;
    },
    setCurrentWord: (state, action) => {
      state.currentword = action.payload;
    },
    setOriginal: (state, action) => {
      state.showOriginal = action.payload;
    },
    setWordSaved: (state, action) => {
      state.wordsaved = action.payload;
    },
    setdifficultylevels: (state, action) => {
      state.difficultylevels = action.payload;
    },
    setShowAllWords: (state, action) => {
      state.showallwords = action.payload;
    },
    setAllWords2: (state, action) => {
      state.allwords = action.payload;
    },

    setShowAllWords3: (state, action) => {
      state.showallwords3 = action.payload;
    },
    setKnownFilteredWords: (state, action) => {
      state.knownfilteredwords = action.payload;
    },

    setfluentWORDSArray: (state, action) => {
      state.fluentWORDSArray = action.payload;
    },
    setfamiliarWORDSArray: (state, action) => {
      state.familiarWORDSArray = action.payload;
    },
    setuncertainWORDSArray: (state, action) => {
      state.uncertainWORDSArray = action.payload;
    },
    setnewwordsArray: (state, action) => {
      state.newwordsArray = action.payload;
    },
    seterrorNoWords: (state, action) => {
      state.errorNoWords = action.payload;
    },
    setisloading: (state, action) => {
      state.isloading = action.payload;
    },

    setallremainingwordsdata: (state, action) => {
      state.allremainingwordsdata = action.payload;
    },
    setallknownwordsdata: (state, action) => {
      state.allknownwordsdata = action.payload;
    },
    setShowRemainingWords2: (state, action) => {
      state.showRemainingWords2 = action.payload;
    },
    setTotalWordsKnown: (state, action) => {
      state.totalwordsknown = action.payload;
    },
    setTotalWordsRemaining: (state, action) => {
      state.totalwordsremaining = action.payload;
    },
    setswitchbuttondeen: (state, action) => {
      state.switchbuttondeen = action.payload;
    },
    setdisablediffbuttons: (state, action) => {
      state.disablediffbuttons = action.payload;
    },
    setrandom: (state, action) => {
      state.random = action.payload;
    },
    setoriginalarrayorder: (state, action) => {
      state.originalarrayorder = action.payload;
    },
    setexamples: (state, action) => {
      state.examples = action.payload;
    },
    setpauseonnextprev: (state, action) => {
      state.pauseonnextprev = action.payload;
    },
    setShowMoreBackCard: (state, action) => {
      state.showmorebackcard = action.payload;
    },
    setuserwordsperlesson: (state, action) => {
      state.userwordsperlesson = action.payload;
    },
    setdifficultybuttonclicked: (state, action) => {
      state.difficultybuttonclicked = action.payload;
    },
    setactivetab: (state, action) => {
      state.activetab = action.payload;
    }
  },
});

export const {
  sethello,
  setAllWords2,
  setCurrentWord,
  setOriginal,
  setWordSaved,
  setdifficultylevels,
  setShowAllWords3,
  setKnownFilteredWords,
  setfluentWORDSArray,
  setfamiliarWORDSArray,
  setuncertainWORDSArray,
  setnewwordsArray,
  seterrorNoWords,
  setisloading,
  setnumberoffluentwords,
  setnumberoffamiliarwords,
  setnumberofuncertainwords,
  setnumberofnewwords,
  setallremainingwordsdata,
  setallknownwordsdata,
  setShowRemainingWords2,
  setTotalWordsKnown,
  setTotalWordsRemaining,
  setswitchbuttondeen,
  setdisablediffbuttons,
  setrandom,
  setoriginalarrayorder,
  setexamples,
  setpauseonnextprev,
  setShowMoreBackCard,
  setuserwordsperlesson,
  setdifficultybuttonclicked,
  setactivetab
} = flashcardSlice.actions;

export default flashcardSlice.reducer;
