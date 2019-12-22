var delayTime = 1; // in sec (60 is one min)
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    setTimeout(() => {        
        getQueue(RequestStore, SessionID, function (apps) {
            var prom = [];
            for (let i = 0; i < apps.length; i++) {
                const app = apps[i];
                prom.push(queueApp(RequestStore, SessionID, app));
            }
            Promise.all(prom).then(function() {
                callback();
            }, function(reason) {
                console.log('Bad: ' + reason);
                callback();
            });
        })
    }, delayTime * 1000);
}

function getQueue(RequestStore, SessionID, callback) {
    RequestStore.post({
        url:'https://store.steampowered.com/explore/generatenewdiscoveryqueue',
        form:{
            sessionid: SessionID,
            queuetype: 0
        },
    }, function (error, response, body) {
        try {
            var data = JSON.parse(body);
            callback(data.queue);
        } catch (e) {
            console.log("was not able to get new queue, will retry ( can end end loop, if never get a new queue )")
            console.log(body);
            setTimeout(() => {
                getQueue(RequestStore, SessionID, callback);                
            }, 1000);
        }
    });
}
function queueApp(RequestStore, SessionID, app) {
    return new Promise(function (resolve, reject) {
        RequestStore.post({
            url:'https://store.steampowered.com/app/60',
            form:{
                appid_to_clear_from_queue: app,
                sessionid: SessionID
            },
        }, function (error, response, body) {
            if(error){
                reject(error);
            }else
            {
                resolve();
            }
        }); 
    })
}