import {
  SET_CAMERA,
  SET_MICROPHONE,
  SET_RESOLUTION,
  SET_SPEAKER,
} from "../actions/types";

const initialState = {
  microphone: "",
  speaker: "",
  camera: "",
  resolution: 720,
  aspectRatio: 9/16
};
export const media = (state = initialState, action) => {
  switch (action.type) {
    case SET_MICROPHONE:
      state.microphone = action.payload;
      return {
        ...state,
      };
    case SET_SPEAKER:
      state.speaker = action.payload;
      return {
        ...state,
      };
    case SET_CAMERA:
      state.camera = action.payload;
      return {
        ...state,
      };
    case SET_RESOLUTION:
      state.resolution = action.payload.resolution;
      state.aspectRatio = action.payload.aspectRatio;
      return {
        ...state,
      };
    default:
      return state;
  }
};
