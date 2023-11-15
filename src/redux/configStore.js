import { combineReducers, applyMiddleware, compose } from "redux";
import User from "./userApi";
import Team from "./teamApi";
import Matching from './matchApi'
import { configureStore } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
import { persistReducer } from "redux-persist";

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({ history: createBrowserHistory() });

const env = process.env.NODE_ENV;
//devTools 설정
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    })
    : compose;

let enhancer = composeEnhancers(applyMiddleware(routerMiddleware));
//FIXME - logger 안나옴
//개발환경에서 logger 사용
if (env === "development") {
  const { logger } = require("redux-logger");
  [routerMiddleware].push(logger);
  //미들웨어 통합
  enhancer = composeEnhancers(applyMiddleware([routerMiddleware, logger]));
}

const reducers = combineReducers({
  user: User,
  team: Team,
  matching: Matching,
  router: routerReducer
});

const persistConfig = {
  key: "root",
  storage: storageSession, // 세션 스토리지 사용
  timeout: 0, // 타임아웃을 0으로 설정하여 브라우저를 닫거나 재부팅 시 초기화
};
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  enhancer: enhancer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(routerMiddleware),
});

export const history = createReduxHistory(store);