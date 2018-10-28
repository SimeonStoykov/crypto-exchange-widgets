import { fromJS } from 'immutable';
import { SET_ORDER_BOOK_DATA } from '../actionTypes';

const initialState = fromJS({
    orderBookData: {
        bids: [],
        asks: []
    }
});

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ORDER_BOOK_DATA: {
            return state
                .setIn(['orderBookData', 'bids'], fromJS([].concat(action.data.bids)))
                .setIn(['orderBookData', 'asks'], fromJS([].concat(action.data.asks)));
        }
        default:
            return state;
    }
}
