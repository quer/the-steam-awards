var cheerio = require('cheerio');
var apiKey = "xxxxx"; // to get most played game, to make a recommend on a game whit more then 5 min on.
var skipListToAutoNomination = [3];
module.exports = function(steamClient, _requestCommunity, _requestStore, sessionID, options, callback){
	if(apiKey == "xxxxx"){
		console.log("you need to setup your api key. or remove this and skip from the GetMostPlayedGame methode")
		throw
	}
	seeIfHaveAll(_requestStore, sessionID, function () {
		GetMostPlayedGame(_requestCommunity, steamClient.steamID, function (appid) { //OBS the game must have played over 5 min. 
			console.log(appid);
			vote(3, appid, _requestStore, sessionID, function () {
				Make(_requestCommunity, _requestStore, sessionID, steamClient.steamID, appid, callback);
			})
		})
	});

};

function vote(categoryid, appid, _request, sessionID, callback) {
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

function Make(_requestCommunity, _requestStore, sessionID, steamID, appid, callback) {
	var url = 'https://store.steampowered.com/friends/recommendgame';
	var form = {
		appid: appid,
		comment: "Great game!",
		disable_comments: 1,
		is_public: false,
		language: "english",
		rated_up: true,
		received_compensation: 0,
		sessionid: sessionID,
		steamworksappid: appid
	}

	_requestStore.post({
		url: url,
		form: form
	}, function (error, response, body) {
		//console.log(error);
		//console.log(body);
		console.log("created");
		setTimeout(function(){
			removeMake(_requestCommunity, _requestStore, sessionID, steamID, appid, callback)
		}, 2000);
	});
}
function removeMake(_requestCommunity, _requestStore, sessionID, steamID, appid, callback) {
	_requestCommunity.post({
		url: 'https://steamcommunity.com/profiles/'+steamID+'/recommended/',
		form: {
			action: "delete",
			sessionid: sessionID,
			appid: appid
		}
	}, function (er, re,  bo) {
		console.log("fjerenet");
		//console.log(bo);
		callback();
	})
}
function seeIfHaveAll(_requestStore, sessionID, callback) {
	_requestStore.get('https://store.steampowered.com/steamawards/nominations', function (error, response, body) {
		var $ = cheerio.load(body);
		var nomination_rows = $(".nomination_row");
		var loop = function (list, index, returnCallback) {
			if(list.length > index){
				var nomination_row = $(list[index]);
				if(!nomination_row.hasClass('has_nomination') && !skipListToAutoNomination.includes(index + 1) ){
					console.log("need index " + (index+1));
					MakeNominations(index + 1, _requestStore, sessionID)
					.then(function () {
						loop(list, ++index, returnCallback);
					})
				}else{
					loop(list, ++index, returnCallback);
				}
			}else{
				returnCallback();
			}
		}
		loop(nomination_rows, 0, callback);
	})
}
function MakeNominations(index, _requestStore, sessionID) {
	return new Promise(function (resolve) {
		var url = "https://store.steampowered.com/search/suggest?term={search}&f=games&cc=US&l=danish&excluded_content_descriptors%5B%5D=3&excluded_content_descriptors%5B%5D=4&v=7294643&require_type=game&release_date_max=2019-12-03T18%3A00%3A00Z&release_date_min=2018-11-27T18%3A00%3A00Z";
		var search = "a";
		switch (index) {
			case 2:
				url = url + "&vrsupport=1";
				break;
			case 3:
				resolve();
				return;																				
			default:
				break;
		}
		getUnUsedAppId(_requestStore, url, 0)
		.then(function (appId) {
			vote(index, appId, _requestStore, sessionID, function () {
				return resolve();
			})
		})
	})	
}
const alphabet = [...'abcdefghijklmnopqrstuvwxyz']
var usedApps = [];
function getUnUsedAppId(_requestStore, url, searchIndex) {
	return new Promise(function (resolve) {
		_requestStore.get(url.replace("{search}", alphabet[searchIndex]), function (error, response, body) {
			var $ = cheerio.load(body);
			var matchs = $(".match");
			var newAppId = null;
			matchs.each( function(i, elem) {
				var appid = $(this).attr("data-ds-appid");
				if(newAppId == null && parseInt(appid) && !usedApps.includes(appid)){
					newAppId = appid;
				}
			});
			
			if(newAppId == null){
				getUnUsedAppId(_requestStore, url, ++searchIndex)
				.then(resolve);
			}else{
				usedApps.push(newAppId);
				console.log(newAppId, searchIndex, alphabet[searchIndex])
				resolve(newAppId);
			}
		});
	});
}

function GetMostPlayedGame(_requestCommunity, steamId, callback) {
	_requestCommunity.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+apiKey+'&steamid='+steamId+'&format=json', function (error, response, body) {
		var json = JSON.parse(body);
		json.response.games.sort(function(a, b){return b.playtime_forever - a.playtime_forever});
		callback(json.response.games[0]);
	})
}