import { combineReducers } from 'redux';

import catalog from './catalog/reducer';
import cart from './cart/reducer';

export default combineReducers({
  catalog,
})