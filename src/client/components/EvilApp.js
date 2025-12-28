import React from 'react';

// Components
import Header from './Header';
import Footer from './Footer';
import TopView from './TopView';
import BottomView from './BottomView';

// Stores
import SongStore from '../stores/SongStore';
// import SceneStore from '../stores/SceneStore';
// import ClipStore from '../stores/ClipStore';
// import DeviceStore from '../stores/DeviceStore';
import TrackStore from '../stores/TrackStore';
import ViewAction from '../actions/ViewAction';

// import Sequencer from '../services/Sequencer';
// import Player from '../services/Player';

/**
 * Entire app View
 * - Init the song
 * - Manages View modes
 */
class EvilApp extends React.Component {
  constructor(props) {
    super(props);

    const song = SongStore.getSong();
    this.state = {
      song          : song,
      currentTrack  : 0,
      currentScene  : 0,
      currentCell   : null,
      currentCellId : null
    };

    this.selectTrack = this.selectTrack.bind(this);
    this.selectScene = this.selectScene.bind(this);
    this.selectCell = this.selectCell.bind(this);
  }

  componentDidMount() {
    ViewAction.on('SELECT_TRACK', this.selectTrack);
    ViewAction.on('SELECT_SCENE', this.selectScene);
    ViewAction.on('SELECT_CELL', this.selectCell);
  }

  render() {
    const track = TrackStore.getTrack(this.state.currentTrack);  // TrackStore要らない……？？？
    let clip, device;
    if (track) {
      clip = track.clips[this.state.currentCell];
      device = track.device;
    }

    const selection = {
      currentTrack  : this.state.currentTrack,
      currentScene  : this.state.currentScene,
      currentCell   : this.state.currentCell,
      currentCellId : this.state.currentCellId
    };

    return (
      <div className="EvilApp">
        <Header />
        <TopView    song={this.state.song} selection={selection} />
        <BottomView song={this.state.song} selection={selection} clip={clip} device={device} />
        <Footer song={this.state.song} />
      </div>
    );
  }

  // Set states.
  selectTrack(index) {
    this.setState({currentTrack: index});
  }

  selectScene(index) {
    this.setState({currentScene: index});
  }

  selectCell(index, id) {
    this.setState({
      currentCell   : index,
      currentCellId : id
    });
  }
}

export default EvilApp;
