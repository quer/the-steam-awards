/**
 * use this module to chance setting on a account for site:
 * https://steamcommunity.com/profiles/#steam64#/edit/miniprofile
 * 
 */
var helper = require('./chanceAccountHelper')
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    try {
        var accountInfo = await helper.GetAccountInfo(RequestCommunity, steamClient.steamID);
        
        var mineProfiles = await helper.GetMineProfiles(RequestCommunity, accountInfo.ProfileEdit.webapi_token);
        if(mineProfiles.length > 0){
            var randomMineProfiles = helper.GetRandomFromList(mineProfiles);
            await SetMiniProfileBackground(RequestCommunity, accountInfo.ProfileEdit.webapi_token, randomMineProfiles.communityitemid);
            options.log(options.accountPretty + " Profile mini background changed");
        }else{
            options.log(options.accountPretty + " Profile do not have any mini background");
        }
    } catch (error) {
        options.logError("Profile mini background NOT changed");
    }
    callback();
}

function SetMiniProfileBackground(RequestCommunity, access_token, backgroundId) {
    return new Promise(function (resolve) {
        var objectToEdit = {
            input_json: `{ "communityitemid": ${backgroundId.toString()} }`
        }
        RequestCommunity.post({uri: "https://api.steampowered.com/IPlayerService/SetMiniProfileBackground/v1?access_token=" + access_token, form: objectToEdit }, function(error, response, body) {
            resolve();
            return;
        });
    });
}