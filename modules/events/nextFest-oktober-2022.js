var cheerio = require('cheerio');
var onlyGetMaxBadge = true;
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestStore.get('https://store.steampowered.com/sale/nextfest', async function (error, response, html) {
        var $ = cheerio.load(html);
        var authwgtoken = JSON.parse($("#application_config").attr("data-loyalty_webapi_token"));
        if(authwgtoken == ""){
            options.log("error no authwgtoken");
            callback();
        }else{
            if(onlyGetMaxBadge){
                for (let i = 0; i < 6; i++) {
                    if(!await RunAQueue(authwgtoken)){
                        options.log("no more apps!");
                    }                    
                }
            }
            callback();
        }
    });
    async function RunAQueue(authwgtoken) {
        var list = await GetQueue(authwgtoken);
        if(list.length > 0){

            for (let i = 0; i < list.length; i++) {
                const appid = list[i];
                try {
                    await SkipQueueItem(authwgtoken, appid);
                } catch (error) {
                    options.logError("Appid failed:"+ appid)
                }
            }
            return true;
        }        
        else{
            return false;
        }
    }

    function GetQueue(access_token) {
        return new Promise(function (resolve, reject) {
            RequestStore.get(`https://api.steampowered.com/IStoreService/GetDiscoveryQueue/v1?access_token=${access_token}&input_json={"queue_type":1,"country_code":"DK","rebuild_queue":true,"rebuild_queue_if_stale":true,"store_page_filter":{"sale_filter":{"sale_tagid":1235711},"store_filters":[]}}`, function (error, response, body) {
                var jsonobj = JSON.parse(body);
                options.log(jsonobj);
                resolve(jsonobj.response.appids);
            });
        });
    }
    function SkipQueueItem(access_token, appid) {
        return new Promise(function (resolve, reject) {
            RequestStore.post({
                url: "https://api.steampowered.com/IStoreService/SkipDiscoveryQueueItem/v1?access_token=" + access_token,
                form:{
                    input_json: `{ "queue_type":1,"appid": ${appid},"store_page_filter":{"sale_filter":{"sale_tagid":1235711},"store_filters":[]}}`
                }
            }, function (error, response, body) {
                if(error){
                    reject(error);
                    return;
                }
                resolve();
                return;
            });
        })
    }
}
