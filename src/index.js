import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
//import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/configStore";
import ReactModal from 'react-modal';
import ModalsProvider from './components/modal/ModalsProvider';

ReactModal.setAppElement('#root');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ModalsProvider>
        <App />
      </ModalsProvider>
    </BrowserRouter>
  </Provider>
);