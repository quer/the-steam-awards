//This module can join via url and GroupID. ( no need to fill both, just enter the group in one of the list)
var timeBetweenEachRequest = 500; //0.5sec
//The url for the group to join
var joinGroupViaGroupUrl = [
    /*"https://steamcommunity.com/groups/NewSteamCommunityBeta",
    "https://steamcommunity.com/groups/Infinity-CS-GO",
    "https://steamcommunity.com/groups/bigpicture",
    "https://steamcommunity.com/groups/thevalvestore",
    "https://steamcommunity.com/groups/card-trading-card-trades",
    "https://steamcommunity.com/groups/SteamDB",
    "https://steamcommunity.com/groups/community_market",
    "https://steamcommunity.com/groups/steamuniverse",
    "https://steamcommunity.com/groups/homestream",
    "https://steamcommunity.com/groups/tradingcards",
    "https://steamcommunity.com/groups/familysharing",
    "https://steamcommunity.com/groups/SteamClientBeta",
    "https://steamcommunity.com/groups/steammusic",
    "https://steamcommunity.com/groups/homestream"*/
]
// the groupid to join
var joinGroupViaGroupID = [
    "103582791463767598",
    "103582791459933004"
  ]
var RequestCommunity;
var SessionID;
module.exports = async function(steamClient, _RequestCommunity, RequestStore, _SessionID, options, callback){
    RequestCommunity = _RequestCommunity;
    SessionID = _SessionID;
    //join  via url
    for (let i = 0; i < joinGroupViaGroupUrl.length; i++) {
        const groupUrl = joinGroupViaGroupUrl[i];
        try {
            await JoinGroup(groupUrl);
        } catch (error) {
            options.logError("failed to join group : " + groupUrl);
        }
        await Wait(timeBetweenEachRequest);
    }
    //join via groupID
    for (let i = 0; i < joinGroupViaGroupID.length; i++) {
        const groupID = joinGroupViaGroupID[i];
        try {
            await JoinGroup("https://steamcommunity.com/gid/"+groupID);
        } catch (error) {
            options.logError("failed to join group : " + groupID);
        }
        await Wait(timeBetweenEachRequest);
    }
    callback();
}
function JoinGroup(groupUrl, callback) {
    return new Promise(function (resolve, reject) {
        RequestCommunity.post({
            url: groupUrl,
            form:{
                sessionID: SessionID,
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
function Wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    });
}