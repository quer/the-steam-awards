var cheerio = require('cheerio');
var itemsID = [241807, 241808, 241809, 241810, 241811, 241812]
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback)
{
    var log = options.log;
	var logError = options.logError;
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
            for (let i = 0; i < itemsID.length; i++) {
                const id = itemsID[i];
                try {
                    await GetFreeItem(RequestStore, authwgtoken, id);
                } catch (error) {
        }
            
        }
    }
    callback();
    return;

    function GetToken(RequestStore) {
        return new Promise(function (resolve, reject) {
            RequestStore.get('https://store.steampowered.com/points/shop/event/sale_steam20', function (error, response, html) {
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
    function GetFreeItem(RequestStore, authwgtoken, id) {
        return new Promise(function (resolve, reject) {
            RequestStore.post({
                url:'https://api.steampowered.com/ILoyaltyRewardsService/RedeemPoints/v1?access_token='+ authwgtoken.webapi_token, 
                form: { 
                    defid: id
                }
            }, function (error, response, body){
                var jsonResonse = JSON.parse(body);
                if( jsonResonse && 
                    jsonResonse.response && 
                    jsonResonse.response.communityitemid){
                    log("done - item:" + jsonResonse.response.communityitemid);
                    resolve();
                    return;
                }else{
                    logError("something went wrong whit getting id: "+ id +", responce:", body);
                    reject();
                    return;
                }
            });
        })
    }
}