import {SET_GOOGLE_API_STATE, SET_PROFILE, UPDATE_PROFILE, SET_MEETING_TITLE} from "../actions/types";

const initialState = {
    name: JSON.parse(localStorage.getItem("reduxState") || "{}").username,
    meetingTitle: '',
    googleAPIState: 0,
    avatar: "",
    email: "",
    id: ""
};

export const profile = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROFILE:
            const {name, email, avatar, id} = action.payload;
            state.name = name;
            state.email = email;
            state.avatar = avatar;
            state.id = id;
            return {...state};
        case UPDATE_PROFILE:
            state.name = action.payload.name;
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
