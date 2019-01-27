import React, { Component } from 'react';
import Flickity from 'flickity';
import FlickityTransformer from 'flickity-transformer'

const itemStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '30%',
  height: '260px',
  marginRight: '10px',
  marginLeft: '10px',
  borderRadius: '5px',
};

const imageStyle = {
  display: 'block',
  height: '160px',
  borderRadius: '5px',
}

export default class Selector extends Component {
  state = {
    selectedIndex: 5
  };

  flkty = null;
  scrollAt = null;

  componentDidMount() {
    const { data } = this.props;
    this.scrollAt = 1 / (data.length);

    setTimeout(this.initFlickity, 1000);
  }

  componentWillUnmount() {
    if (this.flkty) {
      this.flkty.destroy();
    }
  };

  initFlickity = () => {
    const { currentImage } = this.props;
    const options = {
      cellSelector: '.item',
      contain: false,
      initialIndex: currentImage,
      accessibility: false,
      pageDots: false,
      wrapAround: true,
      prevNextButtons: false
    }

    this.flkty = new Flickity(this.wrapper, options);
    const transformer = new FlickityTransformer(this.flkty, [
  {
    name: 'scale',
    stops: [
      [-300, 0.5],
      [0, 0.8],
      [300, 0.5]
    ]
  },
  {
    name: 'translateY',
    stops: [
      [-1000, 500],
      [0, 0],
      [1000, 500]
    ]
  },
  {
    name: 'rotate',
    stops: [
      [-300, -30],
      [0, 0],
      [300, 30]
    ]
  },
  {
    // Declare perspective here, before rotateY. At least two stops are required, hence the duplication.
    name: 'perspective',
    stops: [
      [0, 600],
      [1, 600]
    ]
  },
  {
    name: 'rotateY',
    stops: [
      [-300, 45],
      [0, 0],
      [300, -45]
    ]
  }
])

    this.flkty.on('dragStart', this.dragStart);
    this.flkty.on('dragEnd', this.dragEnd);
    this.flkty.on('staticClick', this.staticClick);
    this.flkty.on('scroll', this.onScroll);
    this.flkty.on('settle', this.onSettle);
  };

  handleClick = (e) => {
    let altArr = e.target.alt.split(' ');
    let lat = altArr[0];
    let long = altArr[1];
    this.props.zoomToLocation(parseFloat(lat, 10), parseFloat(long, 10));
  }

  staticClick = (event, pointer, cellElement, cellIndex) => {
    const { currentImage } = this.props;
    cellIndex = currentImage;
    this.allowClick = false;
    this.slideTo(cellIndex, true);
    this.flkty.selectCell(cellIndex);
  };

  onSettle = () => {
    const selectedIndex = this.flkty.selectedIndex;
    if (this.state.selectedIndex !== selectedIndex) {
      this.setState({
        selectedIndex: selectedIndex,
      });
    }
  };

  prevScroll = false;

  onScroll = (scroll, sub = false) => {

    if (this.dragStarted === false) {
      return;
    }

    let direction = false;

    if (this.prevScroll !== false) {
      direction = (scroll < this.prevScroll) ? 'right' : 'left';
    }

    const boundaries = {
      left: this.scrollAt * (this.state.selectedIndex),
      right: (this.scrollAt * (this.state.selectedIndex + 1)) - (this.scrollAt / 2),
    }

    if (scroll > boundaries.right && direction === 'left') {
      const next = this.state.selectedIndex += 1;
      this.setState({
        selectedIndex: next,
      });

      if (sub) {
        this.slideTo(next, false);
      }
    }

    if (scroll < boundaries.left && direction === 'right' && this.state.selectedIndex !== 0) {
      const prev = this.state.selectedIndex -= 1;
      this.setState({
        selectedIndex: prev,
      });

      if (sub) {
        this.slideTo(prev, false);
      }
    }

    this.prevScroll = scroll;
  };

  slideTo = (index, updateState = true) => {
    this.flkty.selectCell(index);

    if (updateState) {
      this.setState({
        selectedIndex: index,
      });
    }
  };

  onSubSettle = index => {
    if (this.flkty.selectedIndex !== index) {
      this.slideTo(index, false);
    }
  };

  dragStarted = false;

  dragStart = e => {
    this.dragStarted = true;
  };

  dragEnd = e => {
    this.dragStarted = false;
  };

  render() {
    const { bucketURL, data, currentImage } = this.props;
    if(currentImage !== this.state.selectedIndex){
      this.setState({
        selectedIndex: currentImage
      })
      this.staticClick()
    }
    return (
      <div>
        <div ref={c => this.wrapper = c}>
          {data.map(item =>
            <div key={item.link} style={itemStyle} className="item">
              <img
                className="inner"
                src={bucketURL + item.link}
                alt={item.lat + ' ' + item.long}
                style={imageStyle}
                onClick={this.handleClick}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}
