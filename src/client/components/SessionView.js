import React from 'react';
import classNames from 'classnames';
import SessionTrackView from './SessionTrackView';

/**
 * Session View
 */
class SessionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const selectionTable = this._getSelectionTable();

    const tracks = this.props.song.tracks.map((track, i) => {
      return (
        <SessionTrackView
          song={this.props.song} track={track}
          index={i} key={track.id} _key={track.id}
          selection={this.props.selection} selectionTable={selectionTable} />
      );
    });

    const classes = classNames({
      'SessionView': true,
      'visible': this.props.isVisible
    });

    return (
      <div className={classes}>
        <div className="SessionTrackViewWrapper">
          {tracks}
        </div>
      </div>
    );
  }

  _getSelectionTable() {
    const track = [];
    for (let x = 0; x < this.props.song.tracks.length; x++) {
      track.push(this.props.selection.currentTrack === x);
    }
    const scene = [];
    for (let y = 0; y < this.props.song.scenes.length; y++) {
      scene.push(this.props.selection.currentScene === y);
    }
    return {
      track: track,
      scene: scene
    };
  }
}

export default SessionView;
