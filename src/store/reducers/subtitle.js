import { ADD_SUBTITLE } from "../actions/types";
const initialState = {name: "", text: ""};

export const subtitle = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SUBTITLE:
            state.text = action.payload.text ? action.payload.text: "";
            state.name = action.payload.name ? action.payload.name: "";
            return {...state};
        default:
            return state;
    }
};
