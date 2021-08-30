
const URI_PROTOCOL_PATTERN = '^([a-z][a-z0-9\\.\\+-]*:)';
const _URI_PATH_PATTERN = '([^?#]*)';
const _URI_AUTHORITY_PATTERN = '(//[^/?#]+)';

export function parseStandardURIString(str) {
    /* eslint-disable no-param-reassign */

    const obj = {};

    let regex;
    let match=  null;

    // XXX A URI string as defined by RFC 3986 does not contain any whitespace.
    // Usually, a browser will have already encoded any whitespace. In order to
    // avoid potential later problems related to whitespace in URI, strip any
    // whitespace. Anyway, the Jitsi Meet app is not known to utilize unencoded
    // whitespace so the stripping is deemed safe.
    str = str.replace(/\s/g, '');

    // protocol
    regex = new RegExp(URI_PROTOCOL_PATTERN, 'gi');
    match = regex.exec(str);
    if (match) {
        obj.protocol = match[1].toLowerCase();
        str = str.substring(regex.lastIndex);
    }

    // authority
    regex = new RegExp(`^${_URI_AUTHORITY_PATTERN}`, 'gi');
    match = regex.exec(str);
    if (match) {
        let authority = match[1].substring(/* // */ 2);

        str = str.substring(regex.lastIndex);

        // userinfo
        const userinfoEndIndex = authority.indexOf('@');

        if (userinfoEndIndex !== -1) {
            authority = authority.substring(userinfoEndIndex + 1);
        }

        obj.host = authority;

        // port
        const portBeginIndex = authority.lastIndexOf(':');

        if (portBeginIndex !== -1) {
            obj.port = authority.substring(portBeginIndex + 1);
            authority = authority.substring(0, portBeginIndex);
        }

        // hostname
        obj.hostname = authority;
    }

    // pathname
    regex = new RegExp(`^${_URI_PATH_PATTERN}`, 'gi');
    match = regex.exec(str);

    let pathname;

    if (match) {
        pathname = match[1];
        str = str.substring(regex.lastIndex);
    }
    if (pathname) {
        pathname.startsWith('/') || (pathname = `/${pathname}`);
    } else {
        pathname = '/';
    }
    obj.pathname = pathname;

    // query
    if (str.startsWith('?')) {
        let hashBeginIndex = str.indexOf('#', 1);

        if (hashBeginIndex === -1) {
            hashBeginIndex = str.length;
        }
        obj.search = str.substring(0, hashBeginIndex);
        str = str.substring(hashBeginIndex);
    } else {
        obj.search = ''; // Google Chrome
    }

    // fragment
    obj.hash = str.startsWith('#') ? str : '';

    /* eslint-enable no-param-reassign */

    return obj;
}
