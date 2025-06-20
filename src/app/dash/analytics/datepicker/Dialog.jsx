import React, { useEffect, useState, useRef } from 'react';
import { getmonthnumber, getmonthname, daysinmonth2, getdayofweek, getdayname, getWeeksInMonth, makearrayofdatesfromWeek, convertYMD2DMY, convertDMY2YMD, convertDMY2YMDarray, convertMDY2YMDarray, convertFormat } from './daypickerjs';

export default function Dialog(props) {
  const {
    monthfordisplay,
    setMonthfordisplay,
    yearfordisplay,
    setYearfordisplay,
    selectedateArray,
    setSelecteddateArray,
    selectedRANGEArray,
    setSelectedRANGEArray,
    selecteddate2,
    setSelecteddate2,
    onDateChange,
    closedialog,
    multipleprop,
    actuallytoday,
    format
  } = props;

  const dialogref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogref.current && !dialogref.current.contains(event.target)) {
        closedialog(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closedialog]);

  const [monthname, setMonthname] = useState('');
  const [allweeksdates, setAllweeksdates] = useState([]);
  const [showmonth, setShowmonth] = useState(false);
  const [yearsArray, setYearsArray] = useState([]);
  const [showyears, setShowYears] = useState(false);

  //. FROM MONTH, YEAR -> BUILD CALENDAR VIEW ------------------------
  useEffect(() => {
    console.log('month OR YEAR for display CHANGED', monthfordisplay, yearfordisplay);
    let getmonthnameV = getmonthname(monthfordisplay, yearfordisplay);
    setMonthname(getmonthnameV);
    console.log(getmonthnameV, 'getmonthnamev');

    let daysinmonth1V = daysinmonth2(monthfordisplay, yearfordisplay);
    console.log(daysinmonth1V, 'daysinmonth');

    let testweeks = getWeeksInMonth(monthfordisplay, yearfordisplay);
    console.log(testweeks, 'testweeks');

    let mergedArray = [];

    let looptestweeks = testweeks.map((week, index) => {
      let weeknumberhere = week.weeknumber;
      let weekyearhere = week.year;
      let arrayofdates = makearrayofdatesfromWeek(weeknumberhere, weekyearhere, monthfordisplay, monthname);
      mergedArray = [...mergedArray, ...arrayofdates];
      console.log(arrayofdates, 'arrayofdates');
      return arrayofdates;
    });
    console.log(mergedArray, 'mergedArray');
    setAllweeksdates(mergedArray);
  }, [monthfordisplay, yearfordisplay]);

  //. FORM DISPLAYED YEAR - SET FUTURE/PAST YEAR
  useEffect(() => {
    let selectedyear = yearfordisplay;
    let yearsbefore = selectedyear - 10;
    let yearsafter = selectedyear + 10;
    let yearsarray = [];
    for (let i = yearsbefore; i <= yearsafter; i++) {
      yearsarray.push(i);
    }
    console.log(yearsarray, 'yearsarray');
    setYearsArray(yearsarray);
  }, [yearfordisplay]);

  //. CHEVRONS CHANGE MONTH
  const changemonth = (currentmonthnum, previousnext, yearfordisplay22) => {
    console.log('changing month');
    let cmonth = currentmonthnum;
    console.log(cmonth, 'cmonth');
    let cmonthnumber = cmonth;
    let cmonthnumberinjs = cmonthnumber;
    console.log(cmonthnumberinjs, 'cmonthnumberinjsFORNOWNOTTRUE');
    let newmonth;

    if (previousnext === 'previous') {
      console.log('going to previous month');
      if (cmonthnumberinjs === 1) {
        newmonth = 12;
        let newyear1 = yearfordisplay22 - 1;
        setMonthfordisplay(newmonth);
        setYearfordisplay(newyear1);
        console.log(newyear1, 'newyear1');
        console.log(typeof newyear1, 'newyear1 typeof');
      } else {
        newmonth = cmonthnumberinjs - 1;
        setMonthfordisplay(newmonth);
      }
    } else if (previousnext === 'next') {
      console.log('going to next month');
      if (cmonthnumberinjs === 12) {
        newmonth = 1;
        let newyear1 = yearfordisplay22 + 1;
        console.log(newyear1, 'newyear1');
        console.log(typeof newyear1, 'newyear1 typeof');
        setYearfordisplay(newyear1);
        setMonthfordisplay(newmonth);
      } else {
        console.log('next, not 12');
        newmonth = cmonthnumberinjs + 1;
        console.log(newmonth, 'newmonth');
        setMonthfordisplay(newmonth);
      }
    }
  };

  const changesetshowmonth = () => {
    if (showmonth === false) {
      setShowmonth(true);
      setShowYears(false);
    } else {
      setShowmonth(false);
    }
  };

  const changemonthclick = (monthnumber) => {
    console.log(monthnumber, 'monthnumber');
    setMonthfordisplay(monthnumber);
    setShowmonth(false);
  };

  const showyearsfunction = () => {
    if (showyears === false) {
      setShowYears(true);
      setShowmonth(false);
    } else {
      setShowYears(false);
    }
  };

  const changeyearfunction = (plusorminus) => {
    let currentselectyear = yearfordisplay;
    if (plusorminus === 'plus') {
      let newyear = currentselectyear + 10;
      setYearfordisplay(newyear);
    } else if (plusorminus === 'minus') {
      let newyear = currentselectyear - 10;
      setYearfordisplay(newyear);
    }
  };

  const selectnewyearfunction = (selectedyear) => {
    setYearfordisplay(selectedyear);
    setShowYears(false);
  };

  const onclickdate = (e, day) => {
    console.log(allweeksdates, 'allweeksdates123123');
    if (multipleprop === 'yes') {
      if (selectedateArray.find(item => item == day.datetxt)) {
        console.log('exists');
        let newarray = selectedateArray.filter(item => item !== day.datetxt);
        setSelecteddateArray(newarray);
        onDateChange(newarray);
      } else {
        console.log('multiple');
        setSelecteddateArray([...selectedateArray, convertFormat(format, day.datetxt)]);
        onDateChange([...selectedateArray, convertFormat(format, day.datetxt)]);
        let converteddatenow = convertFormat(format, day.datetxt);
        setSelecteddate2(converteddatenow);
      }
    } else if (multipleprop === 'range') {
      if (selectedRANGEArray.length < 2) {
        setSelectedRANGEArray([...selectedRANGEArray, day.datetxt]);
      } else if (selectedRANGEArray.length >= 2) {
        setSelectedRANGEArray([]);
        setSelectedRANGEArray([day.datetxt]);
      }
    } else {
      onDateChange(day);
      closedialog(false);
      alert(day)
      let converteddatenow = convertFormat(format, day);
      alert(converteddatenow)
      setSelecteddate2(converteddatenow);
    }
  };

  return (
    <div className="dialog" ref={dialogref}>
      <div className="mydaypickerwrapper">
        <div className="topdivdp">
          {!showyears && (
            <div className="chevronsdp chevrondpleft" onClick={() => changemonth(monthfordisplay, 'previous', yearfordisplay)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
              </svg>
            </div>
          )}
          {showyears && (
            <div className="chevronsdp chevrondpleft" onClick={() => changeyearfunction('minus')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
              </svg>
            </div>
          )}
          <div className="monthnamedp">
            <span className="curserpointer" onClick={() => changesetshowmonth()}>{monthname} </span>
            <span className="curserpointer" onClick={() => showyearsfunction()}>  {yearfordisplay}  </span>
          </div>
          {!showyears && (
            <div className="chevronsdp chevrondpright" onClick={() => changemonth(monthfordisplay, 'next', yearfordisplay)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
              </svg>
            </div>
          )}
          {showyears && (
            <div className="chevronsdp chevrondpleft" onClick={() => changeyearfunction('plus', yearfordisplay)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
              </svg>
            </div>
          )}
        </div>
        {!showmonth && !showyears && (
          <div className="mydatepickergrid">
            <div className="dayofweek">Mon</div>
            <div className="dayofweek">Tue</div>
            <div className="dayofweek">Wed</div>
            <div className="dayofweek">Thu</div>
            <div className="dayofweek">Fr</div>
            <div className="dayofweek">Sat</div>
            <div className="dayofweek">Sun</div>
            {allweeksdates && allweeksdates.map((day, index) => (
              <div
                key={day.datetxt}
                onClick={(e) => onclickdate(e, day.datetxt)}
                className={
                  `dpdatebox 
                  ${day.monthname !== monthname ? 'grey' : ''} 
                  ${selecteddate2 === convertFormat(day.datetxt) ? 'activedatebadge' : ''} 
                  ${day.datetxt === actuallytoday ? 'todaycss' : ''} 
                  ${selectedRANGEArray && selectedRANGEArray.find(item => item === day.datetxt) ? 'activedatebadge' : ''}
                  ${selectedateArray &&
                    selectedateArray.find(item => item == convertFormat(day.datetxt)) ? 'activedatebadge' : ''} `}
                data-date={convertFormat(day.datetxt)} data-monthname={day.monthname} data-monthnumber={day.monthnumber}
              >
                {day.datetxt.split('-')[2]}
              </div>
            ))}
          </div>
        )}
        {showmonth && !showyears && (
          <div className="monthsdiv">
            <div className="monthdiv curserpointer" id="1" onClick={(event) => { event.stopPropagation(); changemonthclick(1) }}>January</div>
            <div className="monthdiv curserpointer" id="2" onClick={(event) => { event.stopPropagation(); changemonthclick(2) }}>February</div>
            <div className="monthdiv curserpointer" id="3" onClick={(event) => { event.stopPropagation(); changemonthclick(3) }}>March</div>
            <div className="monthdiv curserpointer" id="4" onClick={(event) => { event.stopPropagation(); changemonthclick(4) }}>April</div>
            <div className="monthdiv curserpointer" id="5" onClick={(event) => { event.stopPropagation(); changemonthclick(5) }}>May</div>
            <div className="monthdiv curserpointer" id="6" onClick={(event) => { event.stopPropagation(); changemonthclick(6) }}>June</div>
            <div className="monthdiv curserpointer" id="7" onClick={(event) => { event.stopPropagation(); changemonthclick(7) }}>July</div>
            <div className="monthdiv curserpointer" id="8" onClick={(event) => { event.stopPropagation(); changemonthclick(8) }}>August</div>
            <div className="monthdiv curserpointer" id="9" onClick={(event) => { event.stopPropagation(); changemonthclick(9) }}>September</div>
            <div className="monthdiv curserpointer" id="10" onClick={(event) => { event.stopPropagation(); changemonthclick(10) }}>October</div>
            <div className="monthdiv curserpointer" id="11" onClick={(event) => { event.stopPropagation(); changemonthclick(11) }}>November</div>
            <div className="monthdiv curserpointer" id="12" onClick={(event) => { event.stopPropagation(); changemonthclick(12) }}>December</div>
          </div>
        )}
        {showyears && !showmonth && (
          <div className='yeardiv'>
            {yearsArray && yearsArray.map((year, index) => (
              <div key={index} className={`yeardivitem ${year === yearfordisplay ? 'activeyear' : ''}`}
                onClick={(event) => { event.stopPropagation(); selectnewyearfunction(year) }}
              > <span className="curserpointer"> {year} </span></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}