import {ADD_CONFERENCE, CLEAR_ALL, REMOVE_CONFERENCE} from "./types";

export const addConference = (conference) => {
    return {
        type: ADD_CONFERENCE,
        payload: conference
    }
}

export const removeConference = () => {
    return {
        type: REMOVE_CONFERENCE
    }
}

export const clearAllReducers = () => {
    return {
        type: CLEAR_ALL
    }
}
