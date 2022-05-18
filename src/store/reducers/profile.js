import {SET_GOOGLE_API_STATE, SET_PROFILE, UPDATE_PROFILE, SET_MEETING_TITLE} from "../actions/types";
const persistedData = JSON.parse(localStorage.getItem("SariskaReduxState") || "{}");

const initialState = {
    name: persistedData.name,
    meetingTitle: '',
    googleAPIState: 0,
    color: persistedData.color,
    avatar: persistedData.avatar,
    email: persistedData.email,
    id: persistedData.id,
    moderator: persistedData.moderator
};

export const profile = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROFILE:
            const {name, email, avatar, id, moderator, color} = action.payload;
            state.name = name;
            state.email = email;
            state.moderator = moderator;
            state.avatar = avatar;
            state.id = id;
            return {...state};
        case UPDATE_PROFILE:
            state[action.payload.key] = action.payload.value;
            return {...state};
        case SET_MEETING_TITLE:
            const {meetingTitle} = action.payload;
            state.meetingTitle = meetingTitle;
            return {...state};
        case SET_GOOGLE_API_STATE:
            state.googleAPIState = action.payload;
            return {...state};
        default:
            return state
    }
}