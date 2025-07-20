'use client'
import { useEffect, useState } from 'react';


export default function QuizInput({ getquizanswer }) {


  //FOR THE CAPTCHA 
  const [quizanswer, setQuizanswer] = useState('');
  const [quiznumberquestion, setQuiznumberquestion] = useState('');
  const [wrongquizanswer, setWrongQuizAnswer] = useState(false);
  const [wronganswercount, setWrongAnswerCount] = useState(0);
  const [ratelimitmsg, setRateLimitMessage] = useState(false) //if exceeds rate limit
  const [showansweredcorrect, setShowAnsweredCorrect] = useState(false); //if answered correctly


  useEffect(() => {
    const quizquestions = [
      ['1 + 1'],
      ['2 + 2'],
      ['3 + 3'],
      ['4 + 4'],
      ['5 + 5'],
      ['6 + 6'],
      ['7 + 7'],
      ['8 + 8'],
      ['9 + 9'],
      ['10 + 10'],
      ['11 + 11'],
      ['12 + 12'],
    ]
    const randomquestion = Math.floor(Math.random() * quizquestions.length);
    setQuiznumberquestion(quizquestions[randomquestion][0]);

  }, []);

  const checkquizanswer = async (e) => {
    // let fetchurl = process.env.API_URL + '/users/registercaptcha';
    let fetchurl = `${process.env.NEXT_PUBLIC_API_URL}/users/registercaptcha`;
    const response = await fetch(fetchurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        quiznumberquestion: quiznumberquestion,
        useranswer: quizanswer,
      })
    })

    //const data = await response.json();
    console.log('response', response);

    if (response.ok) {
      getquizanswer(true)      //captcha is correct send state parent ok
      setShowAnsweredCorrect(true);
      //timeout 
      setTimeout(() => {
        setShowAnsweredCorrect(false);
      }, 2000); // Hide the message after 2 seconds
    }
    else if (response.status === 400) {
      //captcha is incorrect send state parent error
      setWrongQuizAnswer(true)
      setWrongAnswerCount(wronganswercount + 1);
      getquizanswer(false) //captcha is incorrect send state parent error


    }
    else if (response.status === 429) {
      //rate limit exceeded 
      setRateLimitMessage(true);
      getquizanswer(false) //captcha is incorrect send state parent error

    }
  }

  function testthings(e) {
    setQuizanswer(e.target.value);
  }
  return (
    <>
      {/* JSX STYLE */}

      <div >
        {setWrongAnswerCount >= 3 && <p className="text-red-500">Captcha failed, please try again.</p>}
        {ratelimitmsg && <p className="text-red-500">You answered wrongly too many times, please try again later.</p>}
        {wronganswercount < 3 && !ratelimitmsg && (
          <div >

            <label htmlFor="puzzle">{quiznumberquestion}</label>
            <div className="flex flex-row gap-2 quizdivinputs">
              <input
                className="inputquiz "
                type="number"
                placeholder="Enter the answer"
                value={quizanswer}
                onChange={testthings}
                required
              />
              <button type="button" className={`button button-primary button-checkQUIZ ${showansweredcorrect ? 'bg-green-500' : ''}`} onClick={checkquizanswer}>Check </button>
            </div>
            {wrongquizanswer && <p className="text-red-500">Incorrect answer, {3 - wronganswercount} attempts left.</p>}
            {/* {!wrongquizanswer && <p style={{ color: 'green' }}>Correct answer</p>} */}
          </div>
        )}
      </div>

    </>
  );

}

/* 

      ['1 + 1', '2', 'one plus one'],
      ['2 + 2', '4', 'two plus two'],
      ['3 + 3', '6', 'three plus three'],
      ['4 + 4', '8', 'four plus four'],
      ['5 + 5', '10', 'five plus five'],
      ['6 + 6', '12', 'six plus six'],
      ['7 + 7', '14', 'seven plus seven'],
      ['8 + 8', '16', 'eight plus eight'],
      ['9 + 9', '18', 'nine plus nine'],
      ['10 + 10', '20', 'ten plus ten'],
      ['11 + 11', '22', 'eleven plus eleven'],
      ['12 + 12', '24', 'twelve plus twelve'], */