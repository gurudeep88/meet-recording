import { useLocation } from "react-router-dom";
import {GENERATE_TOKEN_URL, CHECK_ROOM_URL, GET_PRESIGNED_URL} from "../constants";

const Compressor = require('compressorjs');


export function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function getMeetingId() {
    const characters ='abcdefghijklmnopqrstuvwxyz';
    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const str = generateString(9).trim()
    const strArr = str.match(/.{3}/g);
    return strArr.join("-");
}


export function getJitsiMeetGlobalNS() {
    if (!window.SariskaMediaTransport) {
        window.SariskaMediaTransport = {};
    }

    if (!window.SariskaMediaTransport.app) {
        window.SariskaMediaTransport.app = {};
    }

    return window.SariskaMediaTransport.app;
}


export function createDeferred() {
    const deferred = {};

    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
}

export async function checkRoom(room) {
    try {
        const response = await fetch(`${CHECK_ROOM_URL}/${room}`);
        if (response.ok) {
            const json = await response.json();
            return json.id;
        } else {
            console.log(response.status);
        }
    } catch (error) {
        console.log('error', error);
    }
}

export async function getToken(profile, name, isModerator) {
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: `27fd6f8080d512442a3694f461adb3986cda5ba39dbe368d75`,
            user: {
                id: profile.id,
                avatar: profile.avatar,
                name: name,
                email: profile.email,
                moderator: isModerator
            }
        })
    };

    try {
        const response = await fetch(GENERATE_TOKEN_URL, body);
        if (response.ok) {
            const json = await response.json();
            localStorage.setItem("SARISKA_TOKEN", json.token)
            return json.token;
        } else {
            console.log(response.status);
        }
    } catch (error) {
        console.log('error', error);
    }
}

export const getUserById = (id, conference) => {
     if (id === conference.myUserId()) {
         return conference.getLocalUser()
     }
     return conference?.participants[id]?._identity?.user
}

export const clearAllTokens = () => {
    Object.entries(localStorage).map(x => x[0]).filter(
            x => x.substring(0,8)==="sariska_"
        ).map(
            x => localStorage.removeItem(x))
}

export function calculateRowsAndColumns(totalParticipant, viewportWidth, viewportHeight) {
    const numWindows = totalParticipant;
    const columns = Math.ceil(Math.sqrt(numWindows));
    const rows = Math.ceil(numWindows / columns);
    const gridItemWidth = viewportWidth / columns;
    let gridItemHeight = viewportHeight / rows;
    if ( gridItemHeight > gridItemWidth*9/16 ) {
        gridItemHeight  = gridItemWidth*9/16
    }

    return { rows, columns, gridItemWidth, gridItemHeight};
}

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function videoShadow(level) {
    const scale = 2;

    // Internal circle audio level.
    const int = {
        level: level > 0.15 ? 20 : 0,
        color: "rgba(255,255,255,0.4)"
    };

    // External circle audio level.
    const ext = {
        level: parseFloat(
            ((int.level * scale * level) + int.level).toFixed(0)),
        color: "rgba(255,255,255,0.2)"
    };

    // Internal blur.
    int.blur = int.level ? 2 : 0;

    // External blur.
    ext.blur = ext.level ? 6 : 0;

    return [
        `0 0 ${int.blur}px ${int.level}px ${int.color}`,
        `0 0 ${ext.blur}px ${ext.level}px ${ext.color}`
    ].join(', ');
}

export function getWhiteIframeUrl(conference) {
    return `https://whiteboard.sariska.io/boards/${conference.connection.name}?authorName=${conference.getLocalUser().name}`;     

}

export function getSharedDocumentIframeUrl(conference) {
    return `https://etherpad.sariska.io/p/${conference.connection.name}?userName=${conference.getLocalUser().name}&showChat=false&showControls=false&chatAndUsers=false`;     
}

export function appendLinkTags(type, conference) {
    var preloadLink = document.createElement("link");
    preloadLink.href = type === "whiteboard" ? getWhiteIframeUrl(conference) : getSharedDocumentIframeUrl(conference);
    preloadLink.rel = "preload";
    preloadLink.as = "script";
    document.head.appendChild(preloadLink);
}

export function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export function preloadIframes(conference) {
    appendLinkTags("whiteboard", conference);
    appendLinkTags("sharedDocument", conference);
}

export const trimSpace = (str) => {
    return str.replace(/\s/g,'');
}

export const detectUpperCaseChar = (char) => {
    return char === char.toUpperCase() && char !== char.toLowerCase();
}

export const linkify=(inputText) =>{
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" >$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" >$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" >$1</a>');
    return replacedText;
}

export function encodeHTML(str){
    return str.replace(/([\u00A0-\u9999<>&])(.|$)/g, function(full, char, next) {
        if(char !== '&' || next !== '#'){
            if(/[\u00A0-\u9999<>&]/.test(next))
                next = '&#' + next.charCodeAt(0) + ';';

            return '&#' + char.charCodeAt(0) + ';' + next;
        }

        return full;
    });
}


export function getPresignedUrl(params) {
    return new Promise((resolve, reject) => {
        const body = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("SARISKA_TOKEN")}`
            },
            body: JSON.stringify({
                fileType: params.fileType,
                fileName: params.fileName
            })
        };

        fetch(GET_PRESIGNED_URL, body)
            .then((response) => {
                if (response.ok) {
                    return response.json(); //then consume it again, the error happens
                }
            })
            .then(function (response) {
                console.log('response', response)
                resolve(response);
            }).catch((error) => {
            reject(error)
        })
    });
}


export function compressFile(file, type) {
    return new Promise((resolve, reject) => {
        if (type === "attachment") {
            resolve(file);
        } else {
            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    console.log('result', result)
                    resolve(result);
                },
                error(err) {
                    console.log('err', err)
                    reject(err.message);
                }
            });
        }
    });
}

export function getUniqueNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}


export function formatBytes(bytes) {
    var marker = 1024; // Change to 1000 if required
    var decimal = 3; // Change as required
    var kiloBytes = marker; // One Kilobyte is 1024 bytes
    var megaBytes = marker * marker; // One MB is 1024 KB
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB
    var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

    // return bytes if less than a KB
    if (bytes < kiloBytes) return bytes + " Bytes";
    // return KB if less than a MB
    else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
    // return MB if less than a GB
    else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
    // return GB if less than a TB
    else return (bytes / gigaBytes).toFixed(decimal) + " GB";
}
