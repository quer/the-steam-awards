//This module can join via url and GroupID. ( no need to fill both, just enter the group in one of the list)
//The url for the group to join
var joinGroupViaGroupUrl = [
]
// the groupid to join
var joinGroupViaGroupID = [
]
module.exports = async function(steamClient, _RequestCommunity, RequestStore, _SessionID, options, callback){
    //join  via url
    for (let i = 0; i < joinGroupViaGroupUrl.length; i++) {
        const groupUrl = joinGroupViaGroupUrl[i];
        try {
            await JoinGroup(groupUrl);
        } catch (error) {
            options.logError("failed to join group : " + groupUrl);
        }
    }
    //join via groupID
    for (let i = 0; i < joinGroupViaGroupID.length; i++) {
        const groupID = joinGroupViaGroupID[i];
        try {
            await JoinGroup("https://steamcommunity.com/gid/"+groupID);
        } catch (error) {
            options.logError("failed to join group : " + groupID);
        }
    }
    callback();
    function JoinGroup(groupUrl) {
        return new Promise(function (resolve, reject) {
            _RequestCommunity.post({
                url: groupUrl,
                form:{
                    sessionID: _SessionID,
                    action: "join"
                }
            }, function (error, response, body) {
                if(error){
                    reject(error);
                    return
                }
                resolve();
            });
        })
        
    }
}
