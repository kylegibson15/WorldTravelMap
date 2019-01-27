import React, { Component } from 'react';

import Image from './Image';
import { styles } from '../styles/styles';

export default class ImageSection extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e){
    let altArr = e.target.alt.split(' ');
    let lat = altArr[0];
    let long = altArr[1];
    this.props.zoomToLocation(parseFloat(lat, 10), parseFloat(long, 10));
  }

  render() {
    const { data, bucketURL, currentImage } = this.props.data

    return (
      <div style={styles.ImageSectionFlickity}>
        {data.map(image =>{
            return <Image
              styles={styles}
              imageSrc={bucketURL + image.link}
              imageAlt={image.lat + ' ' + image.long}
              onClick={this.handleClick}
            />
        })}
      </div>
    )
  }
}
