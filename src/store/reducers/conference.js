import {ADD_CONFERENCE, GET_CONFERENCE, REMOVE_CONFERENCE} from "../actions/types";
const initialState = null;

export const conference = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CONFERENCE:
            state = action.payload;
            return state;
        case REMOVE_CONFERENCE:
            state = null;
            return state;
        case GET_CONFERENCE:
            state = action.payload;
            return state;
        default:
            return state;
    }
}
