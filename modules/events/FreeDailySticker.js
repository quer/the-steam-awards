var cheerio = require('cheerio');
var log = () => {};
var logError = () => {};
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    log = options.log;
	logError = options.logError;
    var authwgtoken = null;
    try {
        authwgtoken = await GetToken(RequestStore);
    } catch (error) {
        
    }
    //re get the authwgtoken if first failed
    if(authwgtoken == null){
        logError("failed to get authwgtoken, will try agirn")
        try {
            authwgtoken = await GetToken(RequestStore);
        } catch (error) {
            
        }
    }
    if(authwgtoken == null || !authwgtoken.webapi_token){
        logError("error no authwgtoken");
    }else{
        try {
            await GetFreeItem(RequestStore, authwgtoken);
        } catch (error) {
            
        }
    }
    callback();
    return;
}
function GetToken(RequestStore) {
    return new Promise(function (resolve, reject) {
        RequestStore.get('https://store.steampowered.com/points/shop', function (error, response, html) {
            try {
                var $ = cheerio.load(html);
                var authwgtoken = JSON.parse($("#application_config").attr("data-loyaltystore"));
                resolve(authwgtoken);
            } catch (error) {
                logError("error:", html);
                reject();
            }
        });
    })
}
function GetFreeItem(RequestStore, authwgtoken) {
    return new Promise(function (resolve, reject) {
        RequestStore.post({
            url:'https://api.steampowered.com/ISaleItemRewardsService/ClaimItem/v1?access_token='+ authwgtoken.webapi_token, 
            form: { 
                input_protobuf_encoded: {}
            }
        }, function (error, response, body){
            var jsonResonse = JSON.parse(body);
            if( jsonResonse && 
                jsonResonse.response && 
                jsonResonse.response.reward_item && 
                jsonResonse.response.reward_item.internal_description){
                var next_claim_time = new Date();
                next_claim_time.setTime((jsonResonse.response.next_claim_time * 1000))
                log(" done - item:" + jsonResonse.response.reward_item.internal_description);
                log(" next_claim_time:" + next_claim_time.toString());
                resolve();
                return;
            }else{
                logError("something went wrong, responce:", body);
                reject();
                return;
            }
        });
    })
}