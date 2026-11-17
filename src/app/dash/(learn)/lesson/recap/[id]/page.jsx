'use client'
import { useSelector, useDispatch } from "react-redux";
import { setactivetab } from '@/redux/slices/flashcardSlice.js';
import FlashcardPage from '../../flash/page';
import Quiz1 from '../../quiz1/page';
import Quiz2 from '../../quiz2/page';
import Quiz3 from '../../quiz3/page';
import Quiz4 from '../../quiz4/page';
import Quiz5 from '../../quiz5/page';

export default function RecapLessonPage({ params }) {
  const dispatch = useDispatch();
  const activetab = useSelector((state) => state.flashcardSlice.activetab);

  const { id } = params;
  const parts = id.split('-');
  const recapType = parts[0];
  const fromLesson = parseInt(parts[1]);
  const toLesson = parseInt(parts[2]);

  const toggleTabs = (tab) => dispatch(setactivetab(tab));

  function callBackchangetab(tab) {
    toggleTabs(tab);
  }

  return (
    <>
      <div className="formtabs flex flex-row">
        <button onClick={() => toggleTabs('flashcard')} className={`${activetab === 'flashcard' ? 'activetab' : ''} button button-outline tabbutton`}>
          <span className="textminimise">Flashcards</span>
        </button>
        <button onClick={() => toggleTabs('quiz1')} className={`${activetab === 'quiz1' ? 'activetab' : ''} button button-outline tabbutton`}>
          <span className="textminimise">Quiz1</span>
        </button>
        <button onClick={() => toggleTabs('quiz2')} className={`${activetab === 'quiz2' ? 'activetab' : ''} button button-outline tabbutton`}>
          <span className="textminimise">Quiz2</span>
        </button>
        <button onClick={() => toggleTabs('quiz3')} className={`${activetab === 'quiz3' ? 'activetab' : ''} button button-outline tabbutton`}>
          <span className="textminimise">Quiz3</span>
        </button>
        <button onClick={() => toggleTabs('quiz4')} className={`${activetab === 'quiz4' ? 'activetab' : ''} button button-outline tabbutton`}>
          <span className="textminimise">Quiz4</span>
        </button>
        <button onClick={() => toggleTabs('quiz5')} className={`${activetab === 'quiz5' ? 'activetab' : ''} button button-outline tabbutton`}>
          <span className="textminimise">Quiz5</span>
        </button>
      </div>

      <h2 className="text-center mt-2">
        {recapType === 'mini' ? '⚡ Mini Recap' : '🔥 Mega Recap'}: Lessons {fromLesson}–{toLesson}
      </h2>

      {activetab === 'flashcard' && (
        <FlashcardPage fromLesson={fromLesson} toLesson={toLesson} />
      )}
      {activetab === 'quiz1' && <Quiz1 lessonid={String(fromLesson)} callBackchangetabprop={callBackchangetab} />}
      {activetab === 'quiz2' && <Quiz2 lessonid={String(fromLesson)} callBackchangetabprop={callBackchangetab} />}
      {activetab === 'quiz3' && <Quiz3 lessonid={String(fromLesson)} callBackchangetabprop={callBackchangetab} />}
      {activetab === 'quiz4' && <Quiz4 lessonid={String(fromLesson)} callBackchangetabprop={callBackchangetab} />}
      {activetab === 'quiz5' && <Quiz5 lessonid={String(fromLesson)} />}
    </>
  );
}
