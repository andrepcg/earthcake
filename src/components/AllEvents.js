import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { orderBy, filter } from 'lodash';
import moment from 'moment';

import ReactMapboxGl, { Layer, Feature, Popup, GeoJSONLayer } from "react-mapbox-gl";

import { getWeekEvents, getAllEvents } from '../actions/events';
import { MAPBOX_PUBLIC_TOKEN, blurPaint, dotPaint } from '../config';
import { convertToGeoJson } from '../util/geojson';

const invertDir = (curDir) => curDir === 'asc' ? 'desc' : 'asc';


export default class AllEvents extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    events:   PropTypes.object,
    params:   PropTypes.object
  }

  state = {
    sortOrder: 'desc',
    sortColumn: 'time',
    currentTimeframe: 'Week',
    filteredEvents: []
  }

  componentWillMount() {
    this.props.dispatch(getWeekEvents());
  }

  componentWillReceiveProps(nextProps) {
    const { currentTimeframe } = this.state;
    const { events: { data } } = this.props;

    if (Object.keys(data).length !== Object.keys(nextProps.events.data).length) {
      this.setState({
        filteredEvents: this.getEventsForTimeframe(currentTimeframe, nextProps.events.data)
      });
    }
  }

  handleColumnClick(column) {
    const { sortColumn, sortOrder } = this.state;
    this.setState({
      sortColumn: column,
      sortOrder: sortColumn === column ? invertDir(sortOrder) : sortOrder
    });
  }

  getEventsForTimeframe(currentTimeframe, data) {
    let timeframe;
    if (currentTimeframe === "Day")
      timeframe = moment().subtract(1, "days");
    else if (currentTimeframe === "Week")
      timeframe = moment().subtract(1, "weeks");
    else if (currentTimeframe === "Month")
      timeframe = moment().subtract(1, "months");
    else
      timeframe = moment().subtract(1, "years");

    return filter(data, ({time}) => time >= timeframe);
  }

  renderTable() {
    const { sortColumn, sortOrder, filteredEvents } = this.state;

    const sortedEvents = orderBy(filteredEvents, [sortColumn], [sortOrder]);

    return (
      <table className="u-full-width events">
        <thead>
          <tr>
            <th onClick={() => this.handleColumnClick('time')}>Time {sortColumn === 'time' ? (sortOrder === 'asc' ? '⬆' : '⬇') : ''}</th>
            <th onClick={() => this.handleColumnClick('mag')}>Magnitude {sortColumn === 'mag' ? (sortOrder === 'asc' ? '⬆' : '⬇') : ''}</th>
            <th>ID</th>
            <th>Place</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          { sortedEvents.map((ev) => 
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


  renderMap() {
    const { filteredEvents } = this.state;
    const points = filteredEvents.map((event) => (
      <Feature
        key={event.id}
        coordinates={event.geometry.coordinates}
      />
    ));

    const geoJson = convertToGeoJson(filteredEvents);

    return (
      <ReactMapboxGl
        style="mapbox://styles/andrepcg/ciyrpfsw8005m2rplk8ekcz8f"
        maxZoom={15}
        accessToken={MAPBOX_PUBLIC_TOKEN}
        containerStyle={{width: "100vw", height: "400px"}}
        center={[180, 30]}
        // maxBounds={maxBounds}
        zoom={[1]}
      >
        <GeoJSONLayer
          data={geoJson}
          circlePaint={blurPaint}
        />
        <Layer
          type="circle"
          id="smalldot"
          paint={dotPaint}
        >
          { points }
        </Layer>
      </ReactMapboxGl>
    );
  }

  handleTimeframeChange(timeframe) {
    const { currentTimeframe } = this.state;
    const { events } = this.props;

    if (timeframe === "All time") {
      this.props.dispatch(getAllEvents());
    }
    const newState = { currentTimeframe: timeframe };

    if (timeframe !== currentTimeframe) {
      newState.filteredEvents = this.getEventsForTimeframe(timeframe, events.data);
    }

    this.setState(newState);
  }

  render() {
    const { currentTimeframe } = this.state;
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="twelve columns">
              <div className="timeframe u-pull-right">
              { ['Day', 'Week', 'Month'].map((t) =>
                <a
                  key={t}
                  onClick={() => this.handleTimeframeChange(t)}
                  className={currentTimeframe === t ? 'strong' : ''}
                >
                  {t}
                </a>
              )}
              </div>
              <h2 className="alt-header"><strong>{this.state.currentTimeframe} events</strong></h2>
            </div>
          </div>
        </div>

        {this.renderMap()}

        <div className="container">
          <div className="row">
            <div className="twelve columns">
              {this.renderTable()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
