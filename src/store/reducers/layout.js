import {SET_FULLSCREEN_MODE, SET_LAYOUT, SET_PIN_PARTICIPANT, SET_PRESENTER, SET_DISCONNECTED, SET_PRESENTATION_TYPE} from "../actions/types";
import {EXIT_FULL_SCREEN_MODE, SPEAKER} from "../../constants";

const initialState = {
    type: SPEAKER,  //default layout,
    mode: EXIT_FULL_SCREEN_MODE, //default mode,
    pinnedParticipantId: null,
    presenterParticipantId: null,
    disconnected: false,
    presentationType: null
};

export const layout = (state = initialState, action) => {
    switch (action.type) {
        case SET_LAYOUT:
            state.type = action.payload;
            return {...state};
        case SET_FULLSCREEN_MODE:
            state.mode = action.payload;
            return {...state};
        case SET_DISCONNECTED:
            state.disconnected = action.payload;
            return {...state};
        case SET_PRESENTER:
            state.presenterParticipantId = action.payload;
            return {...state};
        case SET_PIN_PARTICIPANT:
            state.pinnedParticipantId = action.payload;
            return {...state};
        case SET_PRESENTATION_TYPE:
            state.presentationType = action.payload.presentationType;
            return {...state};    
        default:
            return state;
    }
}
