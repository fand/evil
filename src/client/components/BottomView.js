import React from 'react';
import ClipView from './ClipView';
import DeviceView from './DeviceView';
import ViewAction from '../actions/ViewAction';

/**
* BottomView
* Manages switching ClipView / DeviceView.
*/
class BottomView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showArrangement : false,
      showSession     : true
    };

    this.showDevice = this.showDevice.bind(this);
    this.showClip = this.showClip.bind(this);
  }

  componentDidMount() {
    ViewAction.on('SHOW_DEVICE', this.showDevice);
    ViewAction.on('SHOW_CLIP', this.showClip);
  }

  render() {
    return (
      <div className="BottomView">
        <i className="fa fa-sliders btn btn-device" onClick={this.showDevice}></i>
        <i className="fa fa-music   btn btn-clip"   onClick={this.showClip}  ></i>
        <DeviceView song={this.props.song} isVisible={this.state.showDevice} selection={this.props.selection}
          device={this.props.device}/>
        <ClipView   song={this.props.song} isVisible={this.state.showClip}   selection={this.props.selection}
          clip={this.props.clip} />
      </div>
    );
  }

  // Control Visibility for each View.
  showDevice() {
    this.setState({
      showDevice: true,
      showClip: false
    });
  }

  showClip() {
    this.setState({
      showDevice: false,
      showClip: true
    });
  }
}

export default BottomView;
