import {CLEAR_ALL} from "../actions/types";
import {combineReducers} from "redux";
import {conference} from "./conference";
import {connection} from "./connection";
import {remoteTrack} from "./remoteTrack";
import {localTrack} from "./localTrack";
import {layout} from "./layout";
import {profile} from "./profile";
import {message} from "./message";
import {chat} from "./chat";
import {media} from "./media";
import {color} from "./color";
import {audioIndicator} from "./audioIndicator";
import {notification} from "./notification";
import {subtitle} from "./subtitle";

export const appReducer = combineReducers({
    conference,
    connection,
    remoteTrack,
    localTrack,
    layout,
    profile,
    media,
    message,
    chat,
    color,
    audioIndicator,
    notification,
    subtitle
});

export const rootReducer = (state, action) => {
    if (action.type === CLEAR_ALL) {
        return appReducer({ profile: state.profile, localTrack: [], remoteTrack: [] }, action);
    }
    return appReducer(state, action);
}
