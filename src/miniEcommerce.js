import './scss/miniEcommerce.scss';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './store';

import Catalog from './Pages/Catalog/Catalog';
import Cart from './Pages/Cart/Cart';

function MiniEcommerce() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path='/' exact component={Catalog} />
          <Route path='/cart' component={Cart} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default MiniEcommerce;
