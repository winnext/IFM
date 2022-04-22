import React from 'react';
import { Link } from 'react-router-dom';

export const Access = () => {
    return (
        <div className="exception-body access">
            <img src="assets/layout/images/logo-white.svg" alt="diamond-layout" className="logo" />

            <div className="exception-content">
                <div className="exception-title">ACCESS DENIED</div>
                <div className="exception-detail">You do not have the necessary permissions.</div>
                <Link to="/">Go to Dashboard</Link>
            </div>
        </div>
    );
}
