import { UNREAD_MESSAGES } from "./types"

export const unreadMessage = (count) => {
    return {
        type: UNREAD_MESSAGES,
        payload: count
    }
}