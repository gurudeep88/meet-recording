import * as Constants from "./types";

export const setAudioLevel = (data) => {
    return {
        type: Constants.SET_AUDIO_LEVEL,
        payload: data,
    }
}
