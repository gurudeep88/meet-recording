import { UNREAD_MESSAGES } from "../actions/types"

const initialState={
    unreadMessage: 0
}

export const chat = (state=initialState, action)=> {
    switch(action.type) {
        case UNREAD_MESSAGES:
            state.unreadMessage = action.payload;
            return {...state};
        default:
            return state;
    }
}