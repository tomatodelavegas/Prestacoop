import React from 'react';
import PropTypes from 'prop-types';


function Alert({ content }) {
    return (
        <tr>
            {
                Object.keys(content).map((key, i) => {
                    return (<td key={i}>{content[key]}</td>)
                })
            }
        </tr>
    );
}

Alert.propTypes = {
    content: PropTypes.object.isRequired
}

export default Alert;