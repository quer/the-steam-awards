var Vote = {
    Up: 1,
    Down: 0
}
//settings start
/**
 * a list of each comment to remove, 
 * GroupName: the Group Name ( can be found in the url )
 * AnnouncementsId: the AnnouncementsId ( can be found in the url )
 * clanID: the Announcement id ( can be found by inspect the Rate up buttom )
 * Vote: is a enum if eather 'Vote.Up' or 'Vote.Down'
 */
var list = [
];

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        try {
            await DoRate(RequestCommunity, SessionID, item);            
        } catch (error) {
            options.logError("will be skipped", item, error);
        }
    }
    callback();    
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
                try {
                    if(JSON.parse(body).success){
                        resolve();
                        return;
                    }
                } catch (error) {
                    
                }
                reject(body);
            });
        });
    }
}

