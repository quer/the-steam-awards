const Steam = require('steam');
const SteamTotp = require('steam-totp');
const SteamWebLogOn = require('steam-weblogon');
const HandleSentry = require('./HandleSentry');
const request = require('./request');
const settings = require('./Settings');
Steam.servers = require('./steamServer');

module.exports = function (coreInstance, auth, modules) {
    this.coreInstance = coreInstance;
    this.auth = auth || {};
    this.modules = modules || [];
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
            var steamClient = new Steam.SteamClient(),
                steamUser = new Steam.SteamUser(steamClient),
                steamFriends = new Steam.SteamFriends(steamClient),
                steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
            steamClient.connect();
            steamClient.on('servers', function(server) {
                //console.log(server);
            });
            this.log(loginUserName);
            steamUser.on('updateMachineAuth', function(sentry, callback) {
                HandleSentry.Save(loginUserName, sentry.bytes)
                callback({ sha_file: HandleSentry.MakeSha(sentry.bytes) });
            })
            steamClient.on('connected', function() {
                this.log("Connected to Steam.");
                var LoginObj = {
                    account_name: loginUserName,
                    password: this.auth[settings.AuthFieldNamePassword]
                }
                if(this.auth[settings.AuthFieldNamesharedSecret] && this.auth[settings.AuthFieldNamesharedSecret] != null){
                    LoginObj.two_factor_code = SteamTotp.getAuthCode(this.auth[settings.AuthFieldNamesharedSecret])
                }else{
                    var sentry = HandleSentry.Get(loginUserName);
                    if(sentry){
                        LoginObj.sha_sentryfile = sentry;
                    }
                }
                
                if(this.auth[settings.AuthFieldNameMailAuth] && this.auth[settings.AuthFieldNameMailAuth] != null){
                    LoginObj.auth_code = this.auth[settings.AuthFieldNameMailAuth]
                }
                steamUser.logOn(LoginObj);
            }.bind(this));
            
            steamClient.on('logOnResponse', async function onSteamLogOn(logonResp) {
                //this.log("logOnResponse");
                //this.log("logOnResponse", logonResp.eresult);
                if (logonResp.eresult == Steam.EResult.OK) {
                    this.SetConsoleLog(steamClient.steamID, null);
                    //console.log("logOnResponse OK");
                    steamFriends.setPersonaState(Steam.EPersonaState.Busy);
                    var { _requestCommunity, _requestStore, sessionID, newCookie } = await this.websession(steamWebLogOn, steamClient, steamUser);
                    var shoudRunAccount = true;
                    if(this.auth[settings.AuthFieldNameFamilyViewPIN]){
                        try {
                            await this.SetSteamParental(_requestCommunity, sessionID, this.auth[settings.AuthFieldNameFamilyViewPIN]);
                            
                        } catch (error) {
                            this.log("Parental activation, failed, error message: ", error);
                            shoudRunAccount = false;
                        }
                    }
                    if(shoudRunAccount){
                        var options = {
                            UserName: loginUserName,
                            steamUser: steamUser,
                            steamFriends: steamFriends,
                            log: this.log.bind(this),
                            logError: this.logError.bind(this),
                            webCookie: newCookie
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
                    }
                    this.SetConsoleLog(steamClient.steamID, null);
                }else if(logonResp.eresult == Steam.EResult.AccountLogonDenied && logonResp.email_domain){
                    this.log("steam have send you a mail whit the auth code.", logonResp);
                    
                }else if(logonResp.eresult == Steam.EResult.InvalidLoginAuthCode){
                    this.log("InvalidLoginAuthCode", logonResp);
                    
                }else if(logonResp.eresult == Steam.EResult.TwoFactorCodeMismatch){
                    this.log("TwoFactorCodeMismatch", logonResp);
                                      
                }else{
                    this.log("Error login to steam", logonResp);
                }
                steamClient.disconnect();
                this.log("Account disconnect");
                resolve();
            }.bind(this));
            steamClient.on('loggedOff', function onSteamLogOff(eresult) {
                this.log("Logged off from Steam.");
            }.bind(this));
    
            steamClient.on('error', async function onSteamError(error) {
                let delay = (ms) => new Promise((res) => setTimeout(res, ms));

                this.log("Connection closed by server - ", error);
                await delay(1000);
                steamClient.connect();
            }.bind(this));
        }.bind(this));
    };
    this.runModule = function(module, steamClient, _requestCommunity, _requestStore, sessionID, options) {
        return new Promise(function (resolve, reject) {
            module(steamClient, _requestCommunity, _requestStore, sessionID, options, function () {
                resolve();
            })
        })
    }
    this.websession = function(steamWebLogOn) {	
        return new Promise(function (resolve, reject) {
            this.log("websession start");
            steamWebLogOn.webLogOn(function(sessionID, newCookie) {
                var _requestCommunity = new request('https://steamcommunity.com');
                var _requestStore = new request('https://store.steampowered.com');
                newCookie.forEach(function(name) {
                    _requestCommunity.setCookie(name);
                    _requestStore.setCookie(name);
                });
                resolve({ _requestCommunity, _requestStore, sessionID, newCookie });
            });
        }.bind(this));
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




/**
 * Request licenses for one or more free-on-demand apps.
 * @param {int[]} appIDs
 */
 Steam.SteamUser.prototype.requestFreeLicense = function(appIDs) {
	if (!Array.isArray(appIDs)) {
		appIDs = [appIDs];
	}
	this._client.send({
		msg: Steam.EMsg.ClientRequestFreeLicense,
		proto: {}
	  }, new Steam.Internal.CMsgClientRequestFreeLicense({"appids": appIDs}).toBuffer());
};