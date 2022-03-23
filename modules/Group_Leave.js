var LeaveAllGroups = true; // if true, it will leave all groups joined. 
//groupId's
var GroupsToLeave = [
    "103582791433470748"
]
var timeBetweenEachRequest = 500; //0.5sec

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){

    if(LeaveAllGroups){
        const helper = require('./Edit Profile/chanceAccountHelper')
        var allGroupsLinkedToAccount = await helper.GetGroups(RequestCommunity, steamClient.steamID);
        GroupsToLeave = [];// reset list, as it will leave all groups. also to ensure we doent do unnecessary request to steam.
        for (let i = 0; i < allGroupsLinkedToAccount.length; i++) {
            const group = allGroupsLinkedToAccount[i];
            GroupsToLeave.push(group.steamid);
        }
    }
    for (let i = 0; i < GroupsToLeave.length; i++) {
        const groupId = GroupsToLeave[i];
        try {        
            await LeaveGroup(RequestCommunity, SessionID, steamClient.steamID, groupId);
        } catch (error) {
            options.logError("error Leaving group, and will be skipped, groupId: "+ groupId);
            options.logError(error)
        }
        await Wait(timeBetweenEachRequest);
    }
    callback();
}

function LeaveGroup(RequestCommunity, SessionID, steamID, groupId) {
    return new Promise(function (resolve, reject) {
        RequestCommunity.post({
            url: "https://steamcommunity.com/profiles/"+ steamID +"/home_process",
            form:{
                groupId: groupId,
                sessionID: SessionID,
                action: "leaveGroup"
            }
        }, function (error, response, body) {
            if(error){
                reject(error)
                return;
            }
            resolve();
            return;
        
        });
    })
}
function Wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    });
}