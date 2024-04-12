import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position:"relative" }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Loader;
