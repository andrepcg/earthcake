import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// import { getWeekEvents } from '../actions/events';

@connect(({ events }) => ({
  events
}))
export default class Events extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    children: PropTypes.node,
    events:   PropTypes.object
  }

  render() {
    const { dispatch, events } = this.props;
    return React.cloneElement(this.props.children, { dispatch, events });
  }
}
