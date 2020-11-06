import React from 'react';
import ReactDOM from 'react-dom';
import '../src/scss/index.scss';
import MiniEcommerce from './miniEcommerce';

import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
  <React.StrictMode>
    <MiniEcommerce />
  </React.StrictMode>,
  document.getElementById('root')
);
