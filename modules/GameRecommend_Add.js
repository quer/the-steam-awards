var list = [
    //Below object is a example ( but all properties must always exist )
    {
        appid: 730,
        message: "Great game!"
    }
]


module.exports = async function(steamClient, _requestCommunity, _requestStore, sessionID, options, callback){
	var log = options.log;
	var logError = options.logError;
    for (let i = 0; i < list.length; i++) {
        const recommendation = list[i];
        try {
            await Make(recommendation);
        } catch (error) {
            logError(`somefing went wrong, add recommendation to appid '${recommendation.appid}'. error: `, error);
        }
    }
    callback();
        
    function Make(recommendation) {
        return new Promise(function (resolve, reject) {
            var url = 'https://store.steampowered.com/friends/recommendgame';
            var form = {
                appid: recommendation.appid,
                comment: recommendation.message,
                disable_comments: 1,
                is_public: false,
                language: "english",
                rated_up: true,
                received_compensation: 0,
                sessionid: sessionID,
                steamworksappid: recommendation.appid
            }

            _requestStore.post({
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
                        //some times et return an error message, and still add it..
                        if(bodyJson.strError){
                            log("added recommendation to app: " + recommendation.appid, "but did also return a error: " + bodyJson.strError);
                        }else{
                            log("added recommendation to app: " + recommendation.appid);
                        }
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