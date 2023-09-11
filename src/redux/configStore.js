import { combineReducers, applyMiddleware, compose } from "redux";
// import thunk from "redux-thunk";
// import { createBrowserHistory } from "history";
// import { connectRouter } from "connected-react-router";

import User from "./userApi";
import Team from "./teamApi";

// export const history = createBrowserHistory();

// const rootReducer = combineReducers({
//   user: User,
//   team: Team,
//   router: connectRouter(history),
// });

// const middlewares = [thunk.withExtraArgument({ history: history })];

// const env = process.env.NODE_ENV;

// //개발환경에서 logger 사용
// if (env === "development") {
//   const { logger } = require("redux-logger");
//   middlewares.push(logger);
// }
// //devTools 설정
// const composeEnhancers =
//   typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//       // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
//     })
//     : compose;

// //미들웨어 통합
// const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// //루트 리듀서와 미들웨어를 엮어 스토어 생성
// let store = (initialStore) => createStore(rootReducer, enhancer);

// export default store();
import { configureStore } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";

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
//개발환경에서 logger 사용
if (env === "development") {
  const { logger } = require("redux-logger");
  [routerMiddleware].push(logger);
  //미들웨어 통합
  enhancer = composeEnhancers(applyMiddleware([routerMiddleware, logger]));
}

export const store = configureStore({
  reducer: combineReducers({
    user: User,
    team: Team,
    router: routerReducer
  }),
  enhancer: enhancer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware),
});

export const history = createReduxHistory(store);