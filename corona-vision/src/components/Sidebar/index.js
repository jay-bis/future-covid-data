import React from 'react';
import DateRangePick from '../DateRangePick';


import './Sidebar.css';

const Sidebar = props => {


    return (
        <div className="sidenav">
            <DateRangePick />
        </div>
    )
};

export default Sidebar;