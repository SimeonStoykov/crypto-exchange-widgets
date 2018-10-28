import { createStore, combineReducers, applyMiddleware } from 'redux';
import appReducer from './reducers/appReducer';
import tickerReducer from './reducers/tickerReducer';
import orderBookReducer from './reducers/orderBookReducer';
import thunk from 'redux-thunk';

const reducers = combineReducers({
    appReducer,
    tickerReducer,
    orderBookReducer
});

const store = createStore(
    reducers,
    applyMiddleware(thunk)
);

export default store;