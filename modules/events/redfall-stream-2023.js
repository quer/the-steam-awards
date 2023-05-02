var BroadcastSteamId = '76561199029183645'; //  if this is "null", it will just pick a random streaming profile
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var itemsWhenStared = await getNewItems();
    options.log("start items " +itemsWhenStared);
    //here we shoud have a steam64 to watch..
    var streamInfo = null;
    //we do a loop, to waite for the account to start the Broadcast, i can take a few second. the response will tell if ready or not. 
    do {
        streamInfo = await getBroadcastManifest(BroadcastSteamId);
        options.log(streamInfo);
        if(streamInfo.success == "unavailable"){ // if unavailable, the steamid, is not in a game, or not allow to watch that steamid
            options.logError("steamID '"+ BroadcastSteamId +"' unavailable to watch")
            callback();
            return;
        }
        if(streamInfo.retry){
            await new Promise(r => { setTimeout(r, streamInfo.retry);});
        }
    } while (streamInfo == null || streamInfo.success != "ready");
    var intervalID = null;
    // when we are here in the code. you will get the part 'View a broadcast' in the 'Community bagde'
    var BroadcastID = streamInfo.broadcastid;
    var ViewerToken = streamInfo.viewertoken;
    intervalID = setInterval(async () => {
        await BroadcastHeartbeat(BroadcastSteamId, BroadcastID, ViewerToken);
        var nowItems = await getNewItems();
        if(nowItems > itemsWhenStared){
            clearInterval(intervalID);
            options.log("done now item: "+nowItems+" - ( start:" +itemsWhenStared + ")");
            
            callback();
        }else{
            options.log("not done, now item: "+nowItems+" - ( start:" +itemsWhenStared + ")");
        }
    }, 30 * 1000); // what is defailt based on https://community.cloudflare.steamstatic.com/public/javascript/broadcast_watch.js

    function BroadcastHeartbeat(BroadcastSteamID, BroadcastID, ViewerToken) {
        return new Promise( function (resolve, reject) {
            RequestCommunity.post({
                url: 'https://steamcommunity.com/broadcast/heartbeat/',
                qs: {
                    steamid: BroadcastSteamID,
                    broadcastid: BroadcastID,
                    viewertoken: ViewerToken,
                }
            }, function (error, response, body) {
                options.log(body);
                resolve(body);
            });
        });
    }


    function getBroadcastManifest(steamId) {
        return new Promise( function (resolve, reject) {
            RequestCommunity.get({
                url: 'https://steamcommunity.com/broadcast/getbroadcastmpd/',
                qs: {
                    l: "english",
                    steamid: steamId,
                    sessionid: SessionID,
                    broadcastid: 0,
                    viewertoken: 0,
                    watchlocation: 5,
                },
                json: true,
                headers: {
                    'Origin': 'https://steamcommunity.com',
                    'Referer': 'https://steamcommunity.com/broadcast/watch/' + steamId
                },
            }, function (error, response, body) {
                resolve(body);
            });
        });
    }
    function getNewItems() {
        return new Promise( function (resolve, reject) {
            RequestCommunity.get('https://steamcommunity.com/actions/GetNotificationCounts', function (error, response, body) {
                var data = JSON.parse(body);
                resolve(data.notifications["5"]);
            })
        });
    }

}
/*
var ESubSection = {
	"screenshots": 2,
	"videos": 3,
	"images": 4,
	"news": 5,
	"workshop": 6,
	"guides": 9,
	"reviews": 10,
	"": 11,
	"broadcasts": 13
}
*/