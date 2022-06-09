import React from 'react';
import { Link } from 'react-router-dom';

export const Error = () => {

    return (
        <div className="exception-body error">
            <img src="assets/layout/images/logo-white.svg" alt="diamond-layout" className="logo" />

            <div className="exception-content">
                <div className="exception-title">ERROR</div>
                <div className="exception-detail">Something went wrong.</div>
                <Link to="/">Go to Dashboard</Link>
            </div>
        </div>
    );
}
