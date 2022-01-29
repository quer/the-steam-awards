var Vote = {
    Up: 1,
    Down: 0
}
//settings start
var timeBetweenEachRequest = 1000; //1sec
/**
 * a list of each comment to remove, 
 * GroupName: the Group Name ( can be found in the url )
 * AnnouncementsId: the AnnouncementsId ( can be found in the url )
 * clanID: the Announcement id ( can be found by inspect the Rate up buttom )
 * Vote: is a enum if eather 'Vote.Up' or 'Vote.Down'
 */
var list = [
    { GroupName: "NewSteamCommunityBeta", AnnouncementsId: "1819725374765963648", clanID: "3949340", Vote: Vote.Up } // https://steamcommunity.com/groups/NewSteamCommunityBeta/announcements/detail/1819725374765963648
];

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        await DoRate(RequestCommunity, SessionID, item);
        await Wait(timeBetweenEachRequest)
    }
    callback();
}

function DoRate(RequestCommunity, SessionID, objToVote) {
    return new Promise(function (resolve, reject) {
        RequestCommunity.post({
            url: `https://steamcommunity.com/groups/${ objToVote.GroupName }/announcements/rate/${ objToVote.AnnouncementsId }`,
            form:{
                sessionid: SessionID,
                voteup: objToVote.Vote,
                clanid: objToVote.clanID
            }
        }, function (error, response, body) {
            console.log(body);
            resolve();
        });
    });
}
function Wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    });
}