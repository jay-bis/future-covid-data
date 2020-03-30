import React from 'react';
import DateRangePick from '../DateRangePick';
import UserInput from '../UserInput';

import './Sidebar.css';

const Sidebar = props => {

    return (
        <div className="sidenav">
            <DateRangePick 
                setParentDates={props.setSidebarDates}
                setParentOnPred={props.setSidebarOnPred}
            />
            <UserInput />
        </div>
    )
};

export default Sidebar;