import {
    API_URL_BROADCAST_STREAMS,
    API_URL_LIVE_BROADCASTS,
    DISCOVERY_DOCS,
    GOOGLE_SCOPE_CALENDAR,
    GOOGLE_SCOPE_YOUTUBE,
    GOOGLE_API_STATES,
    GOOGLE_API_CLIENT_LIBRARY_URL,
    CREATE_YOUTUBE_LIVE_STREAMS,
    CREATE_YOUTUBE_LIVE_BROADCASTS
} from '../constants';

import {store} from "../store";
import {setGoogleAPIState} from "../store/actions/profile";

let googleClientLoadPromise;


const googleApi = {

    getCalendarEntries(fetchStartDays, fetchEndDays) {
        return googleApi.get()
            .then(() => {
                return googleApi._getCalendarEntries(fetchStartDays, fetchEndDays);
            });
    },

    loadGoogleAPI() {
        return this.get()
            .then(() => {
                if (store.getState().profile.googleAPIState === GOOGLE_API_STATES.NEEDS_LOADING) {
                    return googleApi.initializeClient("621897095595-k7tr68mgfrhm1935cqdq5l2vg8u7ltu8.apps.googleusercontent.com", true, true);
                }
                return Promise.resolve();
            })
            .then(() => store.dispatch(setGoogleAPIState(GOOGLE_API_STATES.LOADED)))
            .then(() => googleApi.isSignedIn())
            .then(isSignedIn => {
                if (isSignedIn) {
                    store.dispatch(setGoogleAPIState(GOOGLE_API_STATES.SIGNED_IN));
                }
                return isSignedIn;
            });
    },

    get() {
        const globalGoogleApi = this._getGoogleApiClient();
        if (!globalGoogleApi) {
            return this.load();
        }
        return Promise.resolve(globalGoogleApi);
    },

    getCurrentUserProfile() {
        return this.get()
            .then(() => this.isSignedIn())
            .then(isSignedIn => {
                if (!isSignedIn) {
                    return null;
                }

                return this._getGoogleApiClient()
                    .auth2.getAuthInstance()
                    .currentUser.get()
                    .getBasicProfile();
            });
    },

    initializeClient(clientId, enableYoutube, enableCalendar) {
        return this.get()
            .then(api => new Promise((resolve, reject) => {
                const scope
                    = `${enableYoutube ? GOOGLE_SCOPE_YOUTUBE : ''} ${enableCalendar ? GOOGLE_SCOPE_CALENDAR : ''}`
                    .trim();

                // setTimeout is used as a workaround for api.client.init not
                // resolving consistently when the Google API Client Library is
                // loaded asynchronously. See:
                // github.com/google/google-api-javascript-client/issues/399
                setTimeout(() => {
                    api.client.init({
                        'ux_mode': 'popup',
                        clientId,
                        discoveryDocs: DISCOVERY_DOCS,
                        scope
                    })
                        .then(resolve)
                        .catch(reject);
                }, 500);
            }));
    },

    isSignedIn() {
        return this.get().then(api => Boolean(api?.auth2?.getAuthInstance()?.isSignedIn?.get()));
    },

    load() {
        if (googleClientLoadPromise) {
            return googleClientLoadPromise;
        }

        googleClientLoadPromise = new Promise((resolve, reject) => {
            const scriptTag = document.createElement('script');
            scriptTag.async = true;
            scriptTag.addEventListener('error', () => {
                scriptTag.remove();
                googleClientLoadPromise = null;
                reject();
            });
            scriptTag.addEventListener('load', resolve);
            scriptTag.type = 'text/javascript';

            scriptTag.src = GOOGLE_API_CLIENT_LIBRARY_URL;

            document.head.appendChild(scriptTag);
        })
            .then(() => new Promise((resolve, reject) =>
                this._getGoogleApiClient().load('client:auth2', {
                    callback: resolve,
                    onerror: reject
                })))
            .then(() => this._getGoogleApiClient());
        return googleClientLoadPromise;
    },


    requestAvailableYouTubeBroadcasts() {
        return this.get()
            .then(api => api.client.request(API_URL_LIVE_BROADCASTS));
    },

    createLiveStreams(title) {
        
        return this._getGoogleApiClient()?.client?.youtube?.liveStreams?.insert({
            "part": [
                "snippet,cdn,contentDetails,status"
            ],
            "resource": {
                "snippet": {
                "title": title,
                "description": "A description of your video stream. This field is optional."
                },
                "cdn": {
                "frameRate": "60fps",
                "ingestionType": "rtmp",
                "resolution": "1080p"
                },
                "contentDetails": {
                "isReusable": true
                }
            }
            })
    },

    async requestLiveStreamsForYouTubeBroadcast(boundStreamID) {
        return this.get()
            .then(api => api.client.request(
                `${API_URL_BROADCAST_STREAMS}${boundStreamID}`));
    },

    showAccountSelection() {
        return this.get()
            .then(api => {
                return api.auth2.getAuthInstance().signIn()
            });
    },

    signInIfNotSignedIn() {
        return this.get()
            .then(() => this.isSignedIn())
            .then(isSignedIn => {
                if (!isSignedIn) {
                    return this.showAccountSelection();
                }
            });
    },


    signOut() {
        return this.get().then(api => api?.auth2?.getAuthInstance()?.signOut());
    },

    _convertCalendarEntry(entry) {
        return {
            calendarId: entry.calendarId,
            description: entry.description,
            endDate: entry.end.dateTime,
            id: entry.id,
            location: entry.location,
            startDate: entry.start.dateTime,
            title: entry.summary,
            url: this._getConferenceDataVideoUri(entry.conferenceData)
        };
    },


    _getConferenceDataVideoUri(conferenceData = {}) {
        try {
            // check conference data coming from calendar addons
            if (conferenceData.parameters.addOnParameters.parameters
                .conferenceSolutionType === 'jitsi') {
                const videoEntry = conferenceData.entryPoints.find(
                    e => e.entryPointType === 'video');

                if (videoEntry) {
                    return videoEntry.uri;
                }
            }
        } catch (error) {
            // we don't care about undefined fields
        }
    },


    _getCalendarEntries(fetchStartDays, fetchEndDays) {
        return this.get()
            .then(() => this.isSignedIn())
            .then(isSignedIn => {
                if (!isSignedIn) {
                    return null;
                }

                // user can edit the events, so we want only those that
                // can be edited
                return this._getGoogleApiClient().client.calendar.calendarList.list();
            })
            .then(calendarList => {

                // no result, maybe not signed in
                if (!calendarList) {
                    return Promise.resolve();
                }

                const calendarIds
                    = calendarList.result.items.map(en => {
                    return {
                        id: en.id,
                        accessRole: en.accessRole
                    };
                });
                

                const promises = calendarIds.map(({id, accessRole}) => {
                    const startDate = new Date();
                    const endDate = new Date();

                    startDate.setDate(startDate.getDate() + fetchStartDays);
                    endDate.setDate(endDate.getDate() + fetchEndDays);

                    // retrieve the events and adds to the result the calendarId

                    return this._getGoogleApiClient().client.calendar.events.list({
                        'calendarId': id,
                        'timeMin': startDate.toISOString(),
                        'timeMax': endDate.toISOString(),
                        'showDeleted': false,
                        'singleEvents': true,
                        'orderBy': 'startTime'
                    })
                    .then(result => result.result.items
                        .map(item => {
                            const resultItem = {...item};

                            // add the calendarId only for the events
                            // we can edit
                            if (accessRole === 'writer'
                                || accessRole === 'owner') {
                                resultItem.calendarId = id;
                            }

                            return resultItem;
                        }));
                });

                return Promise.all(promises)
                    .then(results => [].concat(...results))
                    .then(entries =>
                        entries.map(e => this._convertCalendarEntry(e)));
            });
    },


    updateCalendarEntry(id, calendarId, location, text) {
        return this.get()
            .then(() => this.isSignedIn())
            .then(isSignedIn => {
                if (!isSignedIn) {
                    return null;
                }
                return this._getGoogleApiClient()
                    .client.calendar.events.get({
                        'calendarId': calendarId,
                        'eventId': id
                    }).then(event => {
                        let newDescription = text;
                        if (event.result.description) {
                            newDescription = `${event.result.description}\n\n${
                                text}`;
                        }

                        return this._getGoogleApiClient()
                            .client.calendar.events.patch({
                                'calendarId': calendarId,
                                'eventId': id,
                                'description': newDescription,
                                'location': location
                            });
                    });
            });
    },

    _getGoogleApiClient() {
        return window.gapi;
    }
};

export default googleApi;


















