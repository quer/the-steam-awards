const fs = require('fs');
const config = require('../config');
const Steam = require('steam');
const SteamTotp = require('steam-totp');
const SteamWebLogOn = require('steam-weblogon');
const request = require('./request');
Steam.servers = require('./steamServer');
var originalConsoleLog = console.log;
var originalConsoleError = console.error;
module.exports = {
    Setting: {
        AuthFieldNameUsername: "steam_user",
        AuthFieldNamePassword: "steam_pass",
        AuthFieldNamesharedSecret: "sharedSecret",
        Logging: {
            ShowTimeStamp: true,
            ShowAccountSteamId: true,
            ShowAccountName: true,
            ShowStack: true,
            ShowModule: true,
            SaveLog: true,
            SaveLogMode: 2 //Enums.logging.?
        },
        RunningMode: {
            Mode: 0,
            clusterSize: 4
        },
        MinTimeBetweenRequest: 1000 // 1000 is 1 sec
    },
    Enums: {
        logging: {
            all: 0,
            OnlyError: 1,
            None: 2
        },
        RunningMode:{
            single: 0,
            cluster: 1,
            All: 2
        }
    },
    RunBot: function (auth, modules) {
        return new Promise(function (resolve, reject) {
            var loginUserName = auth[this.Setting.AuthFieldNameUsername];
            this.SetConsoleLog(loginUserName, null, null);
            if(!this.ValidateAuth(auth)){
                reject({message: "Auth is not valid", Auth: auth});
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
            console.log(loginUserName);
            steamClient.on('connected', function() {
                console.log("Connected to Steam.");
                var LoginObj = {
                    account_name: loginUserName,
                    password: auth[this.Setting.AuthFieldNamePassword]
                }
                if(auth[this.Setting.AuthFieldNamesharedSecret] && auth[this.Setting.AuthFieldNamesharedSecret] != null){
                    LoginObj.two_factor_code = SteamTotp.getAuthCode(auth[this.Setting.AuthFieldNamesharedSecret])
                }
                steamUser.logOn(LoginObj);
            }.bind(this));
            
            steamClient.on('logOnResponse', async function onSteamLogOn(logonResp) {
                //console.log("logOnResponse");
                //console.log("logOnResponse", logonResp.eresult);
                if (logonResp.eresult == Steam.EResult.OK) {
                    this.SetConsoleLog(loginUserName, steamClient.steamID, null);
                    //console.log("logOnResponse OK");
                    steamFriends.setPersonaState(Steam.EPersonaState.Busy);
                    var { _requestCommunity, _requestStore, sessionID } = await websession(steamWebLogOn, steamClient, steamUser);
                    var options = {
                        UserName: loginUserName,
                        steamUser: steamUser,
                        steamFriends: steamFriends,
                        accountPretty: steamClient.steamID + " - " + loginUserName + ":",

                    }
                    for (let i = 0; i < modules.length; i++) {
                        const module = modules[i];
                        this.SetConsoleLog(options.UserName, steamClient.steamID, module.name);
                        try {
                            await runModule(module.module, steamClient, _requestCommunity, _requestStore, sessionID, options);                            
                        } catch (error) {
                            console.error("Module failed");
                            console.error(error);
                        }
                    }
                    console.log("Account Done!");
                    resolve();
                }else{
                    console.log("Error login to steam", logonResp);
                }
            }.bind(this));
            steamClient.on('loggedOff', function onSteamLogOff(eresult) {
                console.log("Logged off from Steam.");
                steamClient.connect();
            });

            steamClient.on('error', function onSteamError(error) {
                console.log("Connection closed by server - ", error);
                steamClient.connect();
            });
        }.bind(this));
    },
    LoadModules: function (list) {
        var modules = [];
        try {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                var name = item.split("/").pop();
                modules.push({name: name, module: require('../modules/' + item)})
            }
        } catch (error) {
            console.log("Somefing went wrong, loading the modules in to cache")
            console.log(error);
            modules = null;
        }
        return modules;
    },
    //run all accounts
    RunAllBots: async function (modules) {
        await this.DoRunBots(config, modules);
    },
    RunIndexSpecificBot: async function (indexList, modules) {
        var authToRun = [];
        for (let i = 0; i < indexList.length; i++) {
            authToRun.push(config[indexList[i]])
        }
        await this.DoRunBots(authToRun, modules);
    },
    DoRunBots: async function (auths, modules) {
        //ensure there are modules
        if(modules == null && modules.length == 0){
            console.log("no modules added to be runned");
            return;
        }
        //load the modules
        try {
            modules = await this.LoadModules(modules);
        } catch (error) {
            console.log("Failed loading the modules, maby one of them do not exist");
            console.log(error);
            return;
        }
        if(modules == null && modules.length == 0){
            console.log("no modules added to be runned");
            return;
        }
        //run all at once
        if(this.Setting.RunningMode.Mode == this.Enums.RunningMode.All){
            var allPromises = [];
            for (let i = 0; i < auths.length; i++) {
                allPromises.push(this.RunBot(auths[i], modules))
            }
            await Promise.allSettled(allPromises);
        }
        else if(this.Setting.RunningMode.Mode == this.Enums.RunningMode.cluster){
            var size = this.Setting.RunningMode.clusterSize;
            var buildingcluster = [];
            var buildSize = 0;
            for (let i = 0; i < auths.length; i++) {
                buildingcluster.push(this.RunBot(auths[i], modules))
                if(buildSize >= size){
                    //run the cluster pack, before doing the next
                    await Promise.allSettled(buildingcluster);
                    buildingcluster = [];
                    buildSize = 0;
                }
                ++buildSize;
            }
            if(buildingcluster.length > 0){
                await Promise.allSettled(buildingcluster);
            }
        }
        else if(this.Setting.RunningMode.Mode == this.Enums.RunningMode.single)
        {
            for (let i = 0; i < auths.length; i++) {
                const auth = auths[i];
                const PromiseSync = this.RunBot(auth, modules);
                try {
                    await PromiseSync;
                } catch (error) {
                    console.log("Somefing went wrong")
                    console.log(error);
                }
            }
        }
        console.log("All Done!");
    },
    ValidateAuth: function (auth) {
        var valid = false;
        if(auth && auth[this.Setting.AuthFieldNameUsername] && auth[this.Setting.AuthFieldNamePassword]){
            valid = true;
        }
        return valid;
    },
    SetConsoleLog: function(userName, steamID, module) {
        var userLogPart = "";
        if(userName != null || steamID != null){
            var steamIDLogPart = "";
            if(steamID != null && this.Setting.Logging.ShowAccountSteamId){
                steamIDLogPart = steamID;
            }
            if(userName != null && this.Setting.Logging.ShowAccountName){
                if(steamIDLogPart != ""){
                    steamIDLogPart += ' - ';
                }
                steamIDLogPart += userName;
            }
            if(steamIDLogPart != ""){        
                userLogPart = '[' + steamIDLogPart + ']'
            }
        }
        var moduleLogPart = "";
        if(module && module != null && module != "" && this.Setting.Logging.ShowModule){
            moduleLogPart = '[' + module + ']';
        }
        var timeStampPart = "";
        if(this.Setting.Logging.ShowTimeStamp){
            timeStampPart = '[' + new Date().toUTCString() + ']';
        }
        var prefixToConsole = timeStampPart + userLogPart + moduleLogPart;
        
        console.log = function() {
            args = [];
            args.push( '\x1b[34m', prefixToConsole);
            //args.push(arguments.callee.caller);
            if(this.Setting.Logging.ShowStack){
                var stack = new Error().stack;
                args.push( '\x1b[36m', stack.toString().split(/\r\n|\n/)[2]);
            }
            args.push('\x1b[0m');
            // Note: arguments is part of the prototype
            for( var i = 0; i < arguments.length; i++ ) {
                args.push( arguments[i] );
            }
            originalConsoleLog.apply( console, args );
        }.bind(this);
    
        console.error = function() {
            args = [];
            args.push( '\x1b[44m', '\x1b[34m', '🚩'+ prefixToConsole);
            //args.push(arguments.callee.caller);
            if(this.Setting.Logging.ShowStack){
                var stack = new Error().stack;
                args.push( '\x1b[36m', stack.toString().split(/\r\n|\n/)[2]);
            }
            args.push('\x1b[0m');
            // Note: arguments is part of the prototype
            for( var i = 0; i < arguments.length; i++ ) {
                args.push( arguments[i] );
            }
            originalConsoleError.apply( console, args );
        }.bind(this);
    }
}
function websession(steamWebLogOn) {	
    return new Promise(function (resolve, reject) {
        console.log("websession start");
        steamWebLogOn.webLogOn(function(sessionID, newCookie) {
            var _requestCommunity = new request('https://steamcommunity.com');
            var _requestStore = new request('https://store.steampowered.com');
            newCookie.forEach(function(name) {
                _requestCommunity.setCookie(name);
                _requestStore.setCookie(name);
            });
            resolve({ _requestCommunity, _requestStore, sessionID });
        });
    });
}
function runModule(module, steamClient, _requestCommunity, _requestStore, sessionID, options) {
    return new Promise(function (resolve, reject) {
        module(steamClient, _requestCommunity, _requestStore, sessionID, options, function () {
            resolve();
        })
    })
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