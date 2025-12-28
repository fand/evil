import React from 'react';
import Player from './Player';
import SongInfo from './SongInfo';

/**
 * Footer
 * - Show Player
 * - Show song title / playlist name / artist name.
 */
class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Footer">
        <Player />
        <SongInfo song={this.props.song} />
      </div>
    );
  }
}

export default Footer;
