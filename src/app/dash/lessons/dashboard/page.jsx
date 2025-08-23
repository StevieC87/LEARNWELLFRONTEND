'use client'
import { useEffect, useState } from "react";
import Link from 'next/link';
import "./dashboardCSS.css";
export default function Dashboard() {

  const [progresswordstack, setProgresswordstack] = useState([]);
  const [totalfluent, setTotalfluent] = useState(0);
  const [totalfamiliar, setTotalfamiliar] = useState(0);
  const [totaluncertain, setTotaluncertain] = useState(0);
  const [totalnew, setTotalnew] = useState(0);
  const [totalwords, setTotalwords] = useState(0);
  const [totalstacks, setTotalstacks] = useState(0);
  const [stacksdone, setStacksdone] = useState(0);
  const [wordstodayOBJ, setWordstodayOBJ] = useState({});
  const [wordstodaynumber, setWordstodaynumber] = useState(0);
  const [todayfluent, setTodayfluent] = useState(0);
  const [todayfamiliar, setTodayfamiliar] = useState(0);
  const [todayuncertain, setTodayuncertain] = useState(0);
  const [todaynew, setTodaynew] = useState(0);

  async function fetchprogresswordstack() {
    try {
      let fetchseewordsbystack = await fetch('')
      let url = `http://localhost:3001/api/fetchprogresswordstack`;
      const response = await fetch(url);

      if (!response.ok) {
        console.log('Error fetching (remaining) flashcards');
      }
      console.log('hello')
      const data = await response.json();
      return data;
    }
    //console.log(data, "data123123123");

    catch (error) {
      console.log('Failed to fetch (remaining) flashcards', error);
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
        setTotalwords(dashresults.countallwordsLENGTH)
        setTotalstacks(dashresults.newobjectarray.length)

        //count number of stacks done
        let countthis = dashresults.newobjectarray.filter(stack => stack.totallength > 95);
        setStacksdone(countthis.length);
        setWordstodayOBJ(dashresults.countwordstodayOBJ)
      }
    }
    getData()
  }, [])

  useEffect(() => {
    // countallfluent = progresswordstack.reduce((a, b) => a + b, 0);
    let countallfluent = progresswordstack.reduce((a, b) => a + b.fluent, 0);
    setTotalfluent(countallfluent)

    let countallfamiliar = progresswordstack.reduce((a, b) => a + b.familiar, 0);
    setTotalfamiliar(countallfamiliar)
    let countalluncertain = progresswordstack.reduce((a, b) => a + b.uncertain, 0);
    setTotaluncertain(countalluncertain)
    let countallnew = progresswordstack.reduce((a, b) => a + b.newword, 0);
    setTotalnew(countallnew)

    let wordstodaytodal = wordstodayOBJ.countallTODAYwordsLENGTH;
    setWordstodaynumber(wordstodaytodal);

    setTodayfluent(wordstodayOBJ.counttodaysfamiliar)
    setTodayfamiliar(wordstodayOBJ.counttodaysfamiliar)
    setTodayuncertain(wordstodayOBJ.counttodaysuncertain)
    setTodaynew(wordstodayOBJ.counttodaysnew)

  }, [progresswordstack, wordstodayOBJ])

  return (

    <div className="dashboard">

      <div className="">
        <h1 className="gloria chalkunderline text-center dboard">Dashboard</h1>
        <p>Total Words: {totalwords} </p>
        <span> Total Fluent words:  {totalfluent}</span>
        <p>Today you covered {wordstodaynumber} words, you learned fluently
          {todayfluent} words,
          {/*   \familiar {todayfamiliar} words, uncertain {todayuncertain} words, new {todaynew} words */}
        </p>

        <span> ,   {((totalfluent / totalwords) * 100).toFixed(1)}%</span>
        <p>Stacks studied: {stacksdone}/{totalstacks}</p>

      </div>
    </div >


  )

}