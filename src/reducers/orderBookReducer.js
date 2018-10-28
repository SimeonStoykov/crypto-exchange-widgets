import { fromJS } from 'immutable';
import { SET_ORDER_BOOK_DATA, UPDATE_ORDER_BOOK_DATA, REMOVE_ORDER_BOOK_DATA } from '../actionTypes';

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
        case UPDATE_ORDER_BOOK_DATA: {
            const { updatedPart, updatedData } = action.data;
            const updatedPrice = updatedData.price;
            let orderBookData = state.get('orderBookData').toJS();
            let newOrderBookData = { ...orderBookData };

            let currentData = newOrderBookData[updatedPart];
            let existingPriceIndex = currentData.findIndex(el => el.price === updatedPrice);

            if (existingPriceIndex !== -1) {
                currentData[existingPriceIndex] = Object.assign(currentData[existingPriceIndex], updatedData);
            } else if (currentData.length < 25) {
                currentData.push(updatedData);
            } else if (currentData.length === 25) {
                currentData.pop();
                currentData.push(updatedData);
            }

            if (updatedPart === 'bids') {
                currentData.sort((a, b) => b.price - a.price); // For descending sort
            } else {
                currentData.sort((a, b) => a.price - b.price); // For descending sort
            }

            return state.set('orderBookData', fromJS(newOrderBookData));
        }
        case REMOVE_ORDER_BOOK_DATA: {
            const { partToRemoveFrom, removedPrice } = action.data;
            let orderBookData = state.get('orderBookData').toJS();
            let newOrderBookData = { ...orderBookData };

            let currentData = newOrderBookData[partToRemoveFrom];
            let existingPriceIndex = currentData.findIndex(el => el.price === removedPrice);
            let newData = [...currentData];

            existingPriceIndex !== -1 && newData.splice(existingPriceIndex, 1);

            return state.set('orderBookData', fromJS(newOrderBookData));
        }
        default:
            return state;
    }
}
