import { ADD_MESSAGE } from "../actions/types";
const initialState = [];

export const message = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            state.push(action.payload);
            return [...state];
        default:
            return state;
    }
};
