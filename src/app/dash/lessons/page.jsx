'use client'
import { useEffect, useState } from "react";
import Link from 'next/link';
import './lessons.css'
import { useRouter } from 'next/navigation';

export default function Lessons() {
  const router = useRouter();
  const [progresswordstack, setProgresswordstack] = useState([]);

  const [wordstodayOBJ, setWordstodayOBJ] = useState({});


  async function fetchprogresswordstack() {
    try {
      let fetchseewordsbystack = await fetch('')
      let url = `http://localhost:3000/api/fetchprogresswordstack`;
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
      let url = `http://localhost:3000/api/getuserlessonscompleted`;
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



  return (
    <>
      {/*  <h1 className="gloria dboard text-center chalkunderline yellow ">Lessons </h1> */}
      <h1 className="text-center">Lessons </h1>
      <div className="lessoncardFlex">
        {progresswordstack && progresswordstack.length > 0 ? (

          progresswordstack.map((stack, index) => (
            <Link href={`./lesson/${index + 1}`} key={index}>
              <div className="lessoncard  " >{ }
                <div className="text-center">Lesson {index + 1}</div>
                <div className="lessoncardtext">
                  {/*  <p>{stack.totallength}</p>
                  {stack.totallength > 95 ? <span className="marker checktext">✔</span> : ''}
                  <p>Fluent: <span className="bold lessoncardtextnumber">{stack.fluent}</span></p>
                  <p>Familiar: <span className="bold lessoncardtextnumber">{stack.familiar}</span></p>
                  <p>Uncertain: <span className="bold lessoncardtextnumber">{stack.uncertain}</span></p>
                  <p>New: <span className="bold lessoncardtextnumber">{stack.newword}</span></p> */}
                </div>
                <div>
                  {/*     <button href="/#" className="typewritebutton" onClick={(e) => {
                  e.stopPropagation();
                  router.push('/review');
                  }}>Review</button> */}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="card1">
            <p>No flashcards remaining</p>
          </div>
        )
        }

      </div>

    </>
  )
}