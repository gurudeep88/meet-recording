import {SHOW_NOTIFICATION} from "./types";

export const showNotification = (data) => {
    return {
        payload: data,
        type: SHOW_NOTIFICATION
    }
}
