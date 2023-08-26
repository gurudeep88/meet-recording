import React from "react";

export const s3 = {
   file_recording_metadata : {
       share: true
    }
}

export const GENERATE_TOKEN_URL = `${process.env.REACT_APP_API_SERVICE_HOST}api/v1/misc/generate-token`;
export const EXIT_FULL_SCREEN_MODE = "exitFullScreen";
export const ENTER_FULL_SCREEN_MODE = "enterFullScreen";

export const PRESENTATION = "PRESENTATION";
export const GRID = "GRID";
export const SPEAKER = "SPEAKER";
export const SET_PRESENTATION_TYPE = "SET_PRESENTATION_TYPE";

export const DROPBOX_APP_KEY = "hey9dkz8x8s3x74";

export const RECORDING_ERROR_CONSTANTS  = {
    busy: "Already Busy",
    error: "Something went wrong",
    resource_constraint: "Resource constraint",
    unexpected_request: "Recording or live streaming is already enabled",
    service_unavailable: "Service unavailable"
};