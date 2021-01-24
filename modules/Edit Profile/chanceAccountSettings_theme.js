/**
 * use this module to chance setting on a account for site:
 * https://steamcommunity.com/profiles/#steam64#/edit/theme
 * 
 * it will get all avaible themes for the account and just select a random one. 
 * 
 * all knowed themes: 
    0: {theme_id: "", title: "#ProfileTheme_Default"}
    1: {theme_id: "Summer", title: "#ProfileTheme_Summer"}
    2: {theme_id: "Midnight", title: "#ProfileTheme_Midnight"}
    3: {theme_id: "Steel", title: "#ProfileTheme_Steel"}
    4: {theme_id: "Cosmic", title: "#ProfileTheme_Cosmic"}
    5: {theme_id: "DarkMode", title: "#ProfileTheme_DarkMode"}
 */
var helper = require('./chanceAccountHelper')
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    try {
        var accountInfo = await helper.GetAccountInfo(RequestCommunity, steamClient.steamID);

        var allAvailableThemes = accountInfo.ProfileEdit.rgAvailableThemes;
        if(allAvailableThemes.length > 0){
            var randomAvailableTheme = helper.GetRandomFromList(allAvailableThemes);
            await SetProfileTheme(RequestCommunity, accountInfo.ProfileEdit.webapi_token, randomAvailableTheme.theme_id);
            console.log(options.accountPretty + " Profile theme changed");
        }else{
            console.log(options.accountPretty + " Profile do not have any theme");
        }
    } catch (error) {
        console.log(options.accountPretty + " Profile theme NOT changed");
    }
    callback();
}

function SetProfileTheme(RequestCommunity, access_token, theme_id) {
    return new Promise(function (resolve) {
        var objectToEdit = {
            input_json: `{ "theme_id": "${ theme_id }" }`
        }
        RequestCommunity.post({uri: "https://api.steampowered.com/IPlayerService/SetProfileTheme/v1?access_token=" + access_token, form: objectToEdit }, function(error, response, body) {
            resolve();
            return;
        });
    });
}