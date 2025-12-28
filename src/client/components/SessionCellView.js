import React from 'react';
import classNames from 'classnames';
import ViewAction from '../actions/ViewAction';

/**
 * Empty Cell View in Session View
 */
class SessionCellView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  render() {
    const classes = classNames({
      'SessionCellView' : true,
      'cell'            : true,
      'bodyCell'        : true,
      'selectedCell'    : this.props.selection.currentCellId === this.props._key,
      'selectedScene'   : this.props.selectionTable.scene[this.props.index]
    });

    return (
      <div className={classes}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick} >
      </div>
    );
  }

  onClick() {
    ViewAction.selectCell(this.props.index, this.props._key);
    ViewAction.selectScene(this.props.index);
  }

  onDoubleClick() {
    console.log('doubleclickkkkk');
    // ClipsAction.addClip();
    // ClipsAction.editClip();
    ViewAction.selectCell(this.props.index, this.props._key);
  }
}

export default SessionCellView;
