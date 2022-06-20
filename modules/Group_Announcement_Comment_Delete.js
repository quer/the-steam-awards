//settings start
/**
 * a list of each comment to remove, 
 * GroupID: the group id ( can be found of you inspect the leave/join group button )
 * AnnouncementsId: the AnnouncementsId ( can be found in the url )
 * gidcomment: the comment id ( can be found when inspect on the report flag)
 */
var list = [
    { GroupID: "103582791433470748", AnnouncementsId: "1819725374765963648", gidcomment: "5161702937823816757" },
    { GroupID: "103582791433470748", AnnouncementsId: "1819725374765963648", gidcomment: "5161702937823816004" },
    { GroupID: "103582791433470748", AnnouncementsId: "1819725374765963648", gidcomment: "5161702937823803431" },
    { GroupID: "103582791433470748", AnnouncementsId: "1819725374765963648", gidcomment: "5161702937823803367" },
    { GroupID: "103582791433470748", AnnouncementsId: "1819725374765963648", gidcomment: "5161702937823814488" },
];

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        try {            
            await DoDeleteComment(item);
        } catch (error) {
            //options.logError("Failed", item, error);  <- do not make sense to console log, errors. as all account will try to delete comment, that only can be remove by 1 account
        }
    }
    callback();
    
    function DoDeleteComment(objToComment) {
        return new Promise(function (resolve, reject) {
            RequestCommunity.post({
                url: `https://steamcommunity.com/comment/ClanAnnouncement/delete/${ objToComment.GroupID }/${ objToComment.AnnouncementsId }/`,
                form:{
                    gidcomment: objToComment.gidcomment,
                    start: 0,
                    count: 10,
                    sessionid: SessionID,
                    feature2: -1
                }
            },function (error,response,body){
                var validCall = false;
                try {
                    if(JSON.parse(body).success){
                        validCall = true;
                    }
                } catch (error) {
                    
                }
                if(validCall){
                    resolve();
                }else{
                    reject(body);
                }
            });
        });
    }
}
