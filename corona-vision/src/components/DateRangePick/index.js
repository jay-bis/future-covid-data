import React from 'react';
import { DateRange } from 'react-date-range'
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import compareAsc from 'date-fns/compareAsc';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import './DateRangePick.css';

const DateRangePick = props => {

    const [range, setRange] = React.useState([{
          startDate: new Date(),
          endDate: addDays(new Date(), 3),
          key: 'selection'
      }]
    );

    const [error, setError] = React.useState('');
      
    const handleChange = item => {
      setRange([item.selection]);
    };

    // this function will eventually send a GET req to the backend
    // with the current date range
    const submitInterval = () => {
      setError('');
      const start = range[0].startDate;
      const end = range[0].endDate;
      // make sure you can still select the current day as start
      if (compareAsc(start.setHours(0, 0, 0, 0), (new Date()).setHours(0, 0, 0, 0)) === -1) {
        setError('Start date must not be earlier than today!')
        return;
      }
      if (compareAsc(end, start) !== 1) {
        setError('End date must be later than start date!');
        return;
      }
      
      const formattedStart = format(start, 'yyyy-MM-dd');
      const formattedEnd = format(end, 'yyyy-MM-dd');
      console.log(formattedStart, formattedEnd);
    };

      return (
        <div>
          <p className="header-text">Predictive Modeling - Select a date range</p>
          <p className="explanatory-text">When you press the submit button, the map will
            display what we think will be the total number of
            cases by the end date specified.
          </p>
          <DateRange
            editableDateInputs={true}
            onChange={handleChange}
            moveRangeOnFirstSelection={false}
            ranges={range}
          />
          <button 
            type="button" 
            className="btn btn-primary submit-btn"
            onClick={submitInterval}>
              Submit
            </button>
          <p className="error-msg">{error}</p>
        </div>
      )
}

export default DateRangePick;