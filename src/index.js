import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { store } from './reducers'
import { Provider } from 'react-redux'
import './assets/font/stylesheet.css'
import {Toaster} from "react-hot-toast";
ReactDOM.render(
    <Provider store={store}>
        <Toaster/>
        <App />
    </Provider>,
    document.getElementById('root')
)

