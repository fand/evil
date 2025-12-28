import Model from './Model';

/**
 * Clip - a set of phrase, parameter automation.
 *
 * @attr name String - Clip name.
 * @attr length number - length
 *
 */
class Clip extends Model {
  initialize (attrs) {
    //this.pattern = this.attrs.pattern.map(p => );
  }

  validate (attrs) {
    attrs.name = attrs.name || '';
    attrs.length = attrs.length || 1;
    return attrs;
  }
}

export default Clip;
