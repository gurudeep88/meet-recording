import Bourne from '@hapi/bourne';
const blacklist = [ '__proto__', 'constructor', 'prototype' ];

export function parseURLParams(url, dontParse = false, source = 'hash') {
    const paramStr = source === 'search' ? url.search : url.hash;
    const params = {};
    const paramParts = (paramStr && paramStr.substr(1).split('&')) || [];

    // Detect and ignore hash params for hash routers.
    if (source === 'hash' && paramParts.length === 1) {
        const firstParam = paramParts[0];

        if (firstParam.startsWith('/') && firstParam.split('&').length === 1) {
            return params;
        }
    }

    paramParts.forEach(part => {
        const param = part.split('=');
        const key = param[0];

        if (!key || key.split('.').some(k => blacklist.includes(k))) {
            return;
        }

        let value;

        try {
            value = param[1];

            if (!dontParse) {
                const decoded = decodeURIComponent(value).replace(/\\&/, '&');

                value = decoded === 'undefined' ? undefined : Bourne.parse(decoded);
            }
        } catch (e) {
            return;
        }
        params[key] = value;
    });

    return params;
}
