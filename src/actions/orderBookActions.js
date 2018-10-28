import { SET_ORDER_BOOK_DATA } from '../actionTypes';

export const setOrderBookData = (data) => ({
    type: SET_ORDER_BOOK_DATA,
    data
});

// export const orderBookDataSuccess = response => ({
//     type: 'FETCH_EVENTS_SUCCESS',
//     events: response.events,
//     markets: response.markets
// });

// export const orderBookError = () => ({
//     type: 'FETCH_EVENTS_ERROR'
// });

// export const fetchOrderBookData = url => {
//     return dispatch => {
//         dispatch(orderBookLoading());

//         fetch(url)
//             .then(response => response.json())
//             .then(jsonResponse => dispatch(fetchEventsSuccess(jsonResponse)))
//             .catch(error => dispatch(fetchEventsError()));
//     };
// }