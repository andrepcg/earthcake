import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { orderBy, filter } from 'lodash';
import moment from 'moment';
import ReactList from 'react-list';

import ReactMapboxGl, { Layer, Feature, GeoJSONLayer } from "react-mapbox-gl";

import { getWeekEvents, getAllEvents } from '../actions/events';
import { MAPBOX_PUBLIC_TOKEN, blurPaint, dotPaint } from '../config';
import { convertToGeoJson } from '../util/geojson';

const invertDir = (curDir) => curDir === 'asc' ? 'desc' : 'asc';


export default class AllEvents extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    events:   PropTypes.object,
    params:   PropTypes.object,
    router:   PropTypes.object
  }

  state = {
    sortOrder: 'desc',
    sortColumn: 'time',
    currentTimeframe: 'Week'
  }

  componentWillMount() {
    this.props.dispatch(getWeekEvents());
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

  renderTable(events) {
    const { sortColumn, sortOrder } = this.state;

    const sortedEvents = orderBy(events, [sortColumn], [sortOrder]);

    const renderItem = (index, key) => {
      const ev = sortedEvents[index];
      return (
        <div key={key} className="row">
          <div className="three columns">{moment(ev.time).format()}</div>
          <div className="two columns">{ev.mag || "Unavailable"}</div>
          <div className="five columns">{ev.place}</div>
          <div className="two columns"><Link to={`/events/${ev.id}`}>Details</Link></div>
        </div>
      );
    }

    return (
      <div className="events-table">
        <div className="row header">
          <div className="three columns" onClick={() => this.handleColumnClick('time')}>Time {sortColumn === 'time' ? (sortOrder === 'asc' ? '⬆' : '⬇') : ''}</div>
          <div className="two columns" onClick={() => this.handleColumnClick('mag')}>Magnitude {sortColumn === 'mag' ? (sortOrder === 'asc' ? '⬆' : '⬇') : ''}</div>
          <div className="five columns">Place</div>
          <div className="two columns"/>
        </div>
        <ReactList
          itemRenderer={renderItem}
          length={sortedEvents.length}
          type='uniform'
        />
      </div>
    );
  }


  renderMap(events) {
    const { router } = this.props;

    const handleOnHover = ({ map }, cursor) => {
      map.getCanvas().style.cursor = cursor;
    }

    const points = events.map((event) => (
      <Feature
        key={event.id}
        coordinates={event.geometry.coordinates}
        onClick={() => router.push(`/events/${event.id}`)}
        onHover={(o) => handleOnHover(o, "pointer")}
        onEndHover={(o) => handleOnHover(o, "")}
      />
    ));

    const geoJson = convertToGeoJson(events);

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
    if (timeframe === "All time") {
      this.props.dispatch(getAllEvents());
    }
    this.setState({ currentTimeframe: timeframe });
  }

  render() {
    const { currentTimeframe } = this.state;

    const events = this.getEventsForTimeframe(currentTimeframe, this.props.events.data);

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

        {this.renderMap(events)}

        <div className="container">
          {this.renderTable(events)}
        </div>
      </div>
    );
  }
}
