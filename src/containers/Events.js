import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getWeekEvents } from '../actions/events';
import { coordinatesToLocation } from '../util/geocode';

@connect(({ events }) => ({
  events
}))
export default class Events extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    children: PropTypes.node
  }

  componentWillMount() {
    // coordinatesToLocation(40.2033145, -8.41025730).then(res => console.log(res));
  }

  render() {
    const { dispatch, events } = this.props;
    return React.cloneElement(this.props.children, { dispatch, events });
  }
}
