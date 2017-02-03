import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

const NavBar = () => {
  return (
    <div className="row">
      <div className="twelve column">
        <div className="navbar">
          Navbar
        </div>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  children: PropTypes.element
};

export default NavBar;