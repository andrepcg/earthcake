import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const NavBar = () => {
  return (
    <div className="row">
      <div className="twelve column">
        <div className="navbar">
          <Link to="/events/" className="button">Events</Link>
          <Link to="/events/find" className="button">Find</Link>
        </div>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  children: PropTypes.element
};

export default NavBar;