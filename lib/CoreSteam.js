const SteamTotp = require('steam-totp');
const request = require('./request');
const settings = require('./Settings');
const SteamUser = require('steam-user')

module.exports = function (coreInstance, auth, modules) {
    this.coreInstance = coreInstance;
    this.auth = auth || {};
    this.modules = modules || [];
    this.CookieList = [];
    this.prefixToConsole = ""; // will be set when SetConsoleLog is called
    this.ValidateAuth = function () {
        var valid = false;
        if(this.auth && this.auth[settings.AuthFieldNameUsername] && this.auth[settings.AuthFieldNamePassword]){
            valid = true;
        }
        return valid;
    },
    this.log = function () {
        var args = [];
        
        args.push( '\x1b[34m', this.prefixToConsole.replace("{{DATETIIMESTAMP}}", new Date().toUTCString()));
        //args.push(arguments.callee.caller);
        if(settings.Logging.ShowStack){
            var stack = new Error().stack;
            args.push( '\x1b[36m', stack.toString().split(/\r\n|\n/)[2]);
        }
        args.push('\x1b[0m');
        // Note: arguments is part of the prototype
        for( var i = 0; i < arguments.length; i++ ) {
            args.push( arguments[i] );
        }
        this.coreInstance.SaveToLog("log", this.auth[settings.AuthFieldNameUsername], args);
        this.coreInstance._log.apply( console, args );
    },
    this.logError = function () {
        var args = [];
        args.push( '\x1b[44m', '\x1b[34m', '🚩'+ this.prefixToConsole.replace("{{DATETIIMESTAMP}}", new Date().toUTCString()));
        //args.push(arguments.callee.caller);
        if(settings.Logging.ShowStack){
            var stack = new Error().stack;
            args.push( '\x1b[36m', stack.toString().split(/\r\n|\n/)[2]);
        }
        args.push('\x1b[0m');
        // Note: arguments is part of the prototype
        for( var i = 0; i < arguments.length; i++ ) {
            args.push( arguments[i] );
        }
        this.coreInstance.SaveToLog("error", this.auth[settings.AuthFieldNameUsername], args);
        this.coreInstance._logError.apply( console, args );
    },
    this.SetConsoleLog = function(steamID, module) {
        var textToShow = [];
        if(settings.Logging.ShowSpecialAccountText && this.auth[settings.AuthFieldSpecialAccountText]){
            textToShow.push(this.auth[settings.AuthFieldSpecialAccountText]);
        }
        if(steamID != null && settings.Logging.ShowAccountSteamId){
            textToShow.push(steamID);
        }
        if(settings.Logging.ShowAccountName){
            textToShow.push(this.auth[settings.AuthFieldNameUsername]);
        }
        var userLogPart = ''
        if(textToShow.length > 0){
            userLogPart = '[' + textToShow.join(" - ") + ']'
        }
        var moduleLogPart = "";
        if(module && module != null && module != "" && settings.Logging.ShowModule){
            moduleLogPart = '[' + module + ']';
        }
        var timeStampPart = "";
        if(settings.Logging.ShowTimeStamp){
            timeStampPart = '[{{DATETIIMESTAMP}}]';
        }
        this.prefixToConsole = timeStampPart + userLogPart + moduleLogPart;
    },
    this.Run = function () {
        return new Promise(function (resolve, reject) {
            var loginUserName = this.auth[settings.AuthFieldNameUsername];
            this.SetConsoleLog(null, null);
            if(!this.ValidateAuth(auth)){
                reject({message: "Auth is not valid", Auth: this.auth});
                return;
            }
            if(this.modules == null || this.modules.length == 0){
                this.log("no modules added to be runned");
                return;
            }
            let steamClient = new SteamUser();
            steamClient.logOn({
                accountName: this.auth[settings.AuthFieldNameUsername],
                password: this.auth[settings.AuthFieldNamePassword],
                twoFactorCode: SteamTotp.generateAuthCode(this.auth[settings.AuthFieldNamesharedSecret])
            });
            var loggedOn = false;
            var webSession = false;
            var webSessionData = {};
            steamClient.on('loggedOn', function(details) {
                this.log('Logged into Steam as ' + steamClient.steamID.getSteam3RenderedID());
                steamClient.setPersona(SteamUser.EPersonaState.Online);
                //client.gamesPlayed(440);
                loggedOn = true;
                runModules();
            }.bind(this));
                        
            steamClient.on('webSession', function(sessionID, cookies) {
                this.log('Got web session');
                webSession = true;
                webSessionData = {sessionID, cookies};
                runModules();

            }.bind(this));
            var runModules = async function () {
                // we await for both event to happen.  
                if(loggedOn && webSession){
                    var { _requestCommunity, _requestStore, _requestCheckoutStore, sessionID, newCookie } = await this.websession(webSessionData.sessionID, webSessionData.cookies);
                    var options = {
                        UserName: loginUserName,
                        steamUser: null,
                        steamFriends: null,
                        log: this.log.bind(this),
                        logError: this.logError.bind(this),
                        webCookie: newCookie,
                        requestCheckoutStore: _requestCheckoutStore
                    }
                    for (let i = 0; i < this.modules.length; i++) {
                        const module = this.modules[i];
                        this.SetConsoleLog(steamClient.steamID, module.name);
                        try {
                            await this.runModule(module.module, steamClient, _requestCommunity, _requestStore, sessionID, options);                            
                        } catch (error) {
                            this.logError("Module failed");
                            this.logError(error);
                        }
                    }
                    this.log("Account Done!");
                    steamClient.logOff();
                    resolve();
                    return;
                }
                this.SetConsoleLog(steamClient.steamID, null);
            }.bind(this);
        }.bind(this));
    };
    this.runModule = function(module, steamClient, _requestCommunity, _requestStore, sessionID, options) {
        return new Promise(function (resolve, reject) {
            module(steamClient, _requestCommunity, _requestStore, sessionID, options, function () {
                resolve();
            })
        })
    }
    this.websession = function(sessionID, newCookie) {	
        this.log("websession start");
        var _requestCommunity = new request('https://steamcommunity.com');
        var _requestStore = new request('https://store.steampowered.com');
        var _requestCheckoutStore = new request('https://checkout.steampowered.com');
        this.CookieList = newCookie;
        newCookie.forEach(function(name) {
            _requestCommunity.setCookie(name);
            _requestStore.setCookie(name);
            _requestCheckoutStore.setCookie(name);
        });
        return { _requestCommunity, _requestStore, _requestCheckoutStore, sessionID, newCookie };
    }
    this.SetSteamParental = function (_requestCommunity, sessionID, PIN) {
        return new Promise(function (resolve, reject) {
            _requestCommunity.post({
                url: 'https://steamcommunity.com/parental/ajaxunlock',
                json: true,
                headers: {
                    referer: 'https://steamcommunity.com/'
                },
                form: {
                  pin: PIN,
                  sessionid: sessionID
                }
            }, function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    return reject(error || new Error(response.statusCode));
                }
                if (!body || typeof body.success !== 'boolean') {
                    return reject('Invalid Response');
                }
                if (!body.success) {
                    return reject('Incorrect PIN');
                }              
                resolve();
            });
        }.bind(this))
    }
}