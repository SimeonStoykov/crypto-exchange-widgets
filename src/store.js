import { createStore, combineReducers, applyMiddleware } from 'redux';
import appReducer from './reducers/appReducer';
import tickerReducer from './reducers/tickerReducer';
import orderBookReducer from './reducers/orderBookReducer';
import tradeReducer from './reducers/tradeReducer';
import thunk from 'redux-thunk';

const reducers = combineReducers({
    appReducer,
    tickerReducer,
    orderBookReducer,
    tradeReducer
});

const store = createStore(
    reducers,
    applyMiddleware(thunk)
);

export default store;