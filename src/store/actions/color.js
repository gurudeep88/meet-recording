import { ADD_COLOR, REMOVE_COLOR } from "./types"

export const addThumbnailColor = (data) => {
    return {
        type: ADD_COLOR,
        payload: data
    }
}

export const removeThumbnailColor = (participantId) => {
    return {
        type: REMOVE_COLOR,
        payload: participantId
    }
}
