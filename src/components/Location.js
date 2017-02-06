import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import { locationToCoordinates, locationImage } from '../util/geocode';


import moment from 'moment';

export default class Location extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    params:   PropTypes.object,
    events:   PropTypes.object
  }

  componentWillMount() {
    const { params: { country, city } } = this.props;
    locationToCoordinates(country, city).then((geo) => {
      this.setState({ geo });
    });

  }

  renderLoading() {
    return (
      <div className="container loading">
        Loading
      </div>
    );
  }

  renderTable() {
    const { events: { data, nearby } } = this.props;

    const selectedEvents = nearby.data.map((event_id) => data[event_id]);
    return (
      <table className="u-full-width events">
        <thead>
          <tr>
            <th>Time</th>
            <th>Magnitude</th>
            <th>ID</th>
            <th>Place</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          { selectedEvents.map((ev) => 
            <tr key={ev.id}>
              <td>{moment(ev.time).format()}</td>
              <td>{ev.mag}</td>
              <td>{ev.id}</td>
              <td>{ev.place}</td>
              <th><Link to={`/events/${ev.id}`}>Details</Link></th>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  renderContent() {
    const { geo } = this.state;
    const { params: { city, country } } = this.props;

    const image = geo
      ? locationImage({lat: geo.coordinates[0], lng: geo.coordinates[1]})
      : locationImage({lat: 30, lng: 80, zoom: 2});
    return (
      <div>
        <div
          className="location-image"
          style={{ backgroundImage: image }}
        >
          <div className="container">
            <div className="row">
              <div className="ten columns">
                <h3>{city}</h3>
              </div>
            </div>
            <div className="row">
              <div className="ten columns">
                <span>{country}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          {this.renderTable()}
        </div>
      </div>
    );
  }

  render() {
    const { events: { nearby } } = this.props;
    return (
      <div className="event">
        { nearby.isLoading
          ? this.renderLoading()
          : this.renderContent()
        }
      </div>
    );
  }
}
