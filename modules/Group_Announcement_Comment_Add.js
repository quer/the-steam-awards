//settings start

/**
 * a list of each comment to remove, 
 * GroupID: the group id ( can be found of you inspect the leave/join group button )
 * AnnouncementsId: the AnnouncementsId ( can be found in the url )
 * Comment: the comment that will be made
 */
var list = [
];

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        try {            
            await DoComment(item);
        } catch (error) {
            options.logError("Failed", item, error);
        }
    }
    callback();
        
    function DoComment(objToComment) {
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
