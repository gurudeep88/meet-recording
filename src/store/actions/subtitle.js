import * as Constants from "./types";

export const addSubtitle = (message) => {
    return {
        payload: message,
        type: Constants.ADD_SUBTITLE
    }
}
