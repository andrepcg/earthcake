import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import { MAPBOX_TOKEN } from '../config';

import { getEventDetails } from '../actions/events';

const locationImage = (coordinates) =>
  `url(https://api.mapbox.com/v4/mapbox.satellite/${coordinates[0]},${coordinates[1]},9/1206x268.png?access_token=${mapbox_api})`;

export default class Event extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    params:   PropTypes.object,
    events:   PropTypes.object
  }

  state = {
    location: null
  }

  componentWillMount() {
    const { params: { id }, dispatch } = this.props;
    dispatch(getEventDetails(id));
  }

  getEvent() {
    const { params, events } = this.props;
    return events.data[params.id];
  }

  renderAttributes(event) {
    return (
      <div className="attributes">
        <div className="container">
          <div className="row">
            <div className="four columns box solid">Code</div>
            <div className="eight columns box">{event.code}</div>
          </div>
          <div className="row">
            <div className="four columns box solid">Depth</div>
            <div className="eight columns box">{event.depth} km</div>
          </div>
          <div className="row">
            <div className="four columns box solid">Time</div>
            <div className="eight columns box">{new Date(event.time).toLocaleString()}</div>
          </div>
          <div className="row">
            <div className="four columns box solid">Tsunami</div>
            <div className="eight columns box">{event.tsunami}</div>
          </div>
          <div className="row">
            <div className="four columns box solid">Felt</div>
            <div className="eight columns box">{event.felt ? event.felt : "No"}</div>
          </div>
          <div className="row">
            <div className="four columns box solid">Coordinates</div>
            <div className="eight columns box">Lat: {event.geometry.coordinates[1]}, Lng: {event.geometry.coordinates[0]}</div>
          </div>
          <div className="row">
            <div className="four columns box solid">Location</div>
            <div className="eight columns box">
              {event.location
                ? <div>
                    <Link to={`/events/location/${event.location.country.name}/${event.location.city.name}`}>{event.location.city.name}</Link>, 
                    <Link to={`/events/location/${event.location.country.name}`}>{event.location.country.name}</Link>
                  </div>
                : "Loading location"
              }
            </div>
          </div>
          <div className="row">
            <div className="four columns box solid">Types</div>
            <div className="eight columns box">{event.types.map((t) => `${t}, `)}</div>
          </div>
        </div>
      </div>
    );
  }

  renderEvent(event) {
    return (
      <div>
        <div className="location-image" style={{ backgroundImage: locationImage(event.geometry.coordinates) }}>
          <div className="container">
            <div className="row">
              <div className="ten columns">
                <h3 className="place">{event.place}</h3>
              </div>
            </div>
            <div className="row">
              <div className="ten columns">
                <span className="magnitude"><strong>Magnitude:</strong> {event.mag}</span>
              </div>
            </div>
          </div>
        </div>
        { this.renderAttributes(event) }
      </div>
    );
  }

  render() {
    const event = this.getEvent();

    return (
      <div className="event">
        { !event || event.isLoading
          ? "Loading..."
          : this.renderEvent(event)
        }
      </div>
    );
  }
}
