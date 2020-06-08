import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

function AddAlertButton({ onClickAddAlert }) {
    return (
        <Button variant="primary" onClick={onClickAddAlert}>
            Add Alert
        </Button>
    );
}

AddAlertButton.propTypes = {
    onClickAddAlert: PropTypes.func.isRequired
}

export default AddAlertButton;