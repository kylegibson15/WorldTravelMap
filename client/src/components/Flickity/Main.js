import React, { Component } from 'react';
import Selector from './Selector/Selector'
import './style.css';

export default class Main extends Component {
  render() {
    const { bucketURL, currentImage, data } = this.props.data;
    const { zoomToLocation } = this.props;
    return (
      <div className="main">
        <Selector
          subSelector
          data={data}
          bucketURL={bucketURL}
          currentImage={currentImage}
          zoomToLocation={zoomToLocation}
        />
      </div>
    );
  }
}
