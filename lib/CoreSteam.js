const settings = require('./Settings');
const SteamConnection = require('./SteamConnection');

module.exports = function (coreInstance, auth, modules) {
    this.coreInstance = coreInstance;
    this.auth = auth || {};
    this.modules = modules || [];
    this.CookieList = [];
    this.prefixToConsole = ""; // will be set when SetConsoleLog is called
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
        this.coreInstance.SaveToLog("error", this.auth.username, args);
        this.coreInstance._logError.apply( console, args );
    },
    this.SetConsoleLog = function(steamID, module) {
        var textToShow = [];
        if(settings.Logging.ShowSpecialAccountText && this.auth.specialAccountText){
            textToShow.push(this.auth.specialAccountText);
        }
        if(steamID != null && settings.Logging.ShowAccountSteamId){
            textToShow.push(steamID);
        }
        if(settings.Logging.ShowAccountName){
            textToShow.push(this.auth.username);
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
        return new Promise(async function (resolve, reject) {
            var loginUserName = this.auth.username;
            this.SetConsoleLog(null, null);
            if(!auth.Validate()){
                reject({message: "Auth is not valid", Auth: this.auth});
                return;
            }
            if(this.modules == null || this.modules.length == 0){
                this.log("no modules added to be runned");
                resolve();
                return;
            }
            var steamConnection = new SteamConnection(this);
            var { _request, sessionID, newCookie } = await require('./WebCookies')(this.auth, this)//await this.websession(steamWebLogOn, steamClient, steamUser);
            var shoudRunAccount = true;
            if(this.auth.PIN != null){
                try {
                    await this.SetSteamParental(_request, sessionID, this.auth.PIN);
                    
                } catch (error) {
                    this.log("Parental activation, failed, error message: ", error);
                    shoudRunAccount = false;
                }
            }
            if(shoudRunAccount){
                var options = {
                    UserName: loginUserName,
                    log: this.log.bind(this),
                    logError: this.logError.bind(this),
                    webCookie: newCookie,
                    steamid: function () {
                        return this.auth.GetSteamID(_request);
                    }
                }
                for (let i = 0; i < this.modules.length; i++) {
                    const module = this.modules[i];
                    this.SetConsoleLog(loginUserName, module.name);
                    try {
                        await this.runModule(module.module, steamConnection, _request, sessionID, options);                            
                    } catch (error) {
                        this.logError("Module failed");
                        this.logError(error);
                    }
                }
                this.SetConsoleLog(loginUserName, null);
                this.log("Account Done!");
            }
            this.SetConsoleLog(loginUserName, null);
            resolve();

        }.bind(this));
    };
    this.runModule = function(module, steamConnection, _request, sessionID, options) {
        return new Promise(function (resolve, reject) {
            module(steamConnection, _request, sessionID, options, function () {
                resolve();
            })
        })
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