import React, { PropTypes } from 'react';

import Header from './Header';
import NavBar from './NavBar';

const App = ({ children }) => {
  return (
    <div>
      <div className="container">
        <Header />
        <NavBar />
      </div>
      {children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;