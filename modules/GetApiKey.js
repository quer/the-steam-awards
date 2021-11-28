/** @typedef {(apiKey: string|null) => void} ApiKeyResolve */

/** @typedef {(error: string|null, statusCode: number) => void} ApiKeyReject */

/**
 * @param {module:request} RequestCommunity
 * @param {ApiKeyResolve} resolve
 * @param {ApiKeyReject} reject
 */
function RequestApiKey(RequestCommunity, resolve, reject) {
    RequestCommunity.get('https://steamcommunity.com/dev/apikey?l=english', function (error, response, body) {
        if (error || response.statusCode >= 400) {
            return reject(error || 'Was not able to pick the apiKey.', response ? response.statusCode : 0);
        }
        return resolve(ParseApiKeyFromHtml(body));
    });
}

/**
 * @param {string} body
 * @returns {null|string}
 */
const ParseApiKeyFromHtml = function (body) {
    const [, apiKey] = body.match(/Key:\s+([0-9A-Z]{32})/) || [];
    if (typeof apiKey === 'undefined') {
        return null;
    }

    return apiKey;
}


/**
 * Get and output apiKey.
 * @param {SteamClient} steamClient
 * @param {module:request} RequestCommunity
 * @param {module:request} RequestStore
 * @param {string} SessionID
 * @param {Object} options
 * @param {function} callback
 */
function GetApiKey(steamClient, RequestCommunity, RequestStore, SessionID, options, callback) {
    RequestApiKey(RequestCommunity, function (apiKey) {
        console.log({apiKey}, options.accountPretty, 'ok');
        setTimeout(callback, 700);

    }, function (error, statusCode) {

        // 429: in error case, sleep longer
        const min = 1;
        console.log('.. sleep', min, 'min ...');
        setTimeout(function () {
            console.log(error, options.accountPretty, statusCode);
            callback();
        }, min * 60 * 1000);
    });
}

/**
 * Get apiKey as promise.
 * @note Use this function in other modules.
 * @param {module:request} RequestCommunity
 * @param {Object} options
 * @returns {Promise<string|null>}
 */
GetApiKey.asPromise = function (RequestCommunity, options) {
    return new Promise(function (resolve) {
        RequestApiKey(RequestCommunity, resolve, function (error, statusCode) {
            console.log(error, options.accountPretty, statusCode);
            resolve(null);
        });
    });
}

module.exports = GetApiKey;
