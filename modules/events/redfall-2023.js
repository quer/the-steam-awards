var cheerio = require('cheerio');
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var authwgtoken = null;
    try {
        authwgtoken = await GetToken(RequestStore);
    } catch (error) {
        
    }
    //re get the authwgtoken if first failed
    if(authwgtoken == null){
        options.logError("failed to get authwgtoken, will try agirn")
        try {
            authwgtoken = await GetToken(RequestStore);
        } catch (error) {
            
        }
    }
    if(authwgtoken == null){
        options.logError("error no authwgtoken");
    }else{
        try {
            await GetRewardItem(authwgtoken, Math.floor(Math.random() * 5) + 1) // get a random reward
        } catch (error) {
            
        }
    }
    callback();
    return;

    function GetRewardItem(token, i) {
        return RequestStore.postPromise({
            url: "https://store.steampowered.com/saleaction/ajaxopendoor",
            form:{
                clan_accountid: token,
                sessionid: SessionID,
                door_index: i
            }
        })
    }

    function GetToken() {
        return new Promise(function (resolve, reject) {
            RequestStore.get('https://store.steampowered.com/sale/redfall_launch', function (error, response, html) {
                try {
                    var $ = cheerio.load(html);
                    var authwgtoken = JSON.parse($("#application_config").attr("data-community"));
                    resolve(authwgtoken.CLANACCOUNTID);
                } catch (error) {
                    options.logError("error:", html);
                    reject();
                }
            });
        })
    }
}
