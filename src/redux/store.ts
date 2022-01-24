import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {noteReducer} from "./note-reducer";

const rootReducer = combineReducers({
    note: noteReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppRootType = ReturnType<typeof rootReducer>