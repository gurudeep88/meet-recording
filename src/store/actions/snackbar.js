import {SHOW_SNACKBAR} from "./types";

export const showSnackbar = (data) => {
    return {
        payload: data,
        type: SHOW_SNACKBAR
    }
}
