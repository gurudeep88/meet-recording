import {ADD_CONNECTION, REMOVE_CONNECTION} from "../actions/types";

const initialState = null;

export const connection = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CONNECTION:
            state = action.payload;
            return state;
        case REMOVE_CONNECTION:
            state = null;
            return state;
        default:
            return state;
    }
}
