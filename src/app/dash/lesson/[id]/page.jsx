
'use client'
import Link from "next/link";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FlashcardPage from '../flash/page'
import Quiz1 from '../quiz1/page'
import Quiz2 from '../quiz2/page'
import Quiz3 from '../quiz3/page'
import Quiz4 from '../quiz4/page'
import Quiz5 from '../quiz5/page'
import { setactivetab } from '@/redux/slices/flashcardSlice.js'
export default function LessonPage({ params }) {
  const dispatch = useDispatch();
  const activetab = useSelector((state) => state.flashcardSlice.activetab);

  // const lessonid = params.id
  const { lessonid } = params;
  /*  const [flashpage, setFlashpage] = useState(true);
   const [quiz1page, setQuiz1page] = useState(false);
   const [quiz2page, setQuiz2page] = useState(false);
   const [quiz3page, setQuiz3page] = useState(false);
   const [quiz4page, setQuiz4page] = useState(false);
   const [quiz5page, setQuiz5page] = useState(false); */

  const toggleTabs = (tab) => {
    if (tab === "flashcard") {
      dispatch(setactivetab('flashcard'))
      /* setFlashpage(true);
      setQuiz1page(false);
      setQuiz2page(false);
      setQuiz3page(false);
      setQuiz4page(false);
      setQuiz5page(false); */
    }
    else if (tab === "quiz1") {
      dispatch(setactivetab('quiz1'))
      /*  setFlashpage(false);
       setQuiz1page(true);
       setQuiz2page(false);
       setQuiz3page(false);
       setQuiz4page(false);
       setQuiz5page(false); */

    }
    else if (tab === "quiz2") {
      dispatch(setactivetab('quiz2'))
      /*  setFlashpage(false);
       setQuiz1page(false);
       setQuiz2page(true);
       setQuiz3page(false);
       setQuiz4page(false);
       setQuiz5page(false); */

    }
    else if (tab === "quiz3") {
      dispatch(setactivetab('quiz3'))
      /* setFlashpage(false);
      setQuiz1page(false);
      setQuiz2page(false);
      setQuiz3page(true);
      setQuiz4page(false);
      setQuiz5page(false); */
    }
    else if (tab === "quiz4") {
      dispatch(setactivetab('quiz4'))
      /*   setFlashpage(false);
        setQuiz1page(false);
        setQuiz2page(false);
        setQuiz3page(false);
        setQuiz4page(true);
        setQuiz5page(false); */
    }
    else if (tab === "quiz5") {
      dispatch(setactivetab('quiz5'))
      /* setFlashpage(false);
      setQuiz1page(false);
      setQuiz2page(false);
      setQuiz3page(false);
      setQuiz4page(false);
      setQuiz5page(true); */
    }



  }
  function callBackchangetab(tab) {
    toggleTabs(tab)
  }
  return (
    <>
      <div className="formtabs flex flex-row">
        <button onClick={(e) => toggleTabs('flashcard')} className={`${activetab === 'flashcard' ? 'activetab' : ''} button button-outline tabbutton`}><span className="textminimise">Flashcards</span></button>
        <button onClick={(e) => toggleTabs('quiz1')} className={`${activetab === 'quiz1' ? 'activetab' : ''} button button-outline tabbutton`}><span className="textminimise">Quiz1</span></button>
        <button onClick={(e) => toggleTabs('quiz2')} className={`${activetab === 'quiz2' ? 'activetab' : ''} button button-outline tabbutton`}><span className="textminimise">Quiz2</span></button>
        <button onClick={(e) => toggleTabs('quiz3')} className={`${activetab === 'quiz3' ? 'activetab' : ''} button button-outline tabbutton`}><span className="textminimise">Quiz3</span></button>
        <button onClick={(e) => toggleTabs('quiz4')} className={`${activetab === 'quiz4' ? 'activetab' : ''} button button-outline tabbutton`}><span className="textminimise">Quiz4</span></button>
        <button onClick={(e) => toggleTabs('quiz5')} className={`${activetab === 'quiz5' ? 'activetab' : ''} button button-outline tabbutton`}><span className="textminimise">Quiz5</span></button>
      </div>

      {activetab === 'flashcard' && <FlashcardPage lessonid={lessonid} />}
      {activetab === 'quiz1' && <Quiz1 lessonid={lessonid} callBackchangetabprop={callBackchangetab} />}
      {activetab === 'quiz2' && <Quiz2 lessonid={lessonid} callBackchangetabprop={callBackchangetab} />}
      {activetab === 'quiz3' && <Quiz3 lessonid={lessonid} callBackchangetabprop={callBackchangetab} />}
      {activetab === 'quiz4' && <Quiz4 lessonid={lessonid} callBackchangetabprop={callBackchangetab} />}
      {activetab === 'quiz5' && <Quiz5 lessonid={lessonid} />}

      {/* WE NEED TO CHECK IF ALL THE FLASHCARDS WERE STUDIED IN THE STACK FIRST */}
      {/*  <div className="lessoncard">
        <h1>Lesson {lessonid}</h1>
      </div> */}
      {/*  <div className="flex flex-col gap-4 items-center justify-center mt-4">
        <Link href={`./flash/${lessonid}`}>
          <button className="btn button-primary">Study Flashcards!</button>
        </Link>
        <Link href={`./quiz1/${lessonid}`}>
          <button className="btn button-primary">QUIZ1: Word Test</button>
        </Link>
        <Link href={`./quiz2/${lessonid}`}>
          <button className="btn button-primary">QUIZ2: Choice Test</button>
        </Link>
        <Link href={`./quiz3/${lessonid}`}>
          <button className="btn button-primary">QUIZ3: Sentence Gap</button>
        </Link>
        <Link href={`./quiz4/${lessonid}`}>
          <button className="btn button-primary">QUIZ4: Sentence Choice</button>

        </Link>
        <Link href={`./quiz5/${lessonid}`}>
          <button className="btn button-primary">QUIZ5: Sentence Builder</button>

        </Link>
      </div> */}

    </>
  )
}