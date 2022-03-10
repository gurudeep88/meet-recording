import * as Constants from "./types";

export const addLocalTrack = (track) => {
    return {
        type: Constants.ADD_LOCAL_TRACK,
        payload: track
    }
}

export const removeLocalTrack = (track) => {
    return {
        type: Constants.REMOVE_LOCAL_TRACK,
        payload: track
    }
}

export const updateLocalTrack = (track, newTrack) => {
    return {
        type: Constants.UPDATE_LOCAL_TRACK,
        payload: { track, newTrack}
    }
}

export const addRemoteTrack = (track) => {
    
    return {
        type: Constants.ADD_REMOTE_TRACK,
        payload: track
    }
}

export const removeRemoteTrack = (track) => {
    return {
        type: Constants.REMOVE_REMOTE_TRACK,
        payload: track
    }
}

export const updateRemoteTrack = (track) => {
    return {
        type: Constants.UPDATE_REMOTE_TRACK,
        payload: track
    }
}

export const participantLeft = (id) => {
    return {
        type: Constants.PARTICIPANT_LEFT,
        payload: id
    }
}

export const localTrackMutedChanged = () => {
    return {
        type: Constants.LOCAL_TRACK_MUTE_CHANGED
    }
}

export const remoteTrackMutedChanged = () => {
    return {
        type: Constants.REMOTE_TRACK_MUTE_CHANGED
    }
}

export const remoteAllLocalTracks = () => {
    return {
        type: Constants.REMOVE_ALL_LOCAL_TRACK
    }
}
