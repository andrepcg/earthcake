import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import ReactList from 'react-list';

import { getNearby, clearNearby } from '../actions/events';

export default class Find extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    events:   PropTypes.object,
    params:   PropTypes.object,
    router:   PropTypes.object
  }

  state = {
    radius: "",
    latitude: "",
    longitude: "",
    hasSubmited: false
  }

  componentWillMount() {
    this.props.dispatch(clearNearby());
  }

  search(e) {
    e.preventDefault();
    const { latitude, longitude, radius } = this.state;
    this.props.dispatch(getNearby(latitude, longitude, Number(radius) * 1000));
    this.setState({ hasSubmited: true });
  }

  changeField(event, field) {
    this.setState({ [field]: event.target.value });
  }

  renderResults() {
    const { events: { data, nearby }} = this.props;
    const { hasSubmited } = this.state;

    const list = nearby.data.map((id) => data[id]);

    if (!hasSubmited) return;
    if (hasSubmited) {
      if (nearby.isLoading) {
        return <h3>Searching...</h3>;
      }
      else if (list.length === 0) {
        return <h3>No results</h3>;
      }

    }

    const renderItem = (index, key) => {
      const ev = list[index];
      return (
        <div key={key} className="row">
          <div className="three columns">{moment(ev.time).format()}</div>
          <div className="two columns">{ev.mag || "Unavailable"}</div>
          <div className="five columns">{ev.place}</div>
          <div className="two columns"><Link to={`/events/${ev.id}`}>Details</Link></div>
        </div>
      );
    };

    return (
      <div className="events-table">
        <div className="row header">
          <div className="three columns">Time</div>
          <div className="two columns">Magnitude</div>
          <div className="five columns">Place</div>
          <div className="two columns"/>
        </div>
        <ReactList
          itemRenderer={renderItem}
          length={list.length}
          type="uniform"
        />
      </div>
    );
  }

  render() {
    const { latitude, longitude, radius } = this.state;
    return (
      <div className="container">
        <h2>Find events</h2>
        <form>
          <div className="row">
            <div className="four columns">
              <label>Latitude</label>
              <input onChange={(e) => this.changeField(e, "latitude")} value={latitude} className="u-full-width" type="text" placeholder="40.1430684" id="latitude"/>
            </div>
            <div className="four columns">
              <label>Longitude</label>
              <input onChange={(e) => this.changeField(e, "longitude")} value={longitude} className="u-full-width" type="text" placeholder="-8.5090891" id="longitude"/>
            </div>
            <div className="four columns">
              <label>Radius (in km)</label>
              <input onChange={(e) => this.changeField(e, "radius")} value={radius} className="u-full-width" type="text" placeholder="20" id="radius"/>
            </div>
          </div>
          <input onClick={(e) => this.search(e)} className="button-primary" type="submit" value="Search"/>
        </form>

        <div className="row">
          {this.renderResults()}
        </div>

      </div>
    );
  }
}
