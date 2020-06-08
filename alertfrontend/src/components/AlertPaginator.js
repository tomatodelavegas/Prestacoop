import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'react-bootstrap/Pagination';

function AlertPaginator({ pagesnumbers, currentpagenumber, onClick }) {
    return (
        <div>
            <Pagination style={{ justifyContent: "center" }}>
                <Pagination.First onClick={() => onClick(1)} />
                {
                    pagesnumbers.map((pagenumber, i) => {
                        return (<Pagination.Item key={i} onClick={() => onClick(pagenumber)} active={pagenumber === currentpagenumber}>{pagenumber}</Pagination.Item>)
                    })
                }
                <Pagination.Last onClick={() => onClick(pagesnumbers[pagesnumbers.length - 1])} />
            </Pagination>
        </div>
    );
}

// TODO: <Pagination.Ellipsis />

AlertPaginator.propTypes = {
    pagesnumbers: PropTypes.array.isRequired,
    currentpagenumber: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
}

export default AlertPaginator;