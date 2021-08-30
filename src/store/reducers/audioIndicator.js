import {SET_AUDIO_LEVEL} from "../actions/types";
const initialState = [];

export const audioIndicator = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUDIO_LEVEL:
            state[action.payload.participantId] = action.payload.audioLevel;
            return {...state};
        default:
            return state;
    }
};
