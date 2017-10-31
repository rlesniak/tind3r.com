// @flow

import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { observer } from 'mobx-react';
import GoogleMap from 'google-map-react';
import NotificationSystem from 'react-notification-system';

import { CurrentUser } from 'models/CurrentUser';

import './LocationMap.scss';

type PropsType = {
  currentUser: CurrentUser,
};

const K_WIDTH = 10;
const K_HEIGHT = 10;

const greatPlaceStyle = {
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  borderRadius: K_HEIGHT,
  backgroundColor: '#0084ff',
};

const Marker = () => (
  <div className="marker">
    <div style={greatPlaceStyle} />
  </div>
);

@observer
class LocationMap extends Component {
  props: PropsType;
  notificationSystem: ?any;

  handleError = () => {
    if (this.notificationSystem) {
      this.notificationSystem.addNotification({
        level: 'error',
        position: 'tc',
        autoDismiss: 5,
        message: 'Position change not significant or you change too far in small amount of time. Try again later',
      });
    }

    ReactGA.event({
      category: 'Settings',
      action: 'Update location error',
    });
  }

  handleOnMapClick = ({ lat, lng }: Object) => {
    this.props.currentUser.updateLocation(lat, lng, this.handleError);

    ReactGA.event({
      category: 'Settings',
      action: 'Update location',
    });
  }

  render() {
    const { currentUser } = this.props;
    const center = [currentUser.pos.lat, currentUser.pos.lon];

    if (!currentUser.pos.lat) {
      return (
        <div className="location-map">
          <h1>To see map and to be able to change location, click save to fetch your current location.</h1>
        </div>
      );
    }

    return (
      <div className="location-map">
        <NotificationSystem ref={(ref) => { this.notificationSystem = ref; }} />

        <GoogleMap
          bootstrapURLKeys={{ key: 'AIzaSyDd3XG700RoXgHsnnu53gMz13gO8SOWqZc' }}
          center={center}
          zoom={12}
          onClick={this.handleOnMapClick}
        >
          <Marker lat={currentUser.pos.lat} lng={currentUser.pos.lon} />
        </GoogleMap>
      </div>
    );
  }
}

export default LocationMap;
