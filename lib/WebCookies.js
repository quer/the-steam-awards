const settings = require('./Settings');
const {LoginSession, EAuthTokenPlatformType} = require('steam-session')
const SteamTotp = require('steam-totp');
const request = require('./request');

module.exports = function (auth, coreSteam) {
    return new Promise(function (resolve, reject) {
        let session = new LoginSession(EAuthTokenPlatformType.WebBrowser);
        session.startWithCredentials({
            accountName: auth[settings.AuthFieldNameUsername],
            password: auth[settings.AuthFieldNamePassword],
            steamGuardCode: SteamTotp.getAuthCode(auth[settings.AuthFieldNamesharedSecret])
        });
        session.on('authenticated', async () => {
            let webCookies = await session.getWebCookies();
            var requests = websession(webCookies)
            resolve(requests)
        });
        
        session.on('timeout', () => {
            coreSteam.log('This login attempt has timed out.');
            reject();
        });
        
        session.on('error', (err) => {
            // This should ordinarily not happen. This only happens in case there's some kind of unexpected error while
            // polling, e.g. the network connection goes down or Steam chokes on something.
            coreSteam.log(`ERROR: This login attempt has failed! ${err.message}`);
            reject();
        });

        
        var websession = function(cookieList) {	
            coreSteam.log("websession start");
            var _requestCommunity = new request('https://steamcommunity.com');
            var _requestStore = new request('https://store.steampowered.com');
            var _requestCheckoutStore = new request('https://checkout.steampowered.com');
            var sessionID = cookieList.filter(x => x.includes("sessionid="))[0].replace("sessionid=", 0)
            cookieList.forEach(function(name) {
                _requestCommunity.setCookie(name);
                _requestStore.setCookie(name);
                _requestCheckoutStore.setCookie(name);
            });
            return { _requestCommunity, _requestStore, _requestCheckoutStore, sessionID, cookieList };
        }
    })
}