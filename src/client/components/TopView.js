import React from 'react';
import SessionView from './SessionView';
import ArrangementView from './ArrangementView';
import ViewAction from '../actions/ViewAction';

/**
* TopView
* Manages switching SessionView / ArrangementView.
*/
class TopView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showArrangement : false,
      showSession     : true
    };

    this.showSession = this.showSession.bind(this);
    this.showArrangement = this.showArrangement.bind(this);
  }

  componentDidMount() {
    ViewAction.on('SHOW_ARRANGEMENT', this.showArrangement);
    ViewAction.on('SHOW_SESSION', this.showSession);
  }

  render() {
    return (
      <div className="TopView">
        <i className="fa fa-bars btn btn-arrangement" onClick={this.showArrangement}></i>
        <i className="fa fa-bars btn btn-session"     onClick={this.showSession}    ></i>
        <SessionView song={this.props.song} isVisible={this.state.showSession} selection={this.props.selection}/>
        <ArrangementView song={this.props.song} isVisible={this.state.showArrangement} selection={this.props.selection}/>
      </div>
    );
  }

  showSession() {
    this.setState({
      showSession: true,
      showArrangement: false
    });
  }

  showArrangement() {
    this.setState({
      showSession: false,
      showArrangement: true
    });
  }
}

export default TopView;
