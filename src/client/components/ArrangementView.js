import React from 'react';
import classNames from 'classnames';

/**
 * Arrangement View
 */
class ArrangementView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    //const tracks = this.props.song.tracks;

    const classes = classNames({
      'ArrangementView': true,
      'visible': this.props.isVisible
    });

    return (
      <div className={classes}>
        ArrangementView!!!!!!!
      </div>
    );
  }
}

export default ArrangementView;
