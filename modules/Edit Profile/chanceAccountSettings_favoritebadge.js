/**
 * use this module to chance setting on a account for site:
 * https://steamcommunity.com/profiles/#steam64#/edit/favoritebadge
 * 
 * it will get all avaible badge for the account and just select a random one. 
 * 
 * paste, the following into the browser to see how the output for "accountInfo.ProfileBadges"  
 * JSON.parse(jQuery("#profile_edit_config").attr("data-profile-badges"))
 */
var helper = require('./chanceAccountHelper')
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    try {
        var accountInfo = await helper.GetAccountInfo(RequestCommunity, steamClient.steamID);

        var allProfileBadges = accountInfo.ProfileBadges.rgBadges;
        var listOfbadgesKeys = Object.keys(allProfileBadges);
        if(listOfbadgesKeys.length > 0){
            var randomProfileBadgeKey = helper.GetRandomFromList(listOfbadgesKeys);
            var randomProfileBadge = allProfileBadges[randomProfileBadgeKey];
            if(randomProfileBadge.communityitemid){
                await SetFavoriteBadge_viaCommunityitemid(RequestCommunity, accountInfo.ProfileEdit.webapi_token, randomProfileBadge.communityitemid);
            }else{
                await SetFavoriteBadge_ViaBadgeId(RequestCommunity, accountInfo.ProfileEdit.webapi_token, randomProfileBadge.badgeid);
            }
            console.log(options.accountPretty + " Profile favorite badge changed");
        }else{
            console.log(options.accountPretty + " Profile do not have any badge");
        }
    } catch (error) {
        console.log(options.accountPretty + " Profile favorite badge NOT changed");
    }
    callback();
}
//if it a bagde from a game. it will have a communityitemid
function SetFavoriteBadge_viaCommunityitemid(RequestCommunity, access_token, communityitemid) {
    return new Promise(function (resolve) {
        var objectToEdit = {
            input_json: `{ "communityitemid": "${ communityitemid }" }`
        }
        RequestCommunity.post({uri: "https://api.steampowered.com/IPlayerService/SetFavoriteBadge/v1?access_token=" + access_token, form: objectToEdit }, function(error, response, body) {
            resolve();
            return;
        });
    });
}
//if it one of the valve badges it will only have the badge id
function SetFavoriteBadge_ViaBadgeId(RequestCommunity, access_token, badgeid) {
    return new Promise(function (resolve) {
        var objectToEdit = {
            input_json: `{ "badgeid": "${ badgeid }" }`
        }
        RequestCommunity.post({uri: "https://api.steampowered.com/IPlayerService/SetFavoriteBadge/v1?access_token=" + access_token, form: objectToEdit }, function(error, response, body) {
            resolve();
            return;
        });
    });
}