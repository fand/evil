import React from 'react';
import classNames from 'classnames';

/**
 * Device View
 * Edit Device (Synth, Instruments) parameters.
 */
class DeviceView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    //const effects = this.props.device.fx.map(f => f.render());
    const effects = '';

    const classes = classNames({
      'DeviceView': true,
      'visible': this.props.isVisible
    });

    return (
      <div className={classes}>
        deviceconfig
        {effects}
      </div>
    );
  }
}

export default DeviceView;
