import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const NavBar = () => {
  return (
    <div className="row">
      <div className="twelve column">
        <div className="navbar">
          <Link to="/events/">Home</Link>
          <Link to="/events/find">Find</Link>
        </div>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  children: PropTypes.element
};

export default NavBar;