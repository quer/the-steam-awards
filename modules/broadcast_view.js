//part of this module is thanks to https://github.com/HenkerX64/node-steam-badge-unlocker, it have made, all up to "getBroadcastManifest"
var BroadcastSteamId = '76561197990233572'; //  if this is "null", it will just pick a random streaming profile
var onlyHereToTriggerWatching = true; //if true, you will get the part 'View a broadcast' in the 'Community bagde'
var timeShoudWatchTheChannel = 60; // in sec
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    if(BroadcastSteamId == null) {
        BroadcastSteamId = await getBroadcastTrendLinks();
    }
    if(BroadcastSteamId == null) {
        options.logError("No Broadcast to watch")
        callback();
        return;
    }
    options.log(BroadcastSteamId);
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
    if(!onlyHereToTriggerWatching){
        var BroadcastID = streamInfo.broadcastid;
        var ViewerToken = streamInfo.viewertoken;
        intervalID = setInterval(async () => {
            await BroadcastHeartbeat(BroadcastSteamId, BroadcastID, ViewerToken);
        }, 30 * 1000); // what is defailt based on https://community.cloudflare.steamstatic.com/public/javascript/broadcast_watch.js
    }else{
        timeShoudWatchTheChannel = 0;
    }
    setTimeout(() => {
        if(intervalID != null){
            clearInterval(intervalID);
        }
        callback();
    }, timeShoudWatchTheChannel * 1000);

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

    function getBroadcastTrendLinks() {
        return new Promise(async function (resolve, reject) {
            var body = await getAllContentHome(13);
            const links = [];
			const pattern = /https?:\/\/(www\.)?steamcommunity\.com\/broadcast\/watch\/(\d+)/;
			const matches = body.match(new RegExp(pattern, 'g'));
			if (matches) {
				for (let link of matches) {
					const match = link.match(pattern);
					links.push({
						url: match[0],
						watchId: match[2],
					});
				}
			}
            resolve(links.length > 0? links[0].watchId : null);
        });
    }
    function getAllContentHome(subSection) {
        return new Promise(function (resolve, reject) {
            const qs = {
                l: "english",
                p: 1,
                numperpage: 1,
                appHubSubSection: subSection,
                browsefilter: 'trend',
            };
            RequestCommunity.get({
                url: 'https://steamcommunity.com/apps/allcontenthome/',
                qs,
                headers: {
                    'Origin': 'https://steamcommunity.com',
                    'Accept': '*/*',
                    'Referer': 'https://steamcommunity.com' + (subSection ? '/?subsection=' + subSection : ''),
                },
            }, function (error, response, body) {
                resolve(body);
            });
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