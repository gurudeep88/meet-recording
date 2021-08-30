import { applyMiddleware, compose, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import thunk from "redux-thunk";
import { rootReducer } from "./reducers";

export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(promiseMiddleware, thunk)
  )
);

store.subscribe(()=>{
  localStorage.setItem('reduxState', JSON.stringify(store.getState().profile));
})
