import {createStore,combineReducers,applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import { authReducer, preloadReducer } from '../reducers';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const reducers = combineReducers({
    auth: authReducer,
    preload: preloadReducer
});


export const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware( thunk )
    )
);