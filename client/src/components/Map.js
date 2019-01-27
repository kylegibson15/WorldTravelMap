import React, { Component } from 'react';
import MapGL from 'react-map-gl';

export default class Map extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      viewport: {}
    }
  }

  render() {
    const {
      viewport,
      mapStyle,
      markers,
      mapboxApiAccessToken,
      onViewPortChange
    } = this.props;
    
    return (
      <MapGL
        {...viewport}
        mapStyle={mapStyle}
        onViewportChange={onViewPortChange}
        mapboxApiAccessToken={mapboxApiAccessToken}
      >
        {markers}
      </MapGL>
    );
  }
}
