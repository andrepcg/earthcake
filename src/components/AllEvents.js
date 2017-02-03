import React, { Component, PropTypes } from 'react';

import { getWeekEvents } from '../actions/events';

export default class AllEvents extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    events:   PropTypes.object
  }

  componentWillMount() {
    this.props.dispatch(getWeekEvents());
  }

  render() {
    return (
      <div>
        <h2 className="alt-header">All events</h2>
      </div>
    );
  }
}
