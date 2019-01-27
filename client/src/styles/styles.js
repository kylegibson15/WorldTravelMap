export const styles = {
  App: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexFlow: 'flex-start',
    width: '100vw',
    overflow: 'hidden'
  },
  Map: {
    height: '100vh',
    width: '100vw',
  },
  ImageSection: {
    position: 'absolute',
    top: '0',
    right: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexFlow: 'column',
    height: '100vh',
    width: '25vw',
    padding: '10px',
    overflow: 'scroll',
    zIndex: '1',
    backgroundColor: 'rgba(0, 0, 0, .5)'
  },
  ImageSectionFlickity: {
    display: 'flex',
    position: 'absolute',
    bottom: '0',
    flexFlow: 'row',
    alignItems: 'center',
    width: '100vw',
    height: '35vh',
    padding: '10px',
    overflow: 'scroll',
    zIndex: '1',
    backgroundColor: 'rgba(0, 0, 0, .5)'
  },
  ImageContainer: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
    height: 'auto',
    width: 'auto'
  },
  Image: {
    width: '50%',
    margin: '5px'
  },
  ImageFlickity: {
    height: '50%',
    width: 'auto',
    marginLeft: '5px'
  }
}
