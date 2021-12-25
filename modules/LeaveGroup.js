//groupId's
var GroupsToLeave = [
    "103582791433470748"
]
var timeBetweenEachRequest = 2000; //2sec
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < GroupsToLeave.length; i++) {
        const groupId = GroupsToLeave[i];
        try {        
            await FollowGame(RequestCommunity, SessionID, steamClient.steamID, groupId);
        } catch (error) {
            console.log(options.accountPretty+" error Leaving group, and will be skipped, groupId: "+ groupId);
            console.log(error)
        }
        await Wait(timeBetweenEachRequest);
    }
    callback();
}

function FollowGame(RequestCommunity, SessionID, steamID, groupId) {
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