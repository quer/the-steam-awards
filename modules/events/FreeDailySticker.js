var cheerio = require('cheerio');
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var authwgtoken = null;
    try {
        authwgtoken = await GetToken(RequestStore);
    } catch (error) {
        
    }
    //re get the authwgtoken if first failed
    if(authwgtoken == null){
        console.error("failed to get authwgtoken, will try agirn")
        try {
            authwgtoken = await GetToken(RequestStore);
        } catch (error) {
            
        }
    }
    if(authwgtoken == null || !authwgtoken.webapi_token){
        console.error("error no authwgtoken");
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
                console.error("error:", body);
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
            if( jsonResonse.response && 
                jsonResonse.response.reward_item && 
                jsonResonse.response.reward_item.internal_description){
                var next_claim_time = new Date();
                next_claim_time.setTime((jsonResonse.response.next_claim_time * 1000))
                console.log(" done - item:" + jsonResonse.response.reward_item.internal_description);
                console.log(" next_claim_time:" + next_claim_time.toString());
                resolve();
                return;
            }else{
                console.error(options.accountPretty + " - something went wrong, responce:", body);
                reject();
                return;
            }
        });
    })
}