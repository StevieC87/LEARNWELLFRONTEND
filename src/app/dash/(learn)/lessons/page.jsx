'use client'
import { useEffect, useState } from "react";
import Link from 'next/link';
import './lessons.css'
import { useRouter } from 'next/navigation';

export default function Lessons() {
  const router = useRouter();
  const [progresswordstack, setProgresswordstack] = useState([]);

  const [wordstodayOBJ, setWordstodayOBJ] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const TAB_SIZE = 50;
  const MINI_INTERVAL = 5;
  const MEGA_INTERVAL = 15;


  async function fetchprogresswordstack() {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/fetchprogresswordstack`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials for session management

      });

      if (!response.ok) {
        console.log('Error fetching (remaining) flashcards');
      }

      const data = await response.json();
      console.log(data, "dataflashcardslessons");
      return data;
    }
    //console.log(data, "data123123123");

    catch (error) {
      console.log('Failed to fetch (remaining) flashcards', error);
    }

  }

  async function getuserlessonscompleted() {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/getuserlessonscompleted`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials for session management
      });

      if (!response.ok) {
        console.log('Error fetching user lessons completed');
      }

      const data = await response.json();
      console.log(data, "data lessons completed");
      return data;
    }
    //console.log(data, "data123123123");

    catch (error) {
      console.log('Failed to fetch user lessons completed', error);
    }
  }


  useEffect(() => {

    async function getData() {
      let dashresults = await fetchprogresswordstack();
      if (!dashresults) {
        console.log('Error fetching (remaining) flashcards');
      }
      else if (dashresults) {
        console.log(dashresults, "dashresults"); +
          setProgresswordstack(dashresults.newobjectarray)

        const countthis = dashresults.newobjectarray.filter(stack => stack.totallength > 95);
        // setStacksdone(countthis.length);
        setWordstodayOBJ(dashresults.countwordstodayOBJ)
      }
    }
    getData()

    getuserlessonscompleted()
  }, [])

  useEffect(() => {

    let wordstodaytodal = wordstodayOBJ.countallTODAYwordsLENGTH;


  }, [progresswordstack, wordstodayOBJ])



  const tabs = progresswordstack.length > 0
    ? Array.from({ length: Math.ceil(progresswordstack.length / TAB_SIZE) }, (_, i) => ({
      label: `${i * TAB_SIZE + 1}–${Math.min((i + 1) * TAB_SIZE, progresswordstack.length)}`,
    }))
    : [];

  const visibleStack = progresswordstack.slice(
    activeTab * TAB_SIZE,
    (activeTab + 1) * TAB_SIZE
  );

  const tabOffset = activeTab * TAB_SIZE;

  function buildDisplayList(stacks, offset) {
    const list = [];
    for (let i = 0; i < stacks.length; i++) {
      const g = offset + i + 1;
      list.push({ type: 'lesson', lesson: stacks[i], g });
      if (g % MEGA_INTERVAL === 0) {
        list.push({ type: 'mega', fromLesson: g - 9, toLesson: g });
      } else if (g % MINI_INTERVAL === 0) {
        list.push({ type: 'mini', fromLesson: g - 4, toLesson: g });
      }
    }
    return list;
  }

  const displayList = buildDisplayList(visibleStack, tabOffset);

  return (
    <>
      <h1 className="text-center">Lessons </h1>

      {tabs.length > 1 && (
        <div className="lessonTabs">
          {tabs.map((tab, i) => (
            <button
              key={i}
              className={`lessonTab${activeTab === i ? ' lessonTabActive' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="lessoncardFlex">
        {displayList.length > 0 ? displayList.map((item) => {
          if (item.type === 'lesson') {
            const { lesson, g } = item;
            return (
              <Link href={`./lesson/${g}`} key={`lesson-${g}`}>
                <div className="lessoncard">
                  <div className="text-center">Lesson {g}</div>
                  <div className="lessoncardtext">
                    {lesson.lessoncompleted === 'Completed' && <span className="marker checktext">✔ Completed</span>}
                    {lesson.lessoncompleted === 'In progress' && <span className="marker inprogresstext">In progress</span>}
                    {lesson.lessoncompleted === 'Not started' && <span className="marker notstartedtext">Not started</span>}
                  </div>
                </div>
              </Link>
            );
          }
          const recapId = `${item.type}-${item.fromLesson}-${item.toLesson}`;
          return (
            <Link href={`./lesson/recap/${recapId}`} key={`recap-${recapId}`}>
              <div className={`lessoncard ${item.type === 'mega' ? 'megaRecapCard' : 'miniRecapCard'}`}>
                <div className="text-center recapCardTitle">
                  {item.type === 'mini' ? '⚡ Mini Recap' : '🔥 Mega Recap'}
                </div>
                <div className="lessoncardtext">
                  <span className="recapRange">L{item.fromLesson}–{item.toLesson}</span>
                </div>
              </div>
            </Link>
          );
        }) : <div></div>}
      </div>
    </>
  );
}