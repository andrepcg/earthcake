import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';

import App from './components/App';
import AboutPage from './components/AboutPage';
import NotFoundPage from './components/NotFoundPage';
import Events from './containers/Events';
import Event from './components/Event';
import Location from './components/Location';
import AllEvents from './components/AllEvents';
import Find from './components/Find';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/events"/>
    <Route path="events" component={Events}>
      <IndexRoute component={AllEvents}/>
      <Route path="find" component={Find}/>
      <Route path="location/:country(/:city)" component={Location}/>
      <Route path=":id" component={Event}/>
    </Route>
    <Route path="about" component={AboutPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);