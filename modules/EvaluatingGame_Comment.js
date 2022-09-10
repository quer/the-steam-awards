var reviewCommentObjList = 
[
]


module.exports = async function(steamClient, _requestCommunity, _requestStore, sessionID, options, callback){
	for (let i = 0; i < reviewCommentObjList.length; i++) {
        const reviewCommentObj = reviewCommentObjList[i];
        try {
            await AddComment(reviewCommentObj);
        } catch (error) {
            options.logError(`somefing went wrong, add comment to review '${reviewCommentObj.steam64}' -> '${reviewCommentObj.reviewID}'. error: `, error);
        }
    }
    callback();
        
    function AddComment(reviewCommentObj) {
        return new Promise(function (resolve, reject) {
            var url = `https://steamcommunity.com/comment/Recommendation/post/${ reviewCommentObj["steam64"] }/${ reviewCommentObj["reviewID"] }/`;
            var form = {
                comment: reviewCommentObj["comment"],
                count: 10,
                sessionid: sessionID,
                extended_data: { "is_public": false },
                feature2: -1
            }

            _requestCommunity.post({
                url: url,
                form: form
            }, function (error, response, body) {
                if(error){
                    reject(error);
                    return;
                }
                try {
                    var bodyJson = JSON.parse(body);
                    if(bodyJson.success){
                        options.log(`Added comment to: ${ reviewCommentObj["steam64"] }/${ reviewCommentObj["reviewID"] }`);
                        resolve();
                        return;
                    }else{
                        reject(body);
                        return;
                    }
                } catch (error) {
                    reject(error);
                    return;
                }
            });
        })
    }
};