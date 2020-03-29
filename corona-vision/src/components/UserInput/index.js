import React from 'react';
import { Button, Modal, ListGroup } from 'react-bootstrap';

import '../AddressForm';
import AddressForm from '../AddressForm';

const UserInput = props => {

    const [show, setShow] = React.useState(false);
    const [addrList, setAddrList] = React.useState([]);

    const handleClose = () => {
        setShow(false);
        setAddrList([]);
    }
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        console.log('hello');
    }

    const handleListItemClose = addr => {
        console.log(addrList);
        setAddrList(addrList.filter(item => item !== addr))
    };

    return (
        <div>
            <Button type="button" onClick={handleShow}>Enter Input</Button>
        
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
                        <AddressForm 
                            setParentAddrList={setAddrList}
                        />
                        <ListGroup>
                            {addrList.map(addr => (
                                    <ListGroup.Item key={Math.random()}>
                                        {addr}
                                        <span onClick={() => handleListItemClose(addr)}className="btn btn-xs btn-default">
                                            <i class="fas fa-times"></i>
                                        </span>
                                    </ListGroup.Item>
                            ))}
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