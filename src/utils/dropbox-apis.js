import { Dropbox } from 'dropbox';
import {parseURLParams} from "../utils/parseURLParams";
import {parseStandardURIString} from "../utils/parseStandardURIString";


function authorize(authUrl){
    const windowName = `oauth${Date.now()}`;
    window.oauthCallbacks = window.oauthCallbacks || {};

    return new Promise(resolve => {
        const popup = window.open(authUrl, windowName);

        window.oauthCallbacks[windowName] = url => {
            popup.close();
            delete window.oauthCallbacks.windowName;
            resolve(url);
        };
    });
}


export function authorizeDropbox() {
    const redirectURI = "http://localhost:3000";
    const dropboxAPI = new Dropbox({ clientId: 'hey9dkz8x8s3x74' });
    const url = dropboxAPI.getAuthenticationUrl(redirectURI);

    return authorize(url).then(returnUrl => {
        const params = parseURLParams(parseStandardURIString(returnUrl), true) || {};
        return params.access_token;
    });
}


export function getDisplayName(token, appKey) {
    const dropboxAPI = new Dropbox({
        accessToken: token,
        clientId: appKey
    });

    return (
        dropboxAPI.usersGetCurrentAccount()
            .then(account => account.name.display_name));
}


export function getSpaceUsage(token, appKey) {
    const dropboxAPI = new Dropbox({
        accessToken: token,
        clientId: appKey
    });

    return dropboxAPI.usersGetSpaceUsage().then(space => {
        const { allocation, used } = space;
        const { allocated } = allocation;

        return {
            allocated,
            used
        };
    });
}


export function getDropboxData(token, appKey) {
    return Promise.all(
        [ getDisplayName(token, appKey), getSpaceUsage(token, appKey) ]
    ).then(([ userName, space ]) => {
        const { allocated, used } = space;
        return {
            userName,
            spaceLeft: Math.floor((allocated - used) / 1048576)// 1MiB=1048576B
        };
    }, error => {
        console.log("error", error);
        return undefined;
    });
}
