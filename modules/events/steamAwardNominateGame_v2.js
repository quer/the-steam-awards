var cheerio = require('cheerio');
var apiKey = "xxxxx"; // to get most played game, to make a recommend on a game whit more then 5 min on.
var vrsupportKey = "62";
var IdToSelfVoteOn = "63";
var idleGameTime = 5 // 5 min 
module.exports = async function(steamClient, _requestCommunity, _requestStore, sessionID, options, callback){
	if(apiKey == "xxxxx"){
		console.log("you need to setup your api key. or remove this and skip from the GetMostPlayedGame methode")
		callback();
		return;
	}
	
	seeIfHaveAll(_requestStore, sessionID, function () {
		GetMostPlayedGame(_requestCommunity, _requestStore, steamClient.steamID, options, function (appid) { //OBS the game must have played over 5 min. 
			console.log(appid);
			vote(IdToSelfVoteOn, appid.appid, _requestStore, sessionID, function () {
				options.steamUser.gamesPlayed([{ game_id: appid.appid }]);					
				//Info wee remove the Review 
				removeMake(_requestCommunity, _requestStore, sessionID, steamClient.steamID, appid.appid, function () {
					Make(_requestCommunity, _requestStore, sessionID, steamClient.steamID, appid.appid, function () {
						setTimeout(async function () {						
							try {
								await EnsureWeAreDone(_requestStore, options);
								console.log("done");
								callback();
								return;
							} catch (error) {
								module.exports(steamClient, _requestCommunity, _requestStore, sessionID, options, callback);// if not all did go as we expected we rerun. there is build a save ind so we only nomination missing.
							}
							
						}, 60000 * idleGameTime);
					});
				})
			})
		})
	});

};
function EnsureWeAreDone(_requestStore, options) {
	return new Promise(function (resolve, reject) {
		_requestStore.get('https://store.steampowered.com/steamawards/nominations', function (error, response, body) {
			var $ = cheerio.load(body);
			if($(".badge_preview.level_4.current").length <= 0){
				//it did not complete all
				//let see why
				var rowsMissing = [];
				var nomination_rows = $(".nomination_row");
				for (let i = 0; i < nomination_rows.length; i++) {
					const nomination_row = nomination_rows[i];
					var rowjquery = $(nomination_row);
					if(!rowjquery.hasClass('has_nomination')){
						rowsMissing.push(i + 1); // to show human read row number
					}
				}
				var onlyLookAtPlayGameAndReviewTaskStatus = $($(".badge_tasks_right")[0]).find(".badge_task");
				var haveDonePlaygame = onlyLookAtPlayGameAndReviewTaskStatus[0] && $(onlyLookAtPlayGameAndReviewTaskStatus[0]).find(".nominate_check").length > 0 ? "true" : "false";
				var haveDoneReview  = onlyLookAtPlayGameAndReviewTaskStatus[1] && $(onlyLookAtPlayGameAndReviewTaskStatus[1]).find(".nominate_check").length > 0? "true" : "false";
				console.log(options.accountPretty +" did not complete the flow. status: ");
				console.table([
					{massage: "missing nominations rows", status: rowsMissing.join(",")},
					{massage: "have played the game", status: haveDonePlaygame},
					{massage: "have create a review for the game", status: haveDoneReview},
				]);
				reject();
				return;
			}else{
				resolve();
				return;
			}
		});
	});
	
}
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
//make a Review 
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
//remove a Review 
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
		//add all allready used appids
		for (let i = 0; i < nomination_rows.length; i++) {
			const nomination_row = nomination_rows[i];
			var rowjquery = $(nomination_row);
			if(rowjquery.hasClass('has_nomination')){
				var appUrl = rowjquery.find(".younominated_game");
				if(appUrl && appUrl.length > 0){
					appUrl = appUrl.attr("href");
					appUrl = appUrl.split("/");
					usedApps.push(appUrl[4]);
				}
			}
		}
		
		//loop all missing
		var loop = function (list, index, returnCallback) {
			if(list.length > index){
				var nomination_row = $(list[index]);
				if(!nomination_row.hasClass('has_nomination') ){
					var catId = $(nomination_row.find(".nominate_button")).attr("data-categoryid")
					console.log("need index " + (index+1));
					MakeNominations(catId, _requestStore, sessionID)
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
function MakeNominations(catId, _requestStore, sessionID) {
	return new Promise(function (resolve) {
		var url = "https://store.steampowered.com/search/suggest?term={search}&f=games&cc=DK&l=english&excluded_content_descriptors%5B%5D=3&excluded_content_descriptors%5B%5D=4&v=13235800&require_type=game&release_date_max=2021-11-30T18%3A00%3A00Z&release_date_min=2020-12-01T18%3A00%3A00Z"
		var search = "a";
		switch (catId) {
			case vrsupportKey:
				url = url + "&vrsupport=1";
				break;
			case IdToSelfVoteOn: // here we add a game that the account own.
				resolve();
				return;																				
			default:
				break;
		}
		getUnUsedAppId(_requestStore, url, 0)
		.then(function (appId) {
			vote(catId, appId, _requestStore, sessionID, function () {
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

function GetMostPlayedGame(_requestCommunity, _requestStore, steamId, options, callback) {
	_requestCommunity.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+apiKey+'&steamid='+steamId+'&format=json', async function (error, response, body) {
		var json = JSON.parse(body);
		json.response.games.sort(function(a, b){return b.playtime_forever - a.playtime_forever});
		var ownedApps = json.response.games;
		for (let i = 0; i < ownedApps.length; i++) {
			const ownedApp = ownedApps[i];
			if(await EnSureGameCanBeNominated(_requestStore, ownedApp.appid)){
				callback(ownedApp);
				return;
			}
		}
		console.error(options.accountPretty + " do not own a valid game, that can be nominated!")
		callback(json.response.games[0]);
	})
}
function EnSureGameCanBeNominated(_requestStore, appid) {
	return new Promise(function (resolve) {
		_requestStore.get('https://store.steampowered.com/app/'+appid,  function (error, response, body) {
			var $ = cheerio.load(body);
			
			var canNominate = $(".steamaward_nominate_gamepage_ctn").length > 0;
			resolve(canNominate)
		})
	})
}