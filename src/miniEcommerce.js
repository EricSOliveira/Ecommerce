import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Auth0Provider } from '@auth0/auth0-react';

import Catalog from './Pages/Catalog/Catalog';
import Cart from './Pages/Cart/Cart';
import TemplateCard from './Pages/Payment/TemplateCard';

import './scss/miniEcommerce.scss';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

function MiniEcommerce() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Auth0Provider domain={domain} clientId={clientId} redirectUri={window.location.origin}>
            <Route path='/' exact component={Catalog} />
            <Route path='/cart' component={Cart} />
            <Route path='/payment' component={TemplateCard} />
          </Auth0Provider>
        </Switch>
      </Router>
    </Provider>
    
  );
}

export default MiniEcommerce;
