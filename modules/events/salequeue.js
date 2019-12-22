module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    getNewItems(RequestCommunity, function (itemBefore) {
        //run queue 3 times to get items
        queueRun(steamClient, RequestCommunity, RequestStore, SessionID, options, function () {
            queueRun(steamClient, RequestCommunity, RequestStore, SessionID, options, function () {
                queueRun(steamClient, RequestCommunity, RequestStore, SessionID, options, function () {
                    getNewItems(RequestCommunity, function (itemAfter) {
                        if(itemBefore + 3 == itemAfter)
                        {
                            setTimeout(() => {
                                callback();
                            }, 10000);// wait 10 sec before, start new module   
                        }
                        else
                        {
                            var itemNeeded = (itemBefore + 3) - itemAfter;
                            console.log(steamClient.steamID + " - " + options.UserName + ": might need " + itemNeeded + " items. will try to get it");
                            
                            runToGetItem(steamClient, RequestCommunity, RequestStore, SessionID, options, itemNeeded, function () {    
                                setTimeout(() => {
                                    callback();
                                }, 10000);// wait 10 sec before, start new module   
                            })
                        }
                    })
                })
            })    
        })
    });
}
function queueRun(steamClient, RequestCommunity, RequestStore, SessionID, options, callback) {
    setTimeout(() => {
        require('../queue')(steamClient, RequestCommunity, RequestStore, SessionID, options, callback);        
    }, 10000);// 10 sec
}
//after run for the 3 items, and we did not get what we shoud this methode will retry 3 times to get the missing item
function runToGetItem(steamClient, RequestCommunity, RequestStore, SessionID, options, needed, callback) {
    var fullLoop = needed + 3;
    console.log(fullLoop);
    var foundItems = 0;
    var loop = function (loopIndex, whenDone) {
        console.log("retry: "+loopIndex);
        if(loopIndex > fullLoop || foundItems == needed){
            console.log(steamClient.steamID + " - " + options.UserName + ": might not have been able to get all the items");
            whenDone();
        }else{
            getNewItems(RequestCommunity, function (itemBefore) {
                queueRun(steamClient, RequestCommunity, RequestStore, SessionID, options, function () {
                    getNewItems(RequestCommunity, function (itemAfter) {
                        if(itemBefore + 1 == itemAfter){
                            foundItems += 1;
                        }
                        loop(++loopIndex, whenDone);
                    });
                });
            });
        }
    }
    loop(0, callback)
}

function getNewItems(RequestCommunity, callback) {
    RequestCommunity.get('https://steamcommunity.com/actions/GetNotificationCounts', function (error, response, body) {
        //console.log(body);    
        var data = JSON.parse(body);
        console.log("new items: "+ data.notifications["5"]);
        callback(data.notifications["5"]);
    })
}