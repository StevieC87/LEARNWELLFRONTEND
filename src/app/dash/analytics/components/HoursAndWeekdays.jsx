import { useState } from 'react';
import HoursofDayTraffic from './HoursofDay';
import DaysofWeek from './WeekdaysBarChart';

export default function HoursandWeeks(props) {

  const { hoursofdaytraffic, weekdaystraffic, selecteddatesMulti } = props;

  const [showhoursOrdays, setShowhoursOrdDays] = useState('hours');

  return (
    <div className="flex flex-col gap-4 card">
      <div className="flex flex-row justify-between">
        <div id="hoursdaystitle">
          {showhoursOrdays === 'hours' ? 'Unique Visits by Hour of Day' : 'Unique Visits by Weekday'}
        </div>
        <div id="hoursdayschoice flex flex-row justify-between gap-3">
          <button onClick={() => setShowhoursOrdDays('hours')} className={`btn ${showhoursOrdays === 'hours' ? 'analyticscardactive' : ''} ml-2`}>
            Time
          </button>
          {selecteddatesMulti && selecteddatesMulti.length > 6 && (
            <button onClick={() => setShowhoursOrdDays('days')} className={`btn ${showhoursOrdays === 'days' ? 'analyticscardactive' : ''}  ml-4`}>
              Weekdays
            </button>
          )}
        </div>

      </div>
      {showhoursOrdays === 'hours' && (
        <HoursofDayTraffic data={hoursofdaytraffic} />
      )}

      {selecteddatesMulti && selecteddatesMulti.length > 6 && (
        (showhoursOrdays === 'days' &&
          <DaysofWeek data={weekdaystraffic} />
        )
      )}
    </div>
  )
}