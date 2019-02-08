const config = require('./config');
var fs = require('fs');
const Steam = require('steam');
const SteamTotp = require('steam-totp');
const SteamWebLogOn = require('steam-weblogon');
const cheerio = require('cheerio');
const request = require('request');
Steam.servers = [{host:'155.133.242.8', port: 27019}];
function loop(index) {
	if(config.length <= index){
		console.log("all done!")
		return;
	}
	var auth = config[index];
	var steamClient = new Steam.SteamClient(),
	    steamUser = new Steam.SteamUser(steamClient),
	    steamFriends = new Steam.SteamFriends(steamClient),
		steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
	steamClient.connect();
	steamClient.on('servers', function(server) {
		//console.log(server);
	});
	steamClient.on('connected', function() {
		console.log("Connected to Steam.");
		steamUser.logOn({
			account_name: auth.steam_user,
			password: auth.steam_pass,
			//auth_code: "NBMD8"
			two_factor_code: SteamTotp.getAuthCode(auth.sharedSecret)
		});
		//console.log(auth.steam_user);
	});
	
	steamClient.on('logOnResponse', function onSteamLogOn(logonResp) {
		console.log("logOnResponse");
		//console.log("logOnResponse", logonResp.eresult);
	    if (logonResp.eresult == Steam.EResult.OK) {
	    	console.log("logOnResponse OK");
	        steamFriends.setPersonaState(Steam.EPersonaState.Busy);
	        websession(steamWebLogOn, steamClient, steamUser, function (_requestCommunity, _requestStore, sessionID) {
	        	openDoor(_requestCommunity, _requestStore, 0, sessionID, function(){
					openDoor(_requestCommunity, _requestStore, 1, sessionID, function(){
						openDoor(_requestCommunity, _requestStore, 2, sessionID, function(){
							openDoor(_requestCommunity, _requestStore, 3, sessionID, function(){
								openDoor(_requestCommunity, _requestStore, 4, sessionID, function(){
									openDoor(_requestCommunity, _requestStore, 5, sessionID, function(){
										openDoor(_requestCommunity, _requestStore, 6, sessionID, function(){
											openDoor(_requestCommunity, _requestStore, 7, sessionID, function(){
												openDoor(_requestCommunity, _requestStore, 8, sessionID, function(){
													openDoor(_requestCommunity, _requestStore, 9, sessionID, function(){
														openDoor(_requestCommunity, _requestStore, 10, sessionID, function(){
															openDoor(_requestCommunity, _requestStore, 11, sessionID, function(){
																setTimeout(function(){	
																	steamClient.disconnect();
																	loop(++index);
																}, 500);
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
	        })
	    }
	});
	steamClient.on('loggedOff', function onSteamLogOff(eresult) {
	    console.log("Logged off from Steam.");
	});

	steamClient.on('error', function onSteamError(error) {
	    console.log("Connection closed by server - ", error);
	});


// end 
}
function openDoor(_requestCommunity, _requestStore, door, sessionID, callback){
    _requestStore.post({
		url: 'https://store.steampowered.com/promotion/opencottagedoorajax',
		form:{
			sessionid: sessionID,
			door_index: door,
			t: new Date().toISOString(),
			open_door: true
        }
	}, function (error, response, body) {
		console.log(error);
		//console.log(response);
		console.log(body);
		console.log("door - " +door + " - end");
		setTimeout(function(){
			callback();
		}, 500);
	});
}
loop(0);
function websession(steamWebLogOn, steamClient, steamUser, callback) {	
	var _requestCommunity;
	var _j1;
	var _requestStore;
	var _j2;
	var defaultTimeout = 30000;
	var storeURL = 'https://store.steampowered.com';
	var communityURL = 'https://steamcommunity.com';
	console.log("websession start");
	steamWebLogOn.webLogOn(function(sessionID, newCookie) {
		console.log(sessionID, newCookie);
		console.log(defaultTimeout);
		var requestWrapper1 = request.defaults({
			timeout: defaultTimeout
		});
		var requestWrapper2 = request.defaults({
			timeout: defaultTimeout
		});
        _j1 = request.jar();
        _j2 = request.jar();

		_requestCommunity = requestWrapper1.defaults({jar: _j1});
		_requestStore = requestWrapper2.defaults({jar: _j2});
		newCookie.forEach(function(name) {
			_j1.setCookie(request.cookie(name), communityURL);
			_j2.setCookie(request.cookie(name), storeURL);
		});
		console.log("websession done");
		callback(_requestCommunity, _requestStore, sessionID);
	});
}
