var runQueueTimes = 1; // will run queue 1 time ( some event, have 3 time card drop)
var timeBetweenFullQueue = 2 * 1000; // 10 sec
var shoudRetryedMissingItem = true;
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    getNewItems(RequestCommunity, async function (itemBefore) {
        //run queue x times to get items

        for (let i = 0; i < runQueueTimes; i++) {
            await queueRun(steamClient, RequestCommunity, RequestStore, SessionID, options);
            
        }
        getNewItems(RequestCommunity, async function (itemAfter) {
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

                    getNewItems(RequestCommunity, function (itemAfterSecondChance) {
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
    
    function getNewItems(RequestCommunity, callback) {
        RequestCommunity.get('https://steamcommunity.com/actions/GetNotificationCounts', function (error, response, body) {
            //console.log(body);    
            var data = JSON.parse(body);
            options.log("new items: "+ data.notifications["5"]);
            callback(data.notifications["5"]);
        })
    }
}