import { fromJS } from 'immutable';
import { SET_TICKER_DATA } from '../actionTypes';

const initialState = fromJS({
    tickersData: {}
});

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_TICKER_DATA: {
            const { pair, tickerInfo } = action.data;
            return state.setIn(['tickersData', pair], tickerInfo);
        }
        default:
            return state;
    }
}
