import { convertTOSYSTEMFormat } from './daypickerjs'

export default function CalendarView({
  allweeksdates,
  monthname,
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
}) {

  const onclickdate = (e, day) => {
    console.log(allweeksdates, 'allweeksdates123123');
    //! WE RECEIVE DATE format in default : YYYY-MM-DD
    if (!multipleprop) { //if single date option

      onDateChange(day);
      setSelecteddate2(day);
      closedialog(false);
    }
    else if (multipleprop === 'yes') {
      alert(day)
      if (selectedateArray.find(item => item == day)) {
        alert('already selected');
        let newarray = selectedateArray.filter(item => item !== day);
        setSelecteddateArray(newarray);
        onDateChange(newarray);
      }
      else {
        alert('selected');
        console.log('multiple');
        setSelecteddateArray([...selectedateArray, day]);
        onDateChange([...selectedateArray, day]);

        setSelecteddate2(day);
      }
    } else if (multipleprop === 'range') {
      if (selectedRANGEArray.length < 2) {
        setSelectedRANGEArray([...selectedRANGEArray, day]);
      } else if (selectedRANGEArray.length >= 2) {
        setSelectedRANGEArray([]);
        setSelectedRANGEArray([day]);
      }
    }
  };

  return (
    <div className="mydatepickergrid">
      <div className="dayofweek">Mon</div>
      <div className="dayofweek">Tue</div>
      <div className="dayofweek">Wed</div>
      <div className="dayofweek">Thu</div>
      <div className="dayofweek">Fr</div>
      <div className="dayofweek">Sat</div>
      <div className="dayofweek">Sun</div>
      {allweeksdates && allweeksdates.map((day, index) => (
        //! allweeksdates is in default system format yyyy-mm-dd
        <div
          key={day.datetxt}
          data-date={day.datetxt} data-monthname={day.monthname} data-monthnumber={day.monthnumber}
          onClick={(e) => onclickdate(e, day.datetxt)}
        /*  className={
           `dpdatebox 
         ${day.monthname !== monthname ? 'grey' : ''} 
         ${selecteddate2 === convertFormat(format, day.datetxt) ? 'activedatebadge' : ''} 
         ${day.datetxt === actuallytoday ? 'todaycss' : ''} 
         ${selectedRANGEArray && selectedRANGEArray.find(item => item === day.datetxt) ? 'activedatebadge' : ''}
         ${selectedateArray &&
             selectedateArray.find(item => item == convertFormat(format, day.datetxt)) ? 'activedatebadge' : ''} `}
          */
        >
          {day.datetxt.split('-')[2]}
        </div>
      ))}
    </div>
  )
}