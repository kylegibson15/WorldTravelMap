import React, { Component } from 'react';
import axios from 'axios';
import { Marker, FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import DeckGL from 'deck.gl';

import Map from './components/Map';
import Main from './components/Flickity/Main';

import { styles } from './styles/styles';
import { map_styles } from './styles/map_styles';
import { config } from './config';

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      data: [],
      bucketURL: config.bucketURL,
      mapboxApiAccessToken: config.mapboxApiAccessToken,
      mapStyle: map_styles.moonlight_mode[0],
      pin_color: map_styles.moonlight_mode[1],
      markers: [],
      viewport: {
        width: '100vw',
        height: '100vh',
        latitude: 40.29,
        longitude: 10.51,
        zoom: 1.3
      },
      currentImage: 5
    };
    this.goToPin = this.goToPin.bind(this)
  }

  componentDidMount() {
    this.callBackendAPI()
    this.loopImages()
  }

  callBackendAPI = () => {
    axios.get('/list_objects')
      .then(res => {
        this.setState({ data: res.data })
      })
  }

  loopImages = () => {
    setInterval(() => {
      const { data, currentImage } = this.state;
      this.goToPin(data[currentImage + 1].lat, data[currentImage + 1].long);

      if (data && data.length - 1 !== currentImage) {
        this.setState({currentImage: currentImage + 1})
      } else {
        this.setState({currentImage: 0})
      }
    }, 20000);
  }

  goToPin = (lat, long) => {
        const viewport = {
            ...this.state.viewport,
            longitude: long,
            latitude: lat,
            zoom: 17,
            pitch: 30,
            transitionDuration: 8000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: easeCubic
        };
        this.setState({viewport});
        setTimeout(() => {
          const viewport = {
            ...this.state.viewport,
            latitude: 40.29,
            longitude: 10.51,
            zoom: 1.1,
            pitch: 0,
            transitionDuration: 8000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: easeCubic
          }
          this.setState({viewport})
        }, 10000)
    };

  toggleFullscreen = () => {
    let elem = document.getElementById("root");
    elem.requestFullscreen()
    // if (!document.fullscreenElement) {
    //   elem.requestFullscreen().then({}).catch(err => {
    //     alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    //   });
    //   this.loopImages()
    // } else {
    //   document.exitFullscreen();
    // }
  }

  render() {
    const {
      data,
      viewport,
      mapboxApiAccessToken,
      mapStyle,
      pin_color
    } = this.state;
    const markers = data.map(image => {
        return <Marker
          latitude={image.lat}
          longitude={image.long}
          offsetLeft={-10}
          offsetTop={-10}
        >
          <img
            onClick={() => this.goToPin(image.lat, image.long)} alt={image.link}
            src={pin_color}
            height={`10px`}
          />
        </Marker>
    })
    return (
      <div style={styles.App} >
        <Map
          data={data}
          viewport={viewport}
          mapboxApiAccessToken={mapboxApiAccessToken}
          mapStyle={mapStyle}
          maxPitch={85}
          onViewPortChange={(viewport) => this.setState({viewport})}
          markers={markers}
        >
        <DeckGL {...viewport} layers={[]}/>
      </Map>
      <Main
        data={this.state}
        zoomToLocation={this.goToPin}
      />
      </div>
    );
  }
}

export default App;
