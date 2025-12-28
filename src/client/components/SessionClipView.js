import React from 'react';
import classNames from 'classnames';
import ViewAction from '../actions/ViewAction';

/**
 * Clip View in Session View
 */
class SessionClipView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.onClickPlay = this.onClickPlay.bind(this);
    this.onClickClip = this.onClickClip.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  render() {
    const classes = classNames({
      'SessionClipView' : true,
      'cell'            : true,
      'bodyCell'        : true,
      'selectedCell'    : this.props.selection.currentCellId === this.props._key,
      'selectedScene'   : this.props.selectionTable.scene[this.props.index]
    });

    return (
        <div className={classes} draggable>
          <div className="SessionClipView-play"
            onClick={this.onClickPlay}></div>
          <div className="SessionClipView-name"
            onClick={this.onClickClip}
            onDoubleClick={this.onDoubleClick}>
            {this.props.clip.get('name')}
          </div>
        </div>
    );
  }

  onClickPlay() {
    console.log('yoyaku: ' + this.props.trackIndex + ' - ' + this.props.index);
  }

  onClickClip() {
    ViewAction.selectCell(this.props.index, this.props._key);
    ViewAction.selectScene(this.props.index);
  }

  onDoubleClick() {
    console.log('doubleclickkkkk');
  }
}

export default SessionClipView;
