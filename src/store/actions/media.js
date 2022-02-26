import { SET_CAMERA, SET_MICROPHONE, SET_YOUR_RESOLUTION, SET_SPEAKER } from "./types"

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


export const setYourResolution = (value) => {
    return {
        type: SET_YOUR_RESOLUTION,
        payload: value
    }
}
