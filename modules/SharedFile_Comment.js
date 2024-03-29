var SharedFileToComment = [
    // next list is a example of how a comment can look ( all 4 must be set. )
    {
        sharedId: "923012519",
        ownerSteamID: "76561197990233572",
        appid: 753,
        message: "Nice work"
    }
]


module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
	var log = options.log;
	var logError = options.logError;
    for (let i = 0; i < SharedFileToComment.length; i++) {
        const sharedFileObj = SharedFileToComment[i];
        try {
            await CommentSharedFile(RequestCommunity, SessionID, sharedFileObj);
        } catch (error) {
            logError(`somefing went wrong, adding comment to sharedFile.`, sharedFileObj);
            logError('Error:', error);
        }
    }   
    callback();   
        
    function CommentSharedFile(RequestCommunity, SessionID, sharedfileObj) {
        return new Promise(function (resolve, reject ) {
            RequestCommunity.post({
                url: "https://steamcommunity.com/comment/PublishedFile_Public/post/" + sharedfileObj.ownerSteamID + "/" + sharedfileObj.sharedId + "/",
                form:{
                    sessionid: SessionID,
                    comment: sharedfileObj.message,
                    feature2: -1,
                    extended_data: JSON.stringify({ "appid" : sharedfileObj.appid }),
                    count: 10
                }
            }, function (error, response, body) {
                if(error){
                    reject(error);
                    return;
                }
                try {
                    var bodyJson = JSON.parse(body);
                    if(bodyJson.success){
                        log("added comment. " + sharedfileObj.sharedId);
                        resolve();
                    }else{
                        throw new Error(body);
                    }
                } catch (error) {
                    reject(error);
                    return;
                }
            });
        });
    }
}
