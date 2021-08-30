import {SHOW_NOTIFICATION} from "../actions/types";
const initialState = {severity: "success", autoHide: true};

export const notification = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            state = action.payload;
            return {...state};
        default:
            return state;
    }
}
