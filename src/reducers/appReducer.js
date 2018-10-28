import { fromJS } from 'immutable';
import { SET_CHANNEL_INFO } from '../actionTypes';

const initialState = fromJS({
    channelsInfo: {}
});

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CHANNEL_INFO: {
            const { chanId, channelInfo } = action.data;
            return state.setIn(['channelsInfo', chanId], channelInfo);
        }
        default:
            return state;
    }
}
