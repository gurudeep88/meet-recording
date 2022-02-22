import React from "react";

export const s3 = {
   file_recording_metadata : {
       share: true
    }
}

export const GOOGLE_API_CLIENT_LIBRARY_URL = 'https://apis.google.com/js/api.js';
export const API_URL_BROADCAST_STREAMS = 'https://content.googleapis.com/youtube/v3/liveStreams?part=id%2Csnippet%2Ccdn%2Cstatus&id=';
export const API_URL_LIVE_BROADCASTS = 'https://content.googleapis.com/youtube/v3/liveBroadcasts?broadcastType=all&mine=true&part=id%2Csnippet%2CcontentDetails%2Cstatus';
export const DISCOVERY_DOCS = [ 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest' ];
export const CREATE_YOUTUBE_LIVE_STREAMS = "https://www.googleapis.com/youtube/v3/liveStreams";
export const CREATE_YOUTUBE_LIVE_BROADCASTS = "https://www.googleapis.com/youtube/v3/liveBroadcasts";

export const GOOGLE_API_STATES = {
    NEEDS_LOADING: 0,
    LOADED: 1,
    SIGNED_IN: 2,
    NOT_AVAILABLE: 3
};
export const GOOGLE_SCOPE_CALENDAR = 'https://www.googleapis.com/auth/calendar';
export const GOOGLE_SCOPE_YOUTUBE = 'https://www.googleapis.com/auth/youtube';
export const GENERATE_TOKEN_URL = `${process.env.REACT_APP_API_SERVICE_HOST}api/v1/misc/generate-token`;
export const EXIT_FULL_SCREEN_MODE = "exitFullScreen";
export const ENTER_FULL_SCREEN_MODE = "enterFullScreen";
export const VIRTUAL_BACKGROUND  = "VIRTUAL_BACKGROUND";
export const IS_PRESENTING  = "IS_PRESENTING";
export const START_PRESENTING = "START_PRESENTING";
export const STOP_PRESENTING = "STOP_PRESENTING";
export const CHAT = "CHAT";
export const PRESENTATION = "PRESENTATION";
export const GRID = "GRID";
export const SPEAKER = "SPEAKER";
export const SET_PRESENTATION_TYPE = "SET_PRESENTATION_TYPE";
export const SHARED_DOCUMENT = "SHARED_DOCUMENT";
export const WHITEBOARD = "WHITEBOARD";

export const images = [
    {
        name: 'Modern living room',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/living3_160x80_4747909f30a0f952ea27b04acaf5da74.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/living3_1005ac162f964b5f9e8499dfc5902250.jpeg`
    },
    {
        name: 'Ocean in the background',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/ocean2_160x80_4fec4b6a900978ef5379547ea58e6cd4.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/ocean2_c48fa44e731d22668107a6589ddc33db.jpeg`
    },
    {
        name: 'Confetti on the pink background',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/confetti_160x80_1c34aa59548ccf5f5fd892922a4c1696.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/confetti_1296f69171bbef53d30ef80b6f201bf6.jpeg`
    },
    {
        name: 'Room with books on the shelves',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/books2_160x80_c9fa78ee5c5d754b54aa8bf4db32f990.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/books2_1a904eb291cb029f74c848d4604c0ed2.jpeg`
    },
    {
        name: 'Trailer in the evevning',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/trailer_160x80_0aca32d5afd25eb66e6da0a3b79736e6.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/trailer_182d4f7c61e37df010c786dfae0c879f.jpeg`
    },
    {
        name: 'Mountains',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/camping_160x80_e4b8a8ddb725ff70d2b5528773404797.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/camping_20abb6723b26f70457222e9fd0f4891d.jpeg`
    },
    {
        name: 'Skyscrapers with searchlights',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/skyskrapers_160x80_558fa6dc53e8a1b846f1d79053426373.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/skyskrapers_02f52b6cea18f5f0384b7ac8db8ad86b.jpeg`
    },
    {
        name: 'Fireworks',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/fireworks_160x80_7ba37495ac5b120851fc481e77ed7238.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/fireworks_c41626c514ccf319a3edb470b4d04949.jpeg`
    },
    {
        name: 'Purple Clouds',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/clouds_160x80_a35095c2eab129225b3efc0da5bbbac7.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/clouds_bf46b8c3a1c02ee8628736254df3b587.jpeg`
    },
    {
        name: 'Cafe at night',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/cafe_at_night_160x80_1b3efcaeb19a2d6068f238ca7f92c18f.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/cafe_at_night_de428ba989b9d616ec90ae7440b0944b.jpeg`
    },
    {
        name: 'Stylized fish in a green sea',
        thumbnail: 'https://www.gstatic.com/webrtc-video-processing/assets/ocean_160x80_5ab6b47391c6ee4f8c05aebe47630a6e.jpg',
        url: `https://s3.ap-south-1.amazonaws.com/${process.env.REACT_APP_API_SERVICE_HOST_NAME}/static/media/ocean_b26b6f03864ea9ebc1263d9c50f0c59b.jpeg`
    }
]


export const DROPBOX_APP_KEY = "hey9dkz8x8s3x74";
export const CHECK_ROOM_URL = "https://reservation.sariska.io/room"

export const GET_PRESIGNED_URL = "https://api.sariska.io/api/v1/misc/get-presigned";

