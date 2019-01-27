import React, { Component } from 'react'

export default class Image extends Component {

  render() {
    const { imageSrc, imageAlt, onClick, style } = this.props;
    return (
        <img
          className='Slide'
          style={style}
          src={imageSrc}
          alt={imageAlt}
          onClick={onClick}
        />
    )
  }
}
