
'use client'
import Link from "next/link";
import { useState } from "react";
import FlashcardPage from '../flash/page'
import Quiz1 from '../quiz1/page'
import Quiz2 from '../quiz2/page'
import Quiz3 from '../quiz3/page'
import Quiz4 from '../quiz4/page'
import Quiz5 from '../quiz5/page'
export default function LessonPage({ params }) {

  // const lessonid = params.id
  const { lessonid } = params;
  const [flashpage, setFlashpage] = useState(true);
  const [quiz1page, setQuiz1page] = useState(false);
  const [quiz2page, setQuiz2page] = useState(false);
  const [quiz3page, setQuiz3page] = useState(false);
  const [quiz4page, setQuiz4page] = useState(false);
  const [quiz5page, setQuiz5page] = useState(false);

  const toggleTabs = (tab) => {
    if (tab === "flashcard") {
      setFlashpage(true);
      setQuiz1page(false);
      setQuiz2page(false);
      setQuiz3page(false);
      setQuiz4page(false);
      setQuiz5page(false);
    }
    else if (tab === "quiz1") {
      setFlashpage(false);
      setQuiz1page(true);
      setQuiz2page(false);
      setQuiz3page(false);
      setQuiz4page(false);
      setQuiz5page(false);

    }
    else if (tab === "quiz2") {
      setFlashpage(false);
      setQuiz1page(false);
      setQuiz2page(true);
      setQuiz3page(false);
      setQuiz4page(false);
      setQuiz5page(false);

    }
    else if (tab === "quiz3") {
      setFlashpage(false);
      setQuiz1page(false);
      setQuiz2page(false);
      setQuiz3page(true);
      setQuiz4page(false);
      setQuiz5page(false);
    }
    else if (tab === "quiz4") {
      setFlashpage(false);
      setQuiz1page(false);
      setQuiz2page(false);
      setQuiz3page(false);
      setQuiz4page(true);
      setQuiz5page(false);
    }
    else if (tab === "quiz5") {
      setFlashpage(false);
      setQuiz1page(false);
      setQuiz2page(false);
      setQuiz3page(false);
      setQuiz4page(false);
      setQuiz5page(true);
    }



  }
  function callBackchangetab(tab) {
    toggleTabs(tab)
  }
  return (
    <>
      <div className="formtabs flex flex-row">
        <button onClick={(e) => toggleTabs('flashcard')} className={`${flashpage ? 'activetab' : ''} button button-outline tabbutton`}>Flashcards</button>
        <button onClick={(e) => toggleTabs('quiz1')} className={`${quiz1page ? 'activetab' : ''} button button-outline tabbutton`}>Quiz 1</button>
        <button onClick={(e) => toggleTabs('quiz2')} className={`${quiz2page ? 'activetab' : ''} button button-outline tabbutton`}>Quiz 2</button>
        <button onClick={(e) => toggleTabs('quiz3')} className={`${quiz3page ? 'activetab' : ''} button button-outline tabbutton`}>Quiz 3</button>
        <button onClick={(e) => toggleTabs('quiz4')} className={`${quiz4page ? 'activetab' : ''} button button-outline tabbutton`}>Quiz 4</button>
        <button onClick={(e) => toggleTabs('quiz5')} className={`${quiz5page ? 'activetab' : ''} button button-outline tabbutton`}>Quiz 5</button>
      </div>

      {flashpage && <FlashcardPage lessonid={lessonid} />}
      {quiz1page && <Quiz1 lessonid={lessonid} callBackchangetabprop={callBackchangetab} />}
      {quiz2page && <Quiz2 lessonid={lessonid} callBackchangetabprop={callBackchangetab} />}
      {quiz3page && <Quiz3 lessonid={lessonid} callBackchangetabprop={callBackchangetab} />}
      {quiz4page && <Quiz4 lessonid={lessonid} callBackchangetabprop={callBackchangetab} />}
      {quiz5page && <Quiz5 lessonid={lessonid} />}

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