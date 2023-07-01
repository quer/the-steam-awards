var cheerio = require('cheerio');
var runQueueTimes = 1; // will run queue 1 time ( some event, have 3 time card drop)
var timeBetweenFullQueue = 10 * 1000; // 2 sec
var shoudRetryedMissingItem = true;
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    getNewItems(RequestStore, async function (itemBefore) {
        //run queue x times to get items

        for (let i = 0; i < runQueueTimes; i++) {
            await queueRun(steamClient, RequestCommunity, RequestStore, SessionID, options);
            
        }
        getNewItems(RequestStore, async function (itemAfter) {
            var itemNeeded = (itemBefore + runQueueTimes) - itemAfter;
            //all done and did get the items expected 
            if(itemNeeded == 0)
            {
                setTimeout(() => {
                    callback();
                }, timeBetweenFullQueue);// wait 10 sec before, start new module   
            }
            else
            {
                if(shoudRetryedMissingItem){
                    options.log("might need " + itemNeeded + " items. will try to get it");
                    // we will run queue, one more time for each item that we need. ( as a second chance )
                    for (let i = 0; i < itemNeeded; i++) {
                        await queueRun(steamClient, RequestCommunity, RequestStore, SessionID, options);
                    }

                    getNewItems(RequestStore, function (itemAfterSecondChance) {
                        if(itemAfterSecondChance == itemAfter + itemNeeded){
                            options.log("Got all items after second run");
                        }else{
                            options.logError("Did not get all the expected item. and will be skiped.");
                        }
                        callback();
                    })
                }else{
                    options.logError("Did not get all the expected item. and will be skiped.");
                    callback();
                }
            }
        })
    })
    function queueRun(steamClient, RequestCommunity, RequestStore, SessionID, options) {
        return new Promise(function (resolve) {
            var callback = function () {
                resolve();
            }
            setTimeout(() => {
                require('../queue')(steamClient, RequestCommunity, RequestStore, SessionID, options, callback);        
            }, timeBetweenFullQueue);// 10 sec
        })
        
    }
    
    function getNewItems(RequestStore, callback) {
        var unreadCount = 0;
        RequestStore.get('https://store.steampowered.com/explore/', function (error, response, body) {
            try {
                var $ = cheerio.load(body);
                var notifications = JSON.parse($("#application_config").attr("data-steam_notifications"));
                unreadCount = notifications.unread_count;
                options.log("new items: "+ unreadCount);
            } catch (error) {
                options.logError("Was not able to get notifications from steam, so cant ensure it will get the card.");
            }
            callback(unreadCount);
        })
    }
}