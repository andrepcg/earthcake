import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { orderBy } from 'lodash';
import moment from 'moment';

import { getWeekEvents } from '../actions/events';

const invertDir = (curDir) => curDir === 'asc' ? 'desc' : 'asc';

export default class AllEvents extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    events:   PropTypes.object
  }

  state = {
    sortOrder: 'desc',
    sortColumn: 'time'
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

  renderTable() {
    const { events } = this.props;
    const { sortColumn, sortOrder } = this.state;

    const sortedEvents = orderBy(events.data, [sortColumn], [sortOrder]);
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

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="twelve columns">
            <h2 className="alt-header">All events</h2>
            {this.renderTable()}
          </div>
        </div>
      </div>
    );
  }
}
