import {SHOW_SNACKBAR} from "../actions/types";
const initialState = {severity: "success", autoHide: true};

export const snackbar = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_SNACKBAR:
            state = action.payload;
            return {...state};
        default:
            return state;
    }
}
