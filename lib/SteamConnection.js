const Steam = require('steam');
const SteamTotp = require('steam-totp');
const SteamWebLogOn = require('steam-weblogon');
const HandleSentry = require('./HandleSentry');
Steam.servers = require('./steamServer');

module.exports = function (coreSteam) {
    this.coreSteam = coreSteam;
    this.callbackWhenConnected = [];
    this.isLogin = false;
    this.isconnection = false;
    this.steamClient = new Steam.SteamClient();
    this.steamUser = new Steam.SteamUser(this.steamClient);
    this.steamFriends = new Steam.SteamFriends(this.steamClient);
    
    this.CheckAndConnectToSteam = function () {
        return new Promise(function (resolve, reject) {
            if(!this.login && !this.isconnection){
                this.isconnection = true;
                this.steamClient.connect();
                this.steamClient.on('servers', function(server) {
                    //console.log(server);
                });
                //this.coreSteam.log(loginUserName);
                this.steamUser.on('updateMachineAuth', function(sentry, callback) {
                    HandleSentry.Save(loginUserName, sentry.bytes)
                    callback({ sha_file: HandleSentry.MakeSha(sentry.bytes) });
                })
                this.steamClient.on('connected', function() {
                    this.coreSteam.log("Connected to Steam.");
                    var LoginObj = {
                        account_name: this.coreSteam.auth.username,
                        password: this.coreSteam.auth.password
                    }
                    if(this.coreSteam.auth.sharedSecret != null){
                        LoginObj.two_factor_code = SteamTotp.getAuthCode(this.coreSteam.auth.sharedSecret)
                    }else if(this.coreSteam.auth.twoFactorCode != null){
                        LoginObj.two_factor_code = this.coreSteam.auth.twoFactorCode;
                    }else{
                        var sentry = HandleSentry.Get(this.coreSteam.auth.username);
                        if(sentry){
                            LoginObj.sha_sentryfile = sentry;
                        }
                    }
                    
                    if(this.coreSteam.auth.mailAuth != null){
                        LoginObj.auth_code = this.coreSteam.auth.mailAuth
                    }
                    this.steamUser.logOn(LoginObj);
                }.bind(this));
                
                this.steamClient.on('logOnResponse', async function onSteamLogOn(logonResp) {
                    //this.log("logOnResponse");
                    //this.log("logOnResponse", logonResp.eresult);
                    if (logonResp.eresult == Steam.EResult.OK) {
                        this.steamFriends.setPersonaState(Steam.EPersonaState.Busy);
                        this.login = true;
                        this.isconnection = false;
                        for (let i = 0; i < this.callbackWhenConnected.length; i++) {
                            this.callbackWhenConnected[i]();
                        }
                        this.callbackWhenConnected = []; // reset
                        resolve();
                        return;
                    }else if(logonResp.eresult == Steam.EResult.AccountLogonDenied && logonResp.email_domain){
                        this.coreSteam.log("steam have send you a mail whit the auth code.", logonResp);
                        
                    }else if(logonResp.eresult == Steam.EResult.InvalidLoginAuthCode){
                        this.coreSteam.log("InvalidLoginAuthCode", logonResp);
                        
                    }else if(logonResp.eresult == Steam.EResult.TwoFactorCodeMismatch){
                        this.coreSteam.log("TwoFactorCodeMismatch", logonResp);
                    }else{
                        this.coreSteam.log("Error login to steam", logonResp);
                    }
                    reject();
                    return;
                }.bind(this));
                this.steamClient.on('loggedOff', function onSteamLogOff(eresult) {
                    this.coreSteam.log("Logged off from Steam.");
                    this.login = false;
                    this.isconnection = false;
                }.bind(this));
        
                this.steamClient.on('error', async function onSteamError(error) {
                    let delay = (ms) => new Promise((res) => setTimeout(res, ms));

                    this.coreSteam.log("Connection closed by server - ", error);
                    await delay(3000);
                    if(resolve)
                        this.steamClient.connect();
                }.bind(this));
            }else if(this.isconnection){
                this.callbackWhenConnected.push(resolve)
            }else{
                resolve();
            }
        }.bind(this))
    }
    this.disconnect = function () {
        if(this.isLogin){
            this.steamClient.disconnect();
            this.coreSteam.log("Account disconnect");
        }
    }

    this.GetSteamClient = function () {
        return new Promise(async function (resolve, reject) {
            try {
                await this.CheckAndConnectToSteam();
                resolve(this.steamClient);
            } catch (error) {
                reject(error);
            }

        }.bind(this))
    }
    this.GetSteamUser = function () {
        return new Promise(async function (resolve, reject) {
            try {
                await this.CheckAndConnectToSteam();
                resolve(this.steamUser);
            } catch (error) {
                reject(error);
            }

        }.bind(this))
            
    }
    this.GetSteamFriends = function () {
        return new Promise(async function (resolve, reject) {
            try {
                await this.CheckAndConnectToSteam();
                resolve(this.steamFriends);
            } catch (error) {
                reject(error);
            }

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