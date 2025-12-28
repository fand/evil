import { Dispatcher as FluxDispatcher } from 'flux';
import { PayloadSources } from './Constants';

class Dispatcher extends FluxDispatcher {

  /**
   * @param {object} action The details of the action, including the action's
   * type and additional data coming from the server.
   */
  handleServerAction (action) {
    const payload = {
      source: PayloadSources.SERVER_ACTION,
      action: action
    };
    this.dispatch(payload);
  }

  /**
   * @param {object} action The details of the action, including the action's
   * type and additional data coming from the view.
   */
  handleViewAction (action) {
    const payload = {
      source: PayloadSources.VIEW_ACTION,
      action: action
    };
    this.dispatch(payload);
  }

}

export default new Dispatcher();
