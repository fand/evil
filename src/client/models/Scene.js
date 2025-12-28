import Model from './Model';
import Clip from './Clip';
import _ from 'lodash';

/**
 * Scene - a row in SessionView.
 *
 * @param opts.name  String
 * @param clips [Clip]
 *
 */

class Scene extends Model {
  initialize (attrs) {
    this.attrs.name   = this.attrs.name || getSceneName();
  }

  toJSON () {
    var json = super.toJSON.apply(this);
    return json;
  }
}

var getSceneName = function () {
  var counter = 0;
  return function (num) {
    var suffix = (_.isUndefined(num)) ? counter++ : num;
    return 'Scene ' + suffix;
  };
}();

export default Scene;
