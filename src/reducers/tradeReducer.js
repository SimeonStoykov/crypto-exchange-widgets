import { fromJS } from 'immutable';
import { SET_TRADE_DATA, UPDATE_TRADE_DATA } from '../actionTypes';

const initialState = fromJS({
    tradesData: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_TRADE_DATA: {
            return state.set('tradesData', fromJS([].concat(action.data)));
        }
        case UPDATE_TRADE_DATA: {
            let currentTradesData = state.get('tradesData').toJS();
            let newTradesData = [...currentTradesData];
            let existingTradeIndex = newTradesData.findIndex(tr => tr.id === action.data.id);

            if (existingTradeIndex !== -1) {
                newTradesData[existingTradeIndex] = Object.assign(newTradesData[existingTradeIndex], action.data);
            } else if (currentTradesData.length === 30) {
                newTradesData.pop();
                newTradesData.push(action.data);
            }

            newTradesData.sort((a, b) => b.milliseconds - a.milliseconds);

            return state.set('tradesData', fromJS(newTradesData));
        }
        default:
            return state;
    }
}
