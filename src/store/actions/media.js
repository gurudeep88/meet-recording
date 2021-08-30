import { SET_CAMERA, SET_MICROPHONE, SET_RESOLUTION, SET_SPEAKER } from "./types"

export const setMicrophone = (value) => {
    return {
        type: SET_MICROPHONE,
        payload: value
    }
}

export const setSpeaker = (value) => {
    return {
        type: SET_SPEAKER,
        payload: value
    }
}

export const setCamera = (value) => {
    return {
        type: SET_CAMERA,
        payload: value
    }
}

export const setResolution = (value) => {
    return {
        type: SET_RESOLUTION,
        payload: value
    }
}
