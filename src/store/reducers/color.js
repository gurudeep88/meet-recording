import {ADD_COLOR, REMOVE_COLOR} from "../actions/types";

const initialState = {};

export const color = (state = initialState, action) => {
    switch (action.type) {
        case ADD_COLOR:
            if (state[action.payload.participantId]){
                return {...state};
            }
            state[action.payload.participantId] = action.payload.color;
            return {...state};
        case REMOVE_COLOR:
            delete state[action.payload.participantId];
            return {...state};
        default:
            return state;
    }
}
