module.exports = async function(steamClient, _requestCommunity, _requestStore, sessionID, options, callback){

	await vote(50, 1190460, _requestStore, sessionID, 0);
	await vote(51, 546560, _requestStore, sessionID, 0);
	await vote(52, 730, _requestStore, sessionID, 0);
	await vote(53, 1172620, _requestStore, sessionID, 0);
	await vote(55, 1190460, _requestStore, sessionID, 0);
	await vote(58, 1174180, _requestStore, sessionID, 0);
	await vote(56, 1158310, _requestStore, sessionID, 0);
	await vote(54, 1238810, _requestStore, sessionID, 0);
	await vote(57, 976730, _requestStore, sessionID, 0);
	await vote(59, 526870, _requestStore, sessionID, 0);
	callback();
}
/*
each cat and appid
[
    {
        "id": "50",
        "name": "Game of the Year",
        "ToVoteOn": [
            "1174180",
            "1145360",
            "782330",
            "1097150",
            "1190460"
        ]
    },
    {
        "id": "51",
        "name": "VR Game of the Year",
        "ToVoteOn": [
            "546560",
            "739630",
            "1104380",
            "1019550",
            "1222730"
        ]
    },
    {
        "id": "52",
        "name": "Labor of Love",
        "ToVoteOn": [
            "730",
            "945360",
            "105600",
            "292030",
            "275850"
        ]
    },
    {
        "id": "53",
        "name": "Better With Friends",
        "ToVoteOn": [
            "1097150",
            "1172620",
            "397540",
            "548430",
            "632360"
        ]
    },
    {
        "id": "55",
        "name": "Most Innovative Gameplay",
        "ToVoteOn": [
            "1190460",
            "870780",
            "1049410",
            "881100",
            "1167630"
        ]
    },
    {
        "id": "58",
        "name": "Outstanding Story-Rich Game",
        "ToVoteOn": [
            "1174180",
            "1222140",
            "1030840",
            "412020",
            "1151640"
        ]
    },
    {
        "id": "56",
        "name": "Best Game You Suck At",
        "ToVoteOn": [
            "1172470",
            "1158310",
            "1139900",
            "1313860",
            "493520"
        ]
    },
    {
        "id": "54",
        "name": "Outstanding Visual Style",
        "ToVoteOn": [
            "1057090",
            "1238810",
            "1241700",
            "997070",
            "362890"
        ]
    },
    {
        "id": "57",
        "name": "Best Soundtrack",
        "ToVoteOn": [
            "782330",
            "976730",
            "1289310",
            "1222680",
            "1113000"
        ]
    },
    {
        "id": "59",
        "name": "Sit Back and Relax",
        "ToVoteOn": [
            "1222670",
            "1250410",
            "526870",
            "837470",
            "427520"
        ]
    }
]
// code to create liste next year
var list = [];
jQuery(".vote_category_bg").each(function(){
	var obj = {id: jQuery(this).find(".category_nominations_ctn").attr("data-categoryid"),
		name: jQuery(this).find(".category_title.award_title").text(),
		ToVoteOn: []
	}
	jQuery(this).find(".category_nomination").each(function(){
	if(jQuery(this).attr("data-vote-appid"))
		obj.ToVoteOn.push(jQuery(this).attr("data-vote-appid"))
	})
	list.push(obj)
})
JSON.stringify(list, null, 4)
*/

function vote(categoryid, appid, _request, sessionID, dev) {
	new Promise(function (resolve) {
		_request.post({
			url: 'https://store.steampowered.com/salevote',
			form:{
				sessionid: sessionID,
				appid: appid,
				voteid: categoryid,
				developerid: dev
			},
			headers: {
				'Origin': 'https://store.steampowered.com',
				'Accept': '*/*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Referer': 'https://store.steampowered.com/steamawards/category/'+categoryid
	
			}
		}, function (error, response, body) {
			setTimeout(function(){
				resolve();
			}, 500);
		});	
	})	
}
