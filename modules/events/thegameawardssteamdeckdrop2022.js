module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestStore.get({
        url: "https://store.steampowered.com/saleaction/ajaxupdateusergiveawayregistration?giveaway_name=GameAwardDrop2022&sessionid="+SessionID
    }, function (error, response, body) {
        try {
            var responseJson = JSON.parse(body);
            if(responseJson.success == 1){
                options.log("event registed");
            }else{
                options.log("error when registering to event");
                options.log(body);
            }
        } catch (error) {
            options.logError(error);
            options.logError(body);
            
        }
        callback();
    })
}