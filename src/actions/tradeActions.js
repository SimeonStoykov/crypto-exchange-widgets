import { SET_TRADE_DATA, UPDATE_TRADE_DATA } from '../actionTypes';

export const setTradeData = (data) => ({
    type: SET_TRADE_DATA,
    data
});

export const updateTradeData = (data) => ({
    type: UPDATE_TRADE_DATA,
    data
});