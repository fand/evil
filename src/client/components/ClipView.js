import React from 'react';
import classNames from 'classnames';
import Knob from './Knob';

// import PatternConfig from './PatternConfig';
// import EnvelopeConfig from './EnvelopeConfig';
// import PatternEditor from './PatternEditor';
// import EnvelopeEditor from './EnvelopeEditor';

/**
 * CLip View
 * Show clip pattern editer and configs.
 */
class ClipView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'PATTERN'
    };
  }

  render() {
    if (this.props.clip == null) {
      return <div />;
    }
    // <PatternConfig clip={this.props.clip}/>
    // <EnvelopeConfig clip={this.props.clip}/>
    // <PatternEditor clip={this.props.clip}/>
    // <EnvelopeEditor clip={this.props.clip}/>
    //        <Knob name="pan" min="-128" max="127" center="C" size="80"/>

    const classes = classNames({
      'ClipView': true,
      'visible': this.props.isVisible
    });

    return (
      <div className={classes}>
        Name: {this.props.clip.get('name')}
        <Knob name="knob test" min="0" max="100" size="100"/>
      </div>
    );
  }
}

export default ClipView;
