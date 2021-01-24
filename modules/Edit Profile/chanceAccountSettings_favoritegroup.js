/**
 * use this module to chance setting on a account for site:
 * https://steamcommunity.com/profiles/#steam64#/edit/favoritegroup
 * 
 * it will get all avaible group for the account and just select a random one. 
 */
var helper = require('./chanceAccountHelper')
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    try {
        var Groups = await helper.GetGroups(RequestCommunity, steamClient.steamID);

        if(Groups.length > 0){
            var randomGroup = helper.GetRandomFromList(Groups);
            try {
                await SetFavoriteGroup(RequestCommunity, randomGroup.steamid, SessionID, steamClient.steamID);                
                console.log(options.accountPretty + " Profile favorite group changed");
            } catch (error) {
                console.log(options.accountPretty + " Profile group, error changeing it", error.msg, error.error);
            }
            
        }else{
            console.log(options.accountPretty + " Profile do not have any group");
        }
    } catch (error) {
        console.log(options.accountPretty + " Profile favorite group NOT changed");
    }
    callback();
}
function SetFavoriteGroup(RequestCommunity, primary_group_steamid, sessionID, steamID) {
    return new Promise(function (resolve, reject) {
        var objectToEdit = {
            "primary_group_steamid": primary_group_steamid,
            "type": "favoriteclan",
            "sessionID": sessionID,
            "json": 1
        }
        RequestCommunity.post({uri: "https://steamcommunity.com/profiles/"+steamID+"/edit/", form: objectToEdit }, function(error, response, body) {
            try {
                var responseJson = JSON.parse(body); // {success: 1, errmsg: ""}
                if(responseJson.success == 1){
                    resolve();
                    return;
                }else{
                    reject({ msg: "error set group", error: responseJson.errmsg })
                    return;

                }
            } catch (error) {
                reject({ msg: "error making group request", error: error })
                return;
            }
        });
    });
}