// 1 -> hare -> white
// 2 -> tortoise -> green
// 3 -> corgi -> yellow
// 4 -> cockatiel -> blue
// 5 -> pig - > red
var joinTeam = 3; 
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestStore.post({
		url: 'https://store.steampowered.com/grandprix/ajaxjointeam/',
		form:{
            sessionid: SessionID,
            teamid: joinTeam
		},
		headers: {
			'Origin': 'https://store.steampowered.com',
			'Accept': '*/*',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Referer': 'https://store.steampowered.com/lny2019/rewards'
		}
	}, function (error, response, body) {
        console.log(body);
        callback();
    });
}