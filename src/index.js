import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { history } from './redux/configStore';
import { HistoryRouter as Router } from "redux-first-history/rr6";

import axios from "axios";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { store } from "./redux/configStore";
import ReactModal from 'react-modal';
import ModalsProvider from './components/modal/ModalsProvider';
import "bootstrap/dist/css/bootstrap.min.css";

export let persistor = persistStore(store);
axios.defaults.withCredentials = true; // withCredentials 전역 설정


ReactModal.setAppElement('#root');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router history={history}>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </Router>
    </PersistGate>

  </Provider>
);