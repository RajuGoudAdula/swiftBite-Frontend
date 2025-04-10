// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import {Provider} from 'react-redux';
import {store} from './store/store.js';
import './index.css';

const clientId = '994958748375-d0saihca1d65bu4l37fukgn74ngtivff.apps.googleusercontent.com'; // Replace with your actual client ID

ReactDOM.render(
<Provider store={store}>
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
  </Provider>,
  document.getElementById('root')
);
