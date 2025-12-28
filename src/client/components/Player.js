import React from 'react';

/**
 * Player
 * - Emits events about playing.
 */
class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Player">
        <i className="fa fa-play     btn"></i>
        <i className="fa fa-forward  btn"></i>
        <i className="fa fa-backward btn"></i>
        <i className="fa fa-repeat   btn"></i>
      </div>
    );
  }
}

export default Player;
