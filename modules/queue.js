
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
	var log = options.log;
	var logError = options.logError;
    try {
        var apps = await getQueue();
        //create promise list
        var prom = [];
        for (let i = 0; i < apps.length; i++) {
            const app = apps[i];
            prom.push(queueApp(app));
        }
        //run all at once
        Promise.all(prom)
        .then(function() {
            log("Queue done!")
            callback();
        }, function(reason) {
            logError('Bad: ' + reason);
            callback();
        });
        
    } catch (error) {
        logError('Error getting the queue. Reason: ' + reason);
        callback();
    }

    function getQueue(loops = 0) {
        return new Promise(function (resolve, reject) {
            RequestStore.post({
                url:'https://store.steampowered.com/explore/generatenewdiscoveryqueue',
                form:{
                    sessionid: SessionID,
                    queuetype: 0
                },
            }, function (error, response, body) {
                try {
                    var data = JSON.parse(body);
                    resolve(data.queue);
                } catch (e) {
                    logError("was not able to get new queue, will retry ( can end end loop, if never get a new queue )")
                    logError(body);
                    if(loops > 4){
                        reject();
                    }else{
                        getQueue(++loops).then(resolve).catch(reject);
                    }
                }
            });
        })
    }
    function queueApp(app) {
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
}

