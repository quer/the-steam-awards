const config = require('./config');
var fs = require('fs');
const Steam = require('steam');
const SteamTotp = require('steam-totp');
const SteamWebLogOn = require('steam-weblogon');
const cheerio = require('cheerio');
const request = require('request');
Steam.servers = [{host:'155.133.242.8', port: 27019}];
function loop(index) {
	if(config.length <= index ){
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
	        	vote(1, 271590, _requestStore, sessionID, 3, function () {
	        		vote(2, 570, _requestStore, sessionID, 3, function () {
	        			vote(3, 578080, _requestStore, sessionID, 3, function () {
	        				vote(4, 4, _requestStore, sessionID, 4, function () {
	        					vote(5, 230410, _requestStore, sessionID, 3, function () {
	        						vote(6, 440, _requestStore, sessionID, 3, function () {
						        		vote(7, 359550, _requestStore, sessionID, 3, function () {
							        		vote(8, 730, _requestStore, sessionID, 3, function () {
										    	steamUser.gamesPlayed({games_played:[{game_id:570}]});
								        		Make(_requestCommunity, _requestStore, sessionID, function(){
													console.log("done!");
													setTimeout(function(){	
														steamClient.disconnect();
														loop(++index);
													}, 500);
												})
							        		})
							        	})
					        		})
					        	})
				        	})
			        	})
		        	})
	        	})
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


function vote(categoryid, appid, _request, sessionID, writein, callback) {
	console.log("vote - " +categoryid + " - start");
	_request.post({
		url: 'https://store.steampowered.com/steamawards/nominategame',
		form:{
			sessionid: sessionID,
			nominatedid: appid,
			categoryid: categoryid,
			source: 3
		},
		headers: {
			'Origin': 'https://store.steampowered.com',
			'Accept': '*/*',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Referer': 'https://store.steampowered.com/steamawards/category/'+categoryid

		}
	}, function (error, response, body) {
		//console.log(error);
		//console.log(response);
		//console.log(body);
		console.log("vote - " +categoryid + " - end");
		setTimeout(function(){
			callback();
		}, 500);
	});
}

function Make(_requestCommunity, _requestStore, sessionID, callback) {
	var url = 'https://store.steampowered.com/friends/recommendgame';
	var form = {
		appid: 570,
		comment: "Great game!",
		disable_comments: 1,
		is_public: false,
		language: "english",
		rated_up: true,
		received_compensation: 0,
		sessionid: sessionID,
		steamworksappid: 570
	}

	_requestStore.post({
		url: url,
		form: form
	}, function (error, response, body) {
		//console.log(error);
		//console.log(body);
		console.log("created");
		setTimeout(function(){
			_requestCommunity.post({
				url: 'http://steamcommunity.com/my/recommended/',
				form: {
					action: "delete",
					sessionid: sessionID,
					appid: 570
				}
			}, function (er, re,  bo) {
				console.log("fjerenet");
				callback();				
			})
		}, 2000);
	});
}
function removeMake(_requestCommunity, _requestStore, sessionID, callback) {
	_requestCommunity.post({
		url: 'http://steamcommunity.com/my/recommended/',
		form: {
			action: "delete",
			sessionid: sessionID,
			appid: 570
		}
	}, function (er, re,  bo) {
		console.log("fjerenet");
		//console.log(bo);
		callback();
	})
}