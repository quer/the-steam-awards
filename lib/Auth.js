const fs = require('fs').promises;
var path = require('path');
const settings = require('./Settings');
module.exports = {
    configPath: path.join(__dirname, '../config'),
    init: false,
    list: [],
    load: function () {
        if(!this.init){
            this.init = true;
            const config = require(this.configPath); //reload live file. 
            this.list = [];
            for (let i = 0; i < config.length; i++) {
                this.list.push(new Auth(this, config[i]))
            }
        }
    },
    saveList: function () {
        var configJson = []
        for (let i = 0; i < this.list.length; i++) {
            const auth = this.list[i];
            configJson.push(auth.jsonToSave());
        }


        var endString = `var config = ${ JSON.stringify(configJson, null, 4) };\n`;
        endString += "module.exports = config;";

        return fs.writeFile(this.configPath+".js", endString, 'utf8');
    },
    GetAll: function () {
        this.load();
        return this.list;
    },
    GetIndexSpecificBot: function (indexList) {
        this.load();
        var authToRun = [];
        for (let i = 0; i < indexList.length; i++) 
        {
            if(this.list.indexOf(indexList[i])){
                authToRun.push(this.list[indexList[i]])
            }else{
                console.log("Account do not exist")
            }
        }
        return authToRun;
    },
    GetAllButIndexSpecificBot: function (indexList) {
        this.load();
        var authToRun = [];
        for (let i = 0; i < this.list.length; i++) {
            if(indexList.indexOf(i) == -1 ){
                authToRun.push(this.list[i])
            }
        }
        return authToRun;
    }
}
function Auth(contoller, authData) {
    this.contoller = contoller;
    this.Auth = authData;
    this.username =             settings.AuthFieldNameUsername in this.Auth ? this.Auth[settings.AuthFieldNameUsername] : null;
    this.password =             settings.AuthFieldNamePassword in this.Auth ? this.Auth[settings.AuthFieldNamePassword] : null;
    this.sharedSecret =         settings.AuthFieldNamesharedSecret in this.Auth ? this.Auth[settings.AuthFieldNamesharedSecret] : null;
    this.twoFactorCode =        settings.AuthFieldNameTwoFactorCode in this.Auth ? this.Auth[settings.AuthFieldNameTwoFactorCode] : null;
    this.PIN =                  settings.AuthFieldNameFamilyViewPIN in this.Auth ? this.Auth[settings.AuthFieldNameFamilyViewPIN] : null;
    this.mailAuth =             settings.AuthFieldNameMailAuth in this.Auth ? this.Auth[settings.AuthFieldNameMailAuth] : null;
    this.steamApiKey =          settings.AuthFieldNameSteamApiKey in this.Auth ? this.Auth[settings.AuthFieldNameSteamApiKey] : null;
    this.specialAccountText =   settings.AuthFieldSpecialAccountText in this.Auth ? this.Auth[settings.AuthFieldSpecialAccountText] : null;
    this.cookies = "cookies" in this.Auth ? this.Auth.cookies : null; // no setting key for this, as it only set via the program
    
    //note this will just set the cookie, it have to be saved to be used nexttime.
    this.SetCookies = function (cookies) {
        this.cookies = cookies;
    },
    this.jsonToSave = function () {
        var returnValue = {};
        if(this.username != null) returnValue[settings.AuthFieldNameUsername] = this.username;
        if(this.password != null) returnValue[settings.AuthFieldNamePassword] = this.password;
        if(this.sharedSecret != null) returnValue[settings.AuthFieldNamesharedSecret] = this.sharedSecret;
        if(this.twoFactorCode != null) returnValue[settings.AuthFieldNameTwoFactorCode] = this.twoFactorCode;
        if(this.PIN != null) returnValue[settings.AuthFieldNameFamilyViewPIN] = this.PIN;
        if(this.mailAuth != null) returnValue[settings.AuthFieldNameMailAuth] = this.mailAuth;
        if(this.steamApiKey != null) returnValue[settings.AuthFieldNameSteamApiKey] = this.steamApiKey;
        if(this.specialAccountText != null) returnValue[settings.AuthFieldSpecialAccountText] = this.specialAccountText;
        if(this.cookies != null) returnValue["cookies"] = this.cookies;
        return returnValue;
    }
}