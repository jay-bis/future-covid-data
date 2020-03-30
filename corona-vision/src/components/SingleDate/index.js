import React from 'react';
import DatePicker from 'react-datepicker';
import format from 'date-fns/format';

import "react-datepicker/dist/react-datepicker.css";

const d = format((new Date()), "yyyy-MM-dd")

const SingleDate = props => {

    const [addrDate, setAddrDate] = React.useState(d);

    const handleChange = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd")
        props.setAddrItemWithDate(props.addr, formattedDate);
    }

    return (
        <div>
            <DatePicker
                selected={typeof addrDate === 'string' ? new Date() : addrDate}
                onChange={date => {
                    setAddrDate(date);
                    handleChange(date);
                }}
            />
        </div>
    )
}

export default SingleDate;