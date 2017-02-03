import React, { PropTypes, Component } from 'react';

import { locationToCoordinates } from '../util/geocode';
import { getNearby } from '../actions/events';

const cityRadius = 100 * 1000; // km
const countryRadius = 1000 * 1000; // km

export default class Location extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    params:   PropTypes.object,
    events:   PropTypes.object
  }

  componentWillMount() {
    const { params: { country, city }, dispatch } = this.props;
    locationToCoordinates(country, city).then((geo) => {
      this.setState({ geo });
      dispatch(getNearby(geo.coordinates, city ? cityRadius : countryRadius));
    });

  }

  renderLoading() {
    const { events: { data, nearby } } = this.props;
    return <div>"Loading..."</div>;
  }

  renderContent() {
    const { events: { data, nearby } } = this.props;
    return (
      <div>
        {nearby.data}
      </div>
    );
  }

  render() {
    const { params, events: { nearby } } = this.props;
    return (
      <div>
        <p>Country: { params.country }</p>
        <p>City: { params.city }</p>
        { nearby.isLoading
          ? this.renderLoading()
          : this.renderContent()
        }
      </div>
    );
  }
}
