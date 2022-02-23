// @flow

import { Dropbox, DropboxAuth } from 'dropbox';
import { getJitsiMeetGlobalNS } from "./index"
import {DROPBOX_APP_KEY} from "../constants";

/**
 * Executes the oauth flow.
 *
 * @param {string} authUrl - The URL to oauth service.
 * @returns {Promise<string>} - The URL with the authorization details.
 */

function authorize(authUrl) {
    const windowName = `oauth${Date.now()}`;
    const gloabalNS = getJitsiMeetGlobalNS();

    gloabalNS.oauthCallbacks = gloabalNS.oauthCallbacks || {};

    return new Promise(resolve => {
        const popup = window.open(authUrl, windowName, `width=600,height=600`);
        gloabalNS.oauthCallbacks[windowName] = url => {
            popup.close();
            delete gloabalNS.oauthCallbacks.windowName;
            resolve(url);
        
        };
    });
}

/**
 * Returns the token's expiry date as UNIX timestamp.
 *
 * @param {number} expiresIn - The seconds in which the token expires.
 * @returns {number} - The timestamp value for the expiry date.
 */
function getTokenExpiresAtTimestamp(expiresIn) {
    return new Date(Date.now() + (expiresIn * 1000)).getTime();
}

/**
 * Action to authorize the Jitsi Recording app in dropbox.
 *
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @param {string} redirectURI - The return URL.
 * @returns {Promise<Object>}
 */
export function authorizeDropbox() {
    const redirectURI= `https://meet.dev.sariska.io/oauth.html`;
    const dropbox = new DropboxAuth({ clientId: DROPBOX_APP_KEY });

    return dropbox.getAuthenticationUrl(redirectURI, undefined, 'code', 'offline', undefined, undefined, true)
        .then(authorize)
        .then(returnUrl => {
            const params = new URLSearchParams(new URL(returnUrl).search);
            const code = params.get('code');
            return dropbox.getAccessTokenFromCode(redirectURI, code);
        })
        .then(resp => {
            return {
                token: resp.result.access_token,
                rToken: resp.result.refresh_token,
                expireDate: getTokenExpiresAtTimestamp(resp.result.expires_in)
            };
        });
}


/**
 * Gets a new acccess token based on the refresh token.
 *
 * @param {string} appKey - The dropbox appKey.
 * @param {string} rToken - The refresh token.
 * @returns {Promise}
 */
export function getNewAccessToken(appKey, rToken) {
    const dropbox = new DropboxAuth({ clientId: appKey });

    dropbox.setRefreshToken(rToken);

    return dropbox.refreshAccessToken()
        .then(() => {
            return {
                token: dropbox.getAccessToken(),
                rToken: dropbox.getRefreshToken(),
                expireDate: dropbox.getAccessTokenExpiresAt().getTime()
            };
        });
}

/**
 * Returns the display name for the current dropbox account.
 *
 * @param {string} token - The dropbox access token.
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @returns {Promise<string>}
 */
export function getDisplayName(token, appKey) {
    const dropboxAPI = new Dropbox({
        accessToken: token,
        clientId: appKey
    });

    return (
        dropboxAPI.usersGetCurrentAccount()
            .then(account => account.result.name.display_name));
}

/**
 * Returns information about the space usage for the current dropbox account.
 *
 * @param {string} token - The dropbox access token.
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @returns {Promise<Object>}
 */
export function getSpaceUsage(token, appKey) {
    const dropboxAPI = new Dropbox({
        accessToken: token,
        clientId: appKey
    });

    return dropboxAPI.usersGetSpaceUsage().then(space => {
        const { allocation, used } = space.result;
        const { allocated } = allocation;

        return {
            allocated,
            used
        };
    });
}

/**
 * Returns <tt>true</tt> if the dropbox features is enabled and <tt>false</tt>
 * otherwise.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean}
 */
export function isEnabled(state) {
    const { dropbox = {} } = state['features/base/config'];

    return typeof dropbox.appKey === 'string';
}
