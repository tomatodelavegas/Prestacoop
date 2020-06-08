import React, { useState, useEffect } from 'react';
import API from '../API';
import Alert from './Alert';
import AlertPaginator from './AlertPaginator';
import Alerter from './Alerter';
import Table from 'react-bootstrap/Table';

function Alerts({ }) {
    let fields = ['id', 'Drone_ID', 'Issue_Date', 'Plate_ID', 'Violation_Code', 'Vehicle_Body_Type', 'Street_Code1', 'Street_Code2', 'Street_Code3', 'Violation_Time', 'Violation_County', 'Registration_State', 'Vehicle_Color', 'Vehicle_Maker'];
    const paginateBy = 3;
    let [alerts, setAlerts] = useState([]);
    let [currentpagenumber, setCurrentpagenumber] = useState(1);
    let [pagesnumbers, setPagesnumber] = useState([1]);

    let loadPage = (pagenum) => {
        let offset = (pagenum - 1) * paginateBy;
        console.log(`loading page: ${offset}`);
        API.get(`msglist/${offset}/${paginateBy}`).then(res => {
            return res.data;
        }).then(data => {
            console.log(`DONE msglist/${offset}/${paginateBy}`);
            console.log(`Loaded alerts: ${data}`);
            setAlerts(data);
        }).catch(err => console.error(err));
    };

    let updatePagesnumber = (data, loadLast = true) => {
        let maxpages = Math.ceil(data[0]['count(*)'] / paginateBy)
        console.log(`We now have ${maxpages} page(s)`);
        let npages = [];
        for (let i = 1; i <= maxpages; ++i)
            npages.push(i);
        setPagesnumber(npages);
        if (loadLast) {
            // we reload the last page each time, since we cannot use currentpagenumber for comparaison
            console.log(`going to page: ${maxpages}`);
            loadPage(maxpages);
            clickPage(maxpages);
        }
    }

    let loadPageCount = () => {
        API.get(`msgcount/`).then(res => {
            return res.data;
        }).then(data => {
            if (data.length <= 0)
                console.error("No data");
            else {
                updatePagesnumber(data, false);
            }
        }).catch(err => console.error(err));
    }

    let clickPage = (pagenum) => {
        console.log(`switching to page: ${pagenum}`);
        setCurrentpagenumber(pagenum);
    };

    useEffect(() => {
        loadPageCount();
        loadPage(currentpagenumber);
    }, [currentpagenumber]);

    return (
        <div>
            <Alerter onUpdate={updatePagesnumber} />
            <AlertPaginator onClick={clickPage} pagesnumbers={pagesnumbers} currentpagenumber={currentpagenumber} />
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        {
                            fields.map((field, i) => {
                                return (<th key={i}>{field}</th>)
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        alerts.map((alert, i) => {
                            return (<Alert key={i} content={alert} />)
                        })
                    }
                </tbody>
            </Table>
        </div>
    );
}

export default Alerts;