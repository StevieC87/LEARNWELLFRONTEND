"use client";
import { useDispatch, useSelector } from "react-redux";
import { use, useEffect, useState } from "react";
//import { usePathname } from "next/navigation";
// import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import { setCurrentWord, setOriginal, setexamples, setpauseonnextprev } from "@/redux/slices/flashcardSlice";
import { useRef } from 'react';


export default function AudioMode() {
  //const pathname = usePathname();
  const recognitionRef = useRef(null);


  const { id } = useParams();  // Get the dynamic route parameter 'id'
  let slug = id;
  //console.log(id, "slugsss");
  //const slug = pathname.split("/").pop();
  // console.log(slug, "slugsss");

  //const [playYes, setPlayYes] = useState(false);
  let playYesv = false
  const [playingword, setPlayingWord] = useState(false);
  const [playingExample, setPlayingExample] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const currentword = useSelector((state) => state.flashcardSlice.currentword);
  let currentwordid = currentword?._id;
  //console.log(currentwordid, 'currentwordid111111111111');
  const dispatch = useDispatch();
  const allwords = useSelector((state) => state.flashcardSlice.allwords);
  const examples = useSelector((state) => state.flashcardSlice.examples);
  const showOriginal = useSelector((state) => state.flashcardSlice.showOriginal);
  //const example1DEid = currentword?.Meaning?.CommonFields?.///Examples[0]?.id;
  //const example2DEid = currentword?.Meaning?.CommonFields?.//Examples[1]?.id;
  //const example3DEid = currentword?.Meaning?.CommonFields?.//Examples[2]?.id;
  const [exampleIDarray, setExampleIDarray] = useState([]);
  let currentindex = allwords.indexOf(currentword);
  let previousindex = [];
  let currentpreviousindex = previousindex.push(currentindex);
  const pauseonnextprev = useSelector((state) => state.flashcardSlice.pauseonnextprev);
  //const[newexamples1, setNewexamples1] = useState([]);
  //    

  //console.log(typeof window, 'typeof window');
  if (typeof window == 'object') {
    //! SPEECH RECOGNITION STUFF
  }

  // }

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {

  // Define grammar

  // }
  //}, [])

  /* useEffect(() => {
    if (pauseonnextprev) {
      alert('pauseonnextprev');
      onClickPAUSEHandler();
    }
    dispatch(setpauseonnextprev(false));

  }, [pauseonnextprev]); */

  useEffect(() => {
    if (pauseonnextprev) {
      //alert('pauseonnextprev');
      onClickPAUSEHandler();
    }
    dispatch(setpauseonnextprev(false));

    if (currentword) {


      console.log('useeffect new word examples set_')
      dispatch(setexamples(currentword?.Meaning?.CommonFields?.Examples));

      //setExampleIDarray([...currentword?.Meaning?.CommonFields?.Examples]);
      //  }

    }
  }, [currentword._id, examples, pauseonnextprev]);



  useEffect(() => {
    if (playingword) {
      console.log('useffect newword');
      //alert('playingword');
      onClickPLAYHandler(examples);

      //   }
    }
    // console.log(examples, 'examples123');

  }, [examples]);



  /* useEffect(() => {
    if (exampleIDarray.length > 0) {
      console.log(exampleIDarray, 'exampleIDarray2');
    }
  }, [exampleIDarray]); */
  /* 
  let example1DE = currentword.Meaning.CommonFields.Examples[0].ExampleSentenceDE;
  let example2DE = currentword.Meaning.CommonFields.Examples[1].ExampleSentenceDE;
  let example3DE = currentword.Meaning.CommonFields.Examples[2].ExampleSentenceDE;
 */

  //FIRST WE FETCH MP3 OF WORD
  //THEN WE FETCH MP3 OF EXAMPLES
  //THEN WE GIVE TIME to the USER , 5 seconds to guess the word
  //THEN WE PLAY THE ENGLISH WORD - with word speech api (free)
  //THEN we LET USER ANSWER to SAVE THE WORD (fluent, familiar etc) 
  //THEN WE PLAY THE EXAMPLES in both english and german maybe - IF CHOOSES TO PLAY EXAMPLES - so e.g. we ask

  const fetchmp3 = async (exampleid, wordorexample) => {
    let fetchurl = `${process.env.NEXT_PUBLIC_API_URL}/api/fetchmp3/${exampleid}?wordorexample=${wordorexample}`;
    const response = await fetch(fetchurl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    if (url) {
      return url;
    }
    else {
      return null;
    }
  };
  //let example1DEAudio = 
  const fetchandPlayExamples = async (exampleid) => {
    return new Promise(async (resolve, reject) => {
      fetchmp3(exampleid, 'example').then((fetchexamplemp3audio) => {
        const audio = new Audio(fetchexamplemp3audio);

        setCurrentAudio(audio);
        audio.play();
        setPlayingExample(true);

        audio.addEventListener('ended', () => {
          setPlayingExample(false);

          resolve();
        });
      });
    });
  }

  const fetchandPlayExamples2 = async (exampleid, index) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fetchexamplemp3audio = await fetchmp3(exampleid, 'example');
        const audio = new Audio(fetchexamplemp3audio);

        setCurrentAudio(audio);

        const translateEXAMPLE = createUtterance(currentword?.Meaning?.CommonFields?.Examples[index]?.ExampleSentenceEN);
        await speakUtterance(translateEXAMPLE);

        audio.play();
        setPlayingExample(true);

        audio.addEventListener('ended', () => {
          setPlayingExample(false);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  /* let fetchmp3exampleinloop = await fetchmp3(exampleid, 'example');
  const audio2 = new Audio(fetchmp3exampleinloop);
  setCurrentAudio(audio2);
  // if (!playingExample) {
  audio2.play();
  setPlayingExample(true);

  audio2.addEventListener('ended', () => {
    return true;
    setPlayingExample(false);
    // setCurrentAudio(null);
  });
*/
  const createUtterance = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language
    utterance.pitch = 1;      // Set pitch (0 to 2)
    utterance.rate = 1;       // Set speed (0.1 to 10)
    utterance.volume = 1;     // Set volume (0 to 1)
    // Find a male voice
    const voices = window.speechSynthesis.getVoices();

    const maleVoice = voices.find(voice => voice.name.includes('Male') || voice.gender === 'male');

    // Set the male voice if found
    if (maleVoice) {
      utterance.voice = maleVoice;

    }
    else {
      if (voices.length > 20) {
        utterance.voice = voices[86];
      }
      else {
        utterance.voice = voices[3];
      }

    }
    return utterance;
  }
  const speakUtterance = (utterance) => {
    return new Promise((resolve) => {
      /*  utterance.lang = 'en-GB'; // Set language
       utterance.pitch = 1;      // Set pitch (0 to 2)
       utterance.rate = 1;       // Set speed (0.1 to 10)
       utterance.volume = 1;     // Set volume (0 to 1)
  */
      speechSynthesis.speak(utterance);
      utterance.onend = resolve;
    });
  }

  //AFTER FLIPPING CARD
  async function flipit() {
    // if (showOriginal) {
    //   alert('yes')
    dispatch(setOriginal(false));
    //  }
    console.log('flipping');

    let playword = await fetchmp3(currentwordid, 'word');
    const audio = new Audio(playword);

    setCurrentAudio(audio);
    audio.play();
    console.log('overhere1');

    // setPlayingWord(true);

    audio.addEventListener('ended', async () => {
      console.log('over here!!!')
      const means = createUtterance('means:');
      await speakUtterance(means);
      // const utterance = new SpeechSynthesisUtterance('over here');
      //speechSynthesis.speak(utterance);
      const englishword = createUtterance(currentword?.Meaning?.Meaning);
      await speakUtterance(englishword);

      const playAllExamples = async () => {
        for (let index = 0; index < examples.length; index++) {
          const exampleidDE = examples[index].id;
          let fetchexamplemp3audio = await fetchandPlayExamples2(exampleidDE, index);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        return true;
      }
      await playAllExamples();
      // setPlayYes(false);
      //
      const audio = new Audio('/mp3/repeatornext.mp3');

      setCurrentAudio(audio);
      audio.play();
      audio.addEventListener('ended', async () => {
        let SpeechRecognition;
        let SpeechGrammarList;
        let recognition;
        let SpeechRecognitionEvent;
        let speechGrammarList;
        SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
        recognition = new SpeechRecognition();
        speechGrammarList = new SpeechGrammarList();
        const phrases = ['next', 'replay', 'flip it', 'new']; // Allowed words
        const grammar = `
          #JSGF V1.0; grammar phrases;
          public <phrase> = ${phrases.join(' | ')};`; // Create grammar string

        const speechRecognitionList = new SpeechGrammarList();
        // Add grammar to the speech recogniser
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;

        // Configuration
        recognition.lang = 'en-GB'; // Set language
        recognition.interimResults = false; // Only final results
        recognition.maxAlternatives = 1; // Return the most likely result
        recognitionRef.current = recognition; // Store the recognition object in the ref

        recognition.start();
        let resultreceived1 = false;
        recognition.onresult = function (event) {
          // alert('Result received');
          resultreceived1 = true;
          const speechResult = event.results[0][0].transcript;
          console.log('Result received: ' + speechResult);
          //alert('You said: ' + speechResult);
          recognition.stop();
          if (speechResult === 'repeat' || speechResult === 'yes') {
            //  alert('repeating');
            resultreceived1 = true;
            onClickPLAYHandler()
            return;
          }
          else if (speechResult === 'next') {
            console.log('next');
            //  alert('repeating');
            resultreceived1 = true;
            if (currentindex === allwords.length - 1) {
              dispatch(setCurrentWord(allwords[0]));
            } else {
              dispatch(setCurrentWord(allwords[currentindex + 1]));
            }
          }
          else {
            console.log('else');
            resultreceived1 = false;
            if (!resultreceived1) {
              if (currentindex === allwords.length - 1) {
                dispatch(setCurrentWord(allwords[0]));
              } else {
                dispatch(setCurrentWord(allwords[currentindex + 1]));
              }
            }
          }
        };
        recognition.onspeechend = function () {
          //resultreceived1 = false;
          recognition.stop();

          console.log('Speech recognition stopped');
        };

        recognition.onnomatch = function (event) {
          console.log('No match');
          /*  resultreceived1 = false;
           if (!resultreceived1) {
             if (currentindex === allwords.length - 1) {
               dispatch(setCurrentWord(allwords[0]));
               onClickPLAYHandler()
             } else {
               if (currentindex === allwords.length - 1) {
                 dispatch(setCurrentWord(allwords[0]));
               } else {
                 dispatch(setCurrentWord(allwords[currentindex + 1]));
               }
             }
           } */
        };
        recognition.onsoundend = function (event) {
          // clearTimeout(timeout);
          console.log('Sound ended');
          // resultreceived1 = false;
          if (!resultreceived1) {
            if (currentindex === allwords.length - 1) {
              dispatch(setCurrentWord(allwords[0]));

            } else {
              dispatch(setCurrentWord(allwords[currentindex + 1]));
            }
          }


        };
        // recognit
        recognition.onerror = function (event) {
          //clearTimeout(timeout);
          resultreceived1 = false;
          console.log('Error occurred in recognition: ' + event.error);
          if (!resultreceived1) {
            if (currentindex === allwords.length - 1) {
              dispatch(setCurrentWord(allwords[0]));
            } else {
              dispatch(setCurrentWord(allwords[currentindex + 1]));
            }
          }
        }



      });
      // const utteranceexampleEN1 = createUtterance(currentword?.Meaning?.Meaning);
      // await speakUtterance(utterance1);
    });


  }
  async function onClickPLAYHandler() {
    /* if (playingword) {
      return;
    } */
    // if (!showOriginal) {
    dispatch(setOriginal(true));
    //}
    let playword = await fetchmp3(currentwordid, 'word');
    const audio = new Audio(playword);

    setCurrentAudio(audio);
    audio.play();

    setPlayingWord(true);

    audio.addEventListener('ended', async () => {
      setCurrentAudio(null);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('after 1 second');

      const playAllExamples = async () => {
        console.log(examples, 'examplesb4loop')
        for (let index = 0; index < examples.length; index++) {
          const exampleidDE = examples[index].id;

          console.log(exampleidDE, 'exampleidDE44444444444444');

          let fetchexamplemp3audio = await fetchandPlayExamples(exampleidDE);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        return true;
      }
      await playAllExamples();
      // setPlayYes(false);
      //playYesv = false;
      // setPlayingWord(false);

      const audio = new Audio('/mp3/repeat.mp3');

      setCurrentAudio(audio);
      audio.play();
      audio.addEventListener('ended', async () => {
        let SpeechRecognition;
        let SpeechGrammarList;
        let recognition;
        let SpeechRecognitionEvent;
        let speechGrammarList;
        SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
        recognition = new SpeechRecognition();
        speechGrammarList = new SpeechGrammarList();
        const phrases = ['next', 'replay', 'flip it', 'new']; // Allowed words
        const grammar = `
    #JSGF V1.0; grammar phrases;
    public <phrase> = ${phrases.join(' | ')};`; // Create grammar string

        const speechRecognitionList = new SpeechGrammarList();
        // Add grammar to the speech recogniser
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;

        // Configuration
        recognition.lang = 'en-GB'; // Set language
        recognition.interimResults = false; // Only final results
        recognition.maxAlternatives = 1; // Return the most likely result
        recognitionRef.current = recognition; // Store the recognition object in the ref

        recognition.start();
        let resultReceived = false;
        let flippedonce = false;
        /*  let timeout = setTimeout(() => {
           console.log('Speech recognition timed out.');
           recognition.stop();
           flipit();
           //alert('No input detected, flipping.');
           //flipit(); // Trigger flip after timeout
         }, 2000); // Adjust timeout as needed  */
        recognition.onresult = function (event) {
          // clearTimeout(timeout);
          resultReceived = true;

          const speechResult = event.results[0][0].transcript;
          console.log('Result received: ' + speechResult);
          //alert('You said: ' + speechResult);
          recognition.stop();
          if (speechResult === 'repeat' || speechResult === 'yes') {
            //  alert('repeating');
            resultReceived = true;
            onClickPLAYHandler()
          }
          else if (speechResult === 'no') {
            //  alert('repeating');
            resultReceived = true;
            if (!flippedonce) {
              flipit()
              flippedonce = true;
            }
          }
          else {
            resultReceived = false;
            if (!flippedonce) {
              flipit()
              flippedonce = true;
            }

          }
        };
        recognition.onspeechend = function () {
          //  clearTimeout(timeout);
          console.log('Speech recognition stopped');

          recognition.stop();

        };

        recognition.onnomatch = function (event) {
          // clearTimeout(timeout);
          console.log('No match');

        };
        recognition.onsoundend = function (event) {
          // clearTimeout(timeout);
          console.log('Sound ended');
          if (!resultReceived) {
            if (!flippedonce) {
              flipit()
              flippedonce = true;
            }

          }

        };
        // recognit
        recognition.onerror = function (event) {
          //clearTimeout(timeout);
          console.log('Error occurred in recognition: ' + event.error);
          flipit();
        }




      });




      //play sound here 
      // alert('speech recognition started');
      // 


      //setTimeout(() => {
      //  console.log("Delayed for 3 second.");
      // }, 10000);
      // alert('after 3 second')


      //then give time to user to think of answer  
      //

      // Play the next audio here if needed

      /* for (let index = 0; index < examplescount; index++) {
        const element = array[index];
   
      } */

    });
  }
  const onClickPAUSEHandler = async () => {
    // setPlayYes(false);

    const stopAudio = () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setPlayingWord(false);
      }
      speechSynthesis.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    stopAudio();


  }

  return (
    <div className="playpausebuttondiv ">
      <span className="fontsmall">{playingword ?
        <span>true</span> :
        <span>false</span>
      }
      </span>
      {playingword ?
        <div onClick={() => onClickPAUSEHandler()} className="bi bi-pause-btn"></div>

        :
        <div onClick={() => onClickPLAYHandler()} className="bi bi-play-btn"></div>


      }
      {/*  <span>{examplescount}</span> */}
    </div>
  )

}
