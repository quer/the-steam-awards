//settings start
var timeBetweenEachRequest = 1000; //1sec
/**
 * a list of each comment to remove, 
 * GroupID: the group id ( can be found of you inspect the leave/join group button )
 * AnnouncementsId: the AnnouncementsId ( can be found in the url )
 * Comment: the comment that will be made
 */
var list = [
    { GroupID: "103582791433470748", AnnouncementsId: "1819725374765963648", Comment: "test" } // https://steamcommunity.com/groups/NewSteamCommunityBeta/announcements/detail/1819725374765963648
];

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        await DoComment(RequestCommunity, SessionID, item);
        await Wait(timeBetweenEachRequest)
    }
    callback();
}

function DoComment(RequestCommunity, SessionID, objToComment) {
    return new Promise(function (resolve, reject) {
        RequestCommunity.post({
            url: `https://steamcommunity.com/comment/ClanAnnouncement/post/${ objToComment.GroupID }/${ objToComment.AnnouncementsId }/`,
            form:{
                comment: objToComment.Comment,
                count: 10,
                sessionid: SessionID,
                feature2: -1
            }
        },function (error,response,body){
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