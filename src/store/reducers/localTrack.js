import {
    ADD_LOCAL_TRACK,
    UPDATE_LOCAL_TRACK,
    REMOVE_LOCAL_TRACK,
    REMOVE_ALL_LOCAL_TRACK,
    LOCAL_TRACK_MUTE_CHANGED
} from "../actions/types";

const initialState = [];

export const localTrack = (state = initialState, action) => {
    switch (action.type) {
        case ADD_LOCAL_TRACK:
            state.push(action.payload);
            return [...state];
        case UPDATE_LOCAL_TRACK:
            let index = state.findIndex((item) => item.getId() === action.payload.track.getId());
            state[index] = action.payload.newTrack;
            return [...state];
        case REMOVE_LOCAL_TRACK:
            state = state.filter((item) => item.getId() !== action.payload.getId());
            action.payload.dispose();
            return [...state];
        case LOCAL_TRACK_MUTE_CHANGED:
            return [...state];
        case REMOVE_ALL_LOCAL_TRACK:
            state = [];
            return state;
        default:
            return state;
    }
};
