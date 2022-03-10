import {
    ADD_REMOTE_TRACK,
    UPDATE_REMOTE_TRACK,
    REMOVE_REMOTE_TRACK,
    REMOVE_ALL_REMOTE_TRACK,
    REMOTE_TRACK_MUTE_CHANGED,
    PARTICIPANT_LEFT
} from "../actions/types";

const initialState = {};
let participantId;

export const remoteTrack = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REMOTE_TRACK:
            participantId = action.payload.getParticipantId();
            if (!state[participantId]) {
                state[participantId] = [];
            }
            state[participantId].push(action.payload);
            return {...state};
        case UPDATE_REMOTE_TRACK:
            participantId = action.payload.getParticipantId();
            let index = state[participantId].findIndex((item) => item.getId() === action.payload.getId());
            state[participantId][index] = action.payload;
            return {...state};
        case REMOVE_REMOTE_TRACK:
            participantId = action.payload.getParticipantId();
            if (participantId) {
                state[participantId] = state[participantId].filter((item) => item.getId() !== action.payload.getId());
            }
            if (state[participantId]?.length === 0) {
                delete state[participantId];
            }
            return {...state};
        case REMOVE_ALL_REMOTE_TRACK:
            state = {};
            return state;
        case REMOTE_TRACK_MUTE_CHANGED:
            return {...state};
        case PARTICIPANT_LEFT:
            delete state[action.payload];
            return {...state};    
        default:
            return state;
    }
};
