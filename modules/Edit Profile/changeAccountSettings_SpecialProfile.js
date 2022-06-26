var helper = require('./chanceAccountHelper');
//set if shoud take random own.
var SelectRandomOwnedSpecialProfile = false;
// set the following if it shoud be a specifik one. 
var SetSpecificSpecialProfile = { appid: 2021850 } // to activate the steam 3000
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    try {
        var accountInfo = await helper.GetAccountInfo(RequestCommunity, steamClient.steamID);
        var access_token = accountInfo.ProfileEdit.webapi_token;
        var ownedSpecialProfile = await GetOwnedSpecialProfile(RequestCommunity, access_token);

        if(ownedSpecialProfile.length > 0){
            if(SelectRandomOwnedSpecialProfile){
                var randomAvailableSpecialProfile = helper.GetRandomFromList(ownedSpecialProfile);
                await SetSpecialProfile(RequestCommunity, access_token, randomAvailableSpecialProfile);
                options.log("Special Profile changed");
            }else{
                var existOnAccount = ownedSpecialProfile.filter(x => x.appid == SetSpecificSpecialProfile.appid)
                if(existOnAccount.length > 0){
                    await SetSpecialProfile(RequestCommunity, access_token, existOnAccount[0]);
                    options.log("Special Profile changed");
                }else{
                    options.log("Profile do not own the Special Profile");
                }
            }
        }else{
            options.log("Profile do not have any Special Profile");
        }
    } catch (error) {
        options.logError("Special Profile NOT changed");
        options.logError(error);
    }
    
    callback();
}
function GetOwnedSpecialProfile(RequestCommunity, access_token) {
    return new Promise(function (resolve, reject) {
        RequestCommunity.get({uri: "https://api.steampowered.com/IPlayerService/GetProfileItemsOwned/v1?access_token="+ access_token +"&input_json=%7B%22language%22:%22english%22,%22filters%22:[]%7D" }, function(error, response, body) {
            try {
                var bodyJson = JSON.parse(body);
                if(bodyJson && bodyJson.response){
                    if(bodyJson.response.profile_modifiers){
                        resolve(bodyJson.response.profile_modifiers)
                        return;
                    }else{
                        //the account do not have any.
                        resolve([])
                        return;
                    }
                }else{
                    reject("Error getting account SpecialProfile\n" + body);
                    return;                    
                }
            } catch (error) {
                reject(error);
                return;
            }

        });
    });
}
function SetSpecialProfile(RequestCommunity, access_token, SpecialProfileObj) {
    return new Promise(function (resolve) {
        var objectToEdit = {
            input_json: `{ "appid": ${ SpecialProfileObj.appid }, "communityitemid": "${ SpecialProfileObj.communityitemid }","activate": true }`
        }
        RequestCommunity.post({uri: "https://api.steampowered.com/IQuestService/ActivateProfileModifierItem/v1?access_token=" + access_token, form: objectToEdit }, function(error, response, body) {
            resolve();
            return;
        });
    });
}