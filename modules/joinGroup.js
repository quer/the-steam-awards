var ApiKey = "xxxxxx";
//list to where it will select between 6 and 2 (edit on line 36)
var list = [
    "https://steamcommunity.com/groups/NewSteamCommunityBeta",
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
    "https://steamcommunity.com/groups/homestream"
]
// all in this list, will the account join
var MustHave = [
    "https://steamcommunity.com/groups/enhanced-clients"
];
//each level group must be in the right order. uses account Math.floor(level / 10) to get 10's and run index's
var levelGroups = [
    "https://steamcommunity.com/groups/level10collector",
    "https://steamcommunity.com/groups/level20collector",
    "https://steamcommunity.com/groups/level30collector",
    "https://steamcommunity.com/groups/level40collector",
    "https://steamcommunity.com/groups/level50collector",
    "https://steamcommunity.com/groups/level60collector",
];
var RequestCommunity;
var SessionID;
module.exports = function(steamClient, _RequestCommunity, RequestStore, _SessionID, options, callback){
    RequestCommunity = _RequestCommunity;
    SessionID = _SessionID;
    loopMustHaveGroups(0, function () {
        loopRandomGroupsToHave(Math.floor((Math.random() * 6) + 2), 0, [], function () {
            getLevel(steamClient.steamID, function (usersLevel) {
                usersLevel = Math.floor(usersLevel/10);
                loopLevelGroupsToHave(usersLevel, 0, function () {
                    callback();
                })
            })
            
        })
    })
}
function loopLevelGroupsToHave(MaxLoops, index, callback) {
    if(MaxLoops.length > index){
        JoinGroup(levelGroups[index], function () {
            loopLevelGroupsToHave(MaxLoops, ++index, callback);
        })
    }else{
        callback();
    }
}
function loopMustHaveGroups(index, callback) {
    if(MustHave.length > index){
        JoinGroup(MustHave[index], function () {
            loopMustHaveGroups(++index, callback);
        })
    }else{
        callback();
    }
}
function loopRandomGroupsToHave(maxGroups, index, haveInvitedTo, callback) {
    if(maxGroups > index){
        var foundIndex = -1;
        while (foundIndex == -1) { //WARNING: if maxGroups is bigger then list. then this can get stuck in limbo
            var groupToJoin = Math.floor(Math.random() * (list.length - 1) );
            if(!haveInvitedTo.includes(groupToJoin)){
                foundIndex = groupToJoin;
            }
        }
        JoinGroup(list[foundIndex], function () {
            haveInvitedTo.push(foundIndex);
            loopRandomGroupsToHave(maxGroups, ++index, haveInvitedTo, callback);
        })
    }else{
        callback();
    }
}
function JoinGroup(groupUrl, callback) {
    RequestCommunity.post({
		url: groupUrl,
		form:{
            sessionID: SessionID,
            action: "join"
		}
	}, function (error, response, body) {
        setTimeout(function () {
            callback();
        }, 500);
    });
}
function getLevel(steamId, callback) {
    RequestCommunity.get({
		url: "https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key="+ApiKey+"&steamid=" + steamId
	}, function (error, response, body) {
        var json = JSON.parse(body);
        if(json.response.player_level){
            callback(json.response.player_level);
        }
        else{
            callback(0);
        }
    });
}