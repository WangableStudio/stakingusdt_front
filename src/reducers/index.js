import { applyMiddleware, combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk";
import userReduser from "./userReducer";
//корневой редюсер
const rootReducer = combineReducers({
  user: userReduser,
});

//создание стора
export const store = configureStore(
  { reducer: rootReducer },
  composeWithDevTools(applyMiddleware(thunk))
);

//export const store=configureStore({reducer:rootReducer})
