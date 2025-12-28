import React from 'react';

/**
 * Footer
 * - Show Player
 * - Show song title / playlist name / artist name.
 */
class SongInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="SongInfo">
        <ul>
          <li>title: {this.props.song.get('title')}</li>
          <li>artist: {this.props.song.get('artist')}</li>
        </ul>
      </div>
    );
  }
}

export default SongInfo;
