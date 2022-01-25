var list = [
    //Below object is a example ( but all properties must always exist )
    {
        appid: 730,
        message: "Great game!"
    }
]

var log = () => {};
var logError = () => {};
module.exports = async function(steamClient, _requestCommunity, _requestStore, sessionID, options, callback){
	log = options.log;
	logError = options.logError;
    for (let i = 0; i < list.length; i++) {
        const recommendation = list[i];
        try {
            await Make(_requestStore, sessionID, recommendation);
        } catch (error) {
            logError(`somefing went wrong, add recommendation to appid '${recommendation.appid}'. error: `, error);
        }
    }
    callback();
};


function Make(_requestStore, sessionID, recommendation) {
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
                    throw new Error(body);
                }
            } catch (error) {
                reject(error);
                return;
            }
        });
    })
    
}