import React from 'react';
import { Button, Modal, ListGroup } from 'react-bootstrap';

import AddressForm from '../AddressForm';
import SingleDate from '../SingleDate';
import { putEvents } from '../../utils/api';

import './UserInput.css';

const UserInput = props => {

    const [show, setShow] = React.useState(false);
    const [addrList, setAddrList] = React.useState([]);
    const [delAddr, setDelAddr] = React.useState('');
    const [symptom, setSymptom] = React.useState(false);
    const [latlngs, setLatlngs] = React.useState([]);

    const handleClose = () => {
        setShow(false);
        setAddrList([]);
        setLatlngs([]);
    }
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        putEvents(symptom, latlngs);
        setShow(false);
    }

    const handleDateChange = (addr, date) => {
        setAddrList(prev => {
            for (var i = 0; i<prev.length; i++) {
                if (prev[i].addr === addr) {
                    prev[i].date = date
                }
            }
            return [...prev];
        
        });
    }

    const handleListItemClose = addr => {
        setAddrList(addrList.filter(item => item.addr !== addr));
        setDelAddr(addr);
    };

    const yesSymptoms = () => {
        setSymptom(true);
    };

    const noSymptoms = () => {
        setSymptom(false);
    }

    return (
        <div>
            <div style={{ marginTop: '150px' }}>
                <p className="header-text">Add your previous location(s) to the map!</p>
                <Button style={{ border: "1.5px solid white" }} type="button" onClick={handleShow}>Enter Input</Button>
            </div>
        
            <Modal 
                show={show} 
                onHide={handleClose}
                size="lg"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title>Enter your last known locations (up to 14 days ago)</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <div style={{ margin: '25px' }}>
                            Are you symptomatic?
                            <Button 
                                style={{ marginLeft: '15px' }} 
                                type="button" 
                                variant="success"
                                className={symptom ? 'btn-select' : ''}
                                onClick={yesSymptoms}
                                >
                                    Yes
                            </Button>
                            <Button 
                                style={{ marginLeft: '15px' }} 
                                type="button" 
                                variant="danger"
                                className={!symptom ? 'btn-select' : ''}
                                onClick={noSymptoms}
                                >
                                    No
                            </Button>
                        </div>
                        <AddressForm 
                            setParentAddrList={setAddrList}
                            addrToDelete={delAddr}
                            setParentLatlngs={setLatlngs}
                        />
                        <ListGroup>
                            {addrList.map((item) => {
                                    return (
                                    <ListGroup.Item key={Math.random()}>
                                        {item.addr}
                                        <span onClick={() => handleListItemClose(item.addr)}className="btn btn-xs btn-default">
                                            <i className="fas fa-times"></i>
                                        </span>
                                        <SingleDate 
                                            setAddrItemWithDate={handleDateChange}
                                            addr={item.addr}
                                        />
                                    </ListGroup.Item>
                                    )
                            })}
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                    </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UserInput;