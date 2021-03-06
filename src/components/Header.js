import React, { PropTypes } from 'react';

const Header = () => {
  return (
    <div className="row">
      <div className="twelve column">
        <div className="header">
          <h1>earth 🍰</h1>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  children: PropTypes.element
};

export default Header;