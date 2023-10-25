const settings = require('./Settings');
const {LoginSession, EAuthTokenPlatformType} = require('steam-session')
const SteamTotp = require('steam-totp');
const request = require('./request');

function websession(cookieList) {	
    var _request = new request();
    var sessionID = cookieList.find(c => c.startsWith('sessionid=')).split('=')[1]
    cookieList.forEach(function(name) {
        _request.setCookie(name);
    });
    return { _request, sessionID, cookieList };
}

module.exports = function (auth, coreSteam) {
    return new Promise(async function (resolve, reject) {
        //if we have cookies, we do a check to see if thay do work
        if(auth.cookies != null){
            coreSteam.log("Tesing last websession");
            var requestSession = websession(auth.cookies);
            try {
                var steamId = await GetSteamID(requestSession._request)
            } catch (error) {
                
            }
        }
        //if we get here, we have to sign into steam, and get the cookies agirn
        let session = new LoginSession(EAuthTokenPlatformType.WebBrowser);
        session.startWithCredentials({
            accountName: auth.username,
            password: auth.password,
            steamGuardCode: SteamTotp.getAuthCode(auth.sharedSecret)
        });
        session.on('authenticated', async () => {
            let webCookies = await session.getWebCookies();
            coreSteam.log("websession start");
            var requests = websession(webCookies)
            auth.SetCookies(webCookies);
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

        
        
    })
}