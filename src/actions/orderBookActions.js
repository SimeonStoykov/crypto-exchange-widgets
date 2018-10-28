import { SET_ORDER_BOOK_DATA, UPDATE_ORDER_BOOK_DATA, REMOVE_ORDER_BOOK_DATA } from '../actionTypes';

export const setOrderBookData = (data) => ({
    type: SET_ORDER_BOOK_DATA,
    data
});

export const updateOrderBookData = (data) => ({
    type: UPDATE_ORDER_BOOK_DATA,
    data
});

export const removeOrderBookData = (data) => ({
    type: REMOVE_ORDER_BOOK_DATA,
    data
});
