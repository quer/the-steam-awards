/**
 * use this module to chance setting on a account for site:
 * https://steamcommunity.com/profiles/#steam64#/edit/background
 * 
 * to remove the bg, call RemoveProfileBackground()
 */
var helper = require('./chanceAccountHelper')
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    try {
        var accountInfo = await helper.GetAccountInfo(RequestCommunity, steamClient.steamID);
        
        var backgroundImages = await helper.GetBackgrounds(RequestCommunity, accountInfo.ProfileEdit.webapi_token);
        if(backgroundImages.length > 0){
            var randomBG = helper.GetRandomFromList(backgroundImages);
            await SetProfileBackground(RequestCommunity, accountInfo.ProfileEdit.webapi_token, randomBG.communityitemid);
            await SetProfileBackgroundMode(RequestCommunity, accountInfo.ProfileEdit.webapi_token, randomBG.communityitemid, 0);
            console.log(options.accountPretty + " Profile background image changed");
        }else{
            console.log(options.accountPretty + " Profile do not have any background image");
        }
    } catch (error) {
        console.log(options.accountPretty + " Profile background image NOT changed");
        
    }
    callback();
}

function SetProfileBackground(RequestCommunity, access_token, backgroundId) {
    return new Promise(function (resolve) {
        var objectToEdit = {
            input_json: `{ "communityitemid": ${backgroundId.toString()} }`
        }
        RequestCommunity.post({uri: "https://api.steampowered.com/IPlayerService/SetProfileBackground/v1?access_token=" + access_token, form: objectToEdit }, function(error, response, body) {
            resolve();
            return;
        });
    });
}
function SetProfileBackgroundMode(RequestCommunity, access_token, backgroundId, flags) {
    return new Promise(function (resolve) {
        var objectToEdit = {
            input_json: `{ 
                "communityitemid": ${ backgroundId.toString() },
                "flags": ${ flags } // 0 = "Original Size" 1 = "Full Screen"
            }`
        }
        RequestCommunity.post({uri: "https://api.steampowered.com/IPlayerService/SetEquippedProfileItemFlags/v1?access_token=" + access_token, form: objectToEdit }, function(error, response, body) {
            resolve();
            return;
            
        });
    });
}

function RemoveProfileBackground(RequestCommunity, access_token) {
    return new Promise(function (resolve, reject) {
        var objectToEdit = {
            input_json: `{}`
        }
        RequestCommunity.post({uri: "https://api.steampowered.com/IPlayerService/SetProfileBackground/v1?access_token=" + access_token, form: objectToEdit }, function(error, response, body) {
            resolve();
            return;
            
        });
    });
}
