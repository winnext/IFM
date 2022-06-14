import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="exception-body notfound">
      <img
        src="assets/layout/images/logo-white.svg"
        alt="diamond-layout"
        className="logo"
      />

      <div className="exception-content">
        <div className="exception-title">NOT FOUND</div>
        <div className="exception-detail">
          Requested resource is not available.
        </div>
        <Link to="/">Go to Dashboard</Link>
      </div>
    </div>
  );
};
