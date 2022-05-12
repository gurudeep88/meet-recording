import { useLocation } from "react-router-dom";
import {GENERATE_TOKEN_URL, GET_PRESIGNED_URL, ENTER_FULL_SCREEN_MODE} from "../constants";
import linkifyHtml from 'linkify-html';
import { conference } from "../store/reducers/conference";

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

export async function getToken(profile, name, avatarColor) {
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: process.env.REACT_APP_API_KEY,
            user: {
                id: profile.id,
                avatar: avatarColor,
                name: name,
                email: profile.email
            },
            exp: "48 hours"
        })
    };

    
    try {
        const response = await fetch(GENERATE_TOKEN_URL, body);
        if (response.ok) {
            const json = await response.json();
            localStorage.setItem("SARISKA_TOKEN", json.token);
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

export function isSquare  (n) {
    return n > 0 && Math.sqrt(n) % 1 === 0;
};

export function  calculateSteamHeightAndExtraDiff(viewportWidth, viewportHeight, documentWidth, documentHeight)  {
    let videoStreamHeight = viewportHeight, videoStreamDiff = 0;
    if ( viewportWidth > documentWidth  ) {
        return {videoStreamHeight: documentWidth*9/16, videoStreamDiff: 0};
    }
    
    if ( viewportHeight * (16 / 9)  < viewportWidth )  {
        let diff = viewportWidth - viewportHeight*16/9;
        videoStreamHeight =  (viewportHeight * 16 / 9 + diff)*9/16;
        videoStreamDiff = viewportHeight * 16 / 9 + diff - viewportWidth;
    } else {
        videoStreamDiff =  viewportHeight * 16 / 9  - viewportWidth;
    }
    return { videoStreamHeight, videoStreamDiff };
}

export function calculateRowsAndColumns(totalParticipant, viewportWidth, viewportHeight) {
    const actualWidth = viewportWidth;
    const  actualHeight = viewportHeight;
    const numWindows = totalParticipant;
    let columns;
    let rows;
    let isAsymmetricView;
    let gridItemWidth, gridItemHeight, offset, lastRowOffset, lastRowWidth;

    if (isMobile()) {
        columns  = 2;
        rows  = Math.ceil(totalParticipant / columns);
        isAsymmetricView = true;
    } else if ( viewportWidth * 3 < viewportHeight  )  {
        columns  = 1;
        rows =  viewportWidth / columns;
        isAsymmetricView = true;
    } else if ( viewportWidth >  3 * viewportHeight) {
        rows = 1;
        columns = viewportHeight / rows;
        isAsymmetricView = true;
    } else {
        columns = Math.ceil(Math.sqrt(numWindows));
        rows = Math.ceil(numWindows / columns);
    }

    if (isAsymmetricView) {
        viewportHeight  = viewportHeight - ( rows + 1 )*12;
        viewportWidth  = viewportWidth - (columns +  1)*12;
        
        gridItemHeight = viewportHeight / rows;
        gridItemWidth = viewportWidth / columns;

        offset  =  0;
        lastRowOffset =  (viewportWidth - ((totalParticipant % (columns + 1)) * gridItemWidth))/2; 
        
        if ( totalParticipant % columns  === 0 ) {
            lastRowOffset = offset;
        }

        return  { 
            rows: rows , 
            columns: columns, 
            gridItemWidth, 
            gridItemHeight,
            offset, 
            lastRowOffset 
        }
    }

    if (totalParticipant === 1) {
        return { 
            rows,
            columns, 
            gridItemWidth: viewportWidth, 
            gridItemHeight: viewportHeight
        };
    }

    if (totalParticipant === 2) {
        viewportWidth = viewportWidth - 36;
        gridItemWidth  = viewportWidth / (rows + 1);
        return { 
            rows, 
            columns, 
            gridItemWidth, 
            gridItemHeight: gridItemWidth * 9/16, 
            offset: 12 , 
            lastRowWidth: gridItemWidth,
            lastRowOffset: 12
        };
    }

    if (isSquare(totalParticipant) || totalParticipant <= 4) {
        viewportHeight  = viewportHeight - (columns - 1)*12;
        viewportWidth = viewportWidth - (columns - 1)*12;;
        gridItemHeight  =  viewportHeight / rows;
        gridItemWidth = gridItemHeight * 16/9;
        offset  =  (viewportWidth -  (columns * gridItemWidth))/2;  
        const lastRowParticipantCount = (totalParticipant % columns === 0 ? columns: totalParticipant % columns );
        lastRowOffset =  (actualWidth  - (lastRowParticipantCount * gridItemWidth) - (lastRowParticipantCount - 1)*12 )/2;

        return { 
            rows, 
            columns, 
            gridItemWidth, 
            gridItemHeight, 
            offset, 
            lastRowOffset,
            lastRowWidth: gridItemWidth
        }
    } else if ( rows < columns ) {
        viewportHeight  = viewportHeight - ( rows - 1 )*12;
        viewportWidth  = viewportWidth - (columns +  1)*12;
        gridItemWidth =  viewportWidth / (rows + 1);
        gridItemHeight =  viewportHeight / (columns - 1);
        lastRowWidth = gridItemHeight  *   16/9;
        offset  =  (viewportWidth -  (columns * gridItemWidth))/2 || 12;
        if ( totalParticipant % columns === 0  || (totalParticipant % columns) * gridItemHeight * 16/9  >  actualWidth) {
            lastRowWidth = gridItemWidth;
        }
        const lastRowParticipantCount = totalParticipant % columns === 0 ? columns :  totalParticipant % columns;
        lastRowOffset =  (actualWidth - (lastRowParticipantCount * lastRowWidth) - (lastRowParticipantCount - 1)*12 )/2 ;

        return { 
            rows, 
            columns, 
            gridItemWidth, 
            gridItemHeight, 
            offset, 
            lastRowOffset,
            lastRowWidth
        };
    }  else if ( rows === columns) {
        rows = rows  - 1;
        columns  = columns + 1;  
        viewportHeight  = viewportHeight - ( rows - 1 ) * 12;
        viewportWidth  = viewportWidth - ( columns +  1 ) * 12;
        
        gridItemHeight = viewportHeight / rows;
        gridItemWidth = viewportWidth / columns;
        offset  =  (viewportWidth -  (columns * gridItemWidth))/2 || 12;  
        lastRowWidth = gridItemHeight  *   16/9;
        if ( totalParticipant % columns === 0  || (totalParticipant % columns) * gridItemHeight * 16/9 >  actualWidth) {
            lastRowWidth = gridItemWidth;
        }
        const lastRowParticipantCount = totalParticipant % columns === 0 ? columns :  totalParticipant % columns;
        lastRowOffset =  (actualWidth - (lastRowParticipantCount * lastRowWidth) - (lastRowParticipantCount - 1)*12 )/2 ;

        return  { 
            rows, 
            columns, 
            gridItemWidth, 
            gridItemHeight, 
            offset,
            lastRowWidth,
            lastRowOffset 
        }
    } else {
        viewportHeight  = viewportHeight - ( rows - 1 ) * 12;
        viewportWidth  = viewportWidth - ( columns +  1 ) * 12;
        
        gridItemHeight = viewportHeight / rows;
        gridItemWidth = viewportWidth / columns;

        offset  =  (viewportWidth -  (columns* gridItemWidth))/2 || 12;  
        lastRowWidth = gridItemHeight  *   16/9;
        if ( totalParticipant % columns === 0  || (totalParticipant % columns) * gridItemHeight * 16/9 >  actualWidth) {
            lastRowWidth = gridItemWidth;
        }
        const lastRowParticipantCount = totalParticipant % columns === 0 ? columns :  totalParticipant % columns;
        lastRowOffset =  (actualWidth - lastRowParticipantCount * lastRowWidth - (lastRowParticipantCount - 1)*12 )/2 ;

        return  { 
            rows, 
            columns, 
            gridItemWidth, 
            gridItemHeight, 
            offset,
            lastRowWidth,
            lastRowOffset 
        }
    }
} 

export function isMobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

export function getLeftTop(i,  j,  gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, participantCount, viewportHeight, lastRowWidth, documentHeight){
    let left, top; 
    if ( (rows - 1 ) === i) {
       left  = lastRowOffset + (j * lastRowWidth) + j*12;
    } else {
       left  = offset + (j * gridItemWidth) +  j*12
    }
    top  =   (i *  gridItemHeight + i*12);
    if ( participantCount === 2 ) {
        return { left, top: (documentHeight - gridItemHeight) / 2};
    }
    return { left, top };
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

export function isFullscreen(){
    let isInFullScreen =
    (document.fullscreenElement && document.fullscreenElement !== null) ||
    (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
    (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null);   
    return isInFullScreen;
}

export function requestFullscreen() {
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
}

export function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

export function getSharedDocumentIframeUrl(conference) {
    return `https://etherpad.sariska.io/p/${conference.connection.name}?userName=${conference.getLocalUser().name}&showChat=false&showControls=false&chatAndUsers=false`;     
}

export function appendLinkTags(type, conference) {
    var preloadLink = document.createElement("link");
    preloadLink.href = type === "whiteboard" ? getWhiteIframeUrl(conference) : getSharedDocumentIframeUrl(conference);
    preloadLink.rel = "preload";
    preloadLink.as = "document";
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
    const options = { defaultProtocol: 'https',   target: '_blank'};
    return linkifyHtml(inputText, options);
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
