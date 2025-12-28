import React from 'react';
import classNames from 'classnames';
import SessionClipView from './SessionClipView';
import SessionCellView from './SessionCellView';
import ViewAction from '../actions/ViewAction';

// Caches for empty cells
let _id = 1;
const _emptyCellIds = {};

/**
 * Session View
 */
class SessionTrackView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.onClick = this.onClick.bind(this);
  }

  componentWillUnmount() {
    delete _emptyCellIds[this.props.key];
  }

  render() {
    const isTrackSelected = this.props.selectionTable.track[this.props.index];

    const cells = [];
    for (let i = 0; i < this.props.song.scenes.length; i++) {
      if (this.props.track.clips[i]) {
        const clip = this.props.track.clips[i];
        cells.push(<SessionClipView clip={clip} trackIndex={this.props.index} index={i} key={clip.id} _key={clip.id}
          selection={this.props.selection} selectionTable={this.props.selectionTable}/>);
      }
      else {
        _emptyCellIds[this.props._key] = _emptyCellIds[this.props._key] || [];
        _emptyCellIds[this.props._key][i] = _emptyCellIds[this.props._key][i] || _id++;
        const id = _emptyCellIds[this.props._key][i];

        cells.push(
          <SessionCellView trackIndex={this.props.index} index={i} key={id} _key={id}
            selection={this.props.selection} selectionTable={this.props.selectionTable}/>
        );
      }
    }

    const classes = classNames({
      'SessionTrackView' : true,
      'selectedTrack'    : isTrackSelected
    });

    return (
      <div className={classes} onClick={this.onClick} >
        <div className="SessionTrackHeader cell headerCell" >
          {this.props.track.get('name')}
        </div>
        {cells}
      </div>
    );
  }

  onClick() {
    console.log('clicked!');
    ViewAction.selectTrack(this.props.index);
  }
}

export default SessionTrackView;
