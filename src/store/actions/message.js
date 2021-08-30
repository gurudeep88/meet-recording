import * as Constants from "./types";

export const addMessage = (message) => {
    return {
        payload: message,
        type: Constants.ADD_MESSAGE
    }
}
