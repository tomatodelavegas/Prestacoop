import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from "socket.io-client";
import Toast from 'react-bootstrap/Toast';
import backendConf from '../config';

const ENDPOINT = `http://${backendConf.PCOP_BACKEND_HOST_NAME}:${backendConf.PCOP_BACKEND_PORT}`;
console.log(`Socket endpoint: ${ENDPOINT}`);

function Alerter({ onUpdate }) {
    const [alertcount, setAlertcount] = useState(0);
    const clearAlert = () => {
        setAlertcount(0);
    };

    // !!! TODO: findDomNode is deprecated (Transition React Bootstrap)
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
            console.log(data);
            setAlertcount(alertcount + 1);
            onUpdate(data);
        });
    }, []);

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            style={{ display: 'contents', position: 'relative', minHeight: '100px', zIndex: "1" }}
        >
            <Toast show={alertcount > 0} onClose={clearAlert} style={{
                position: 'absolute',
                top: 0,
                right: 0
            }}>
                <Toast.Header>
                    <strong className="mr-auto">{alertcount} new {alertcount > 1 ? 'alerts' : 'alert'}</strong>
                </Toast.Header>
                <Toast.Body>A new drone requires your attention</Toast.Body>
            </Toast>
        </div >
    );
}

Alerter.propTypes = {
    onUpdate: PropTypes.func.isRequired
}

export default Alerter;